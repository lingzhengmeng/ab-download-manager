package ir.amirab.downloader.connection

import ir.amirab.downloader.connection.response.HttpResponseInfo
import java.io.DataInputStream
import java.io.File
import java.nio.file.Files
import java.util.concurrent.TimeUnit
import kotlinx.coroutines.currentCoroutineContext
import kotlinx.coroutines.ensureActive
import okio.ForwardingSource
import okio.source
import okio.Buffer
import ir.amirab.downloader.connection.response.expectSuccess
import ir.amirab.downloader.downloaditem.http.HttpDownloadCredentials

object BilibiliMux {
    private val root get() = File(requireNotNull(System.getProperty("abdm.mux.data")))
    private val ffmpeg get() = File(requireNotNull(System.getProperty("abdm.mux.ffmpeg")))
    private val pattern = Regex("https://bilibili-mux\\.invalid/([a-f0-9-]{36})")

    class Transfer {
        @Volatile var received = 0L
        @Volatile var total: Long? = null
    }

    private val active = java.util.concurrent.ConcurrentHashMap<String, Transfer>()
    fun transfer(url: String): Transfer? = token(url)?.let(active::get)

    fun token(url: String): String? = pattern.matchEntire(url)?.groupValues?.get(1)
    fun planFile(token: String) = File(root, "$token.plan")

    fun info(url: String, token: String): HttpResponseInfo {
        check(planFile(token).isFile) { "Bilibili media plan is missing." }
        val title = File(root, "$token.name").takeIf { it.isFile }?.readText()
        val headers = mutableMapOf("content-type" to "video/mp4")
        if (!title.isNullOrBlank()) {
            val encoded = java.net.URLEncoder.encode(title, Charsets.UTF_8).replace("+", "%20")
            headers["content-disposition"] = "attachment; filename*=UTF-8''$encoded"
        }
        File(root, "$token.duration").takeIf { it.isFile }?.readText()?.let {
            headers["x-abdm-media-duration"] = it
        }
        return HttpResponseInfo(200, "OK", url, responseHeaders = headers)
    }

    suspend fun connect(url: String, token: String, start: Long?, client: HttpDownloaderClient): Connection<HttpResponseInfo> {
        check(start == null || start == 0L) { "This Bilibili task must restart from the beginning." }
        val response = info(url, token)
        val directory = Files.createTempDirectory(root.toPath(), "mux-").toFile()
        val video = File(directory, "video.mp4")
        val audio = File(directory, "audio.m4a")
        val output = File(directory, "output.mp4")
        val transfer = Transfer()
        check(active.putIfAbsent(token, transfer) == null) { "Bilibili task already running." }
        try {
            val sources = DataInputStream(planFile(token).inputStream()).use { plan ->
                List(2) {
                    val source = plan.readUTF()
                    require(java.net.URI(source).scheme == "https")
                    val headers = List(plan.readInt()) { plan.readUTF() to plan.readUTF() }.toMap()
                    HttpDownloadCredentials(source, headers = headers)
                }
            }
            val lengths = sources.map { source ->
                runCatching { client.test(source).expectSuccess().totalLength }.getOrNull()
                    .also { currentCoroutineContext().ensureActive() }
            }
            if (lengths.all { it != null && it > 0 }) transfer.total = lengths.sumOf { it ?: 0L }
            for ((index, track) in listOf(video, audio).withIndex()) {
                client.connect(sources[index], null, null).use { connection ->
                    connection.responseInfo.expectSuccess()
                    track.outputStream().buffered().use { destination ->
                        val buffer = Buffer()
                        while (true) {
                            currentCoroutineContext().ensureActive()
                            val count = connection.source.read(buffer, 65536)
                            if (count == -1L) break
                            destination.write(buffer.readByteArray(count))
                            transfer.received += count
                        }
                    }
                }
            }
            transfer.total = transfer.received
            runTool(listOf("-i", video.path, "-i", audio.path, "-map", "0:v:0", "-map", "1:a:0",
                "-c", "copy", "-movflags", "+faststart", output.path), directory)
            check(output.length() > 0L)
            video.delete()
            audio.delete()
            return Connection(object : ForwardingSource(output.source()) {
                override fun close() {
                    try { super.close() } finally { output.delete(); directory.delete(); active.remove(token, transfer) }
                }
            }, -1, response)
        } catch (error: Throwable) {
            active.remove(token, transfer)
            video.delete(); audio.delete(); output.delete(); directory.delete()
            throw error
        }
    }

    private suspend fun runTool(args: List<String>, directory: File) {
        val child = ProcessBuilder(listOf(ffmpeg.path, "-nostdin", "-hide_banner", "-loglevel", "error") + args)
            .directory(directory).redirectError(ProcessBuilder.Redirect.DISCARD)
            .redirectOutput(ProcessBuilder.Redirect.DISCARD).start()
        try {
            while (!child.waitFor(250, TimeUnit.MILLISECONDS)) currentCoroutineContext().ensureActive()
            check(child.exitValue() == 0) { "Bilibili track download or MP4 merge failed." }
        } finally {
            if (child.isAlive) { child.destroyForcibly(); child.waitFor() }
        }
    }
}
