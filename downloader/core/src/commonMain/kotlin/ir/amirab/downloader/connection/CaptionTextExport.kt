package ir.amirab.downloader.connection

import java.io.File
import java.nio.file.Files
import java.nio.file.FileAlreadyExistsException
import java.security.MessageDigest
import java.util.HexFormat

object CaptionTextExport {
    private fun cache(page: String): File {
        val key = HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(page.toByteArray()))
        return File(requireNotNull(System.getProperty("abdm.mux.data")), "captions-$key.txt")
    }

    fun prepare(folder: File, page: String, parserArgs: List<String>) {
        val directory = Files.createTempDirectory("abdm-caption-").toFile()
        try {
            val child = ProcessBuilder(
                listOf(File(folder, "yt-dlp.exe").path) + parserArgs + listOf(
                    "--skip-download", "--write-subs", "--write-auto-subs",
                    "--sub-langs", "zh.*,ai-zh.*,en,en-.*", "--sub-format", "srt/vtt/best",
                    "--convert-subs", "srt", "--ffmpeg-location", File(folder, "ffmpeg.exe").path,
                    "-o", File(directory, "caption.%(ext)s").path, "--", page
                )
            ).redirectError(ProcessBuilder.Redirect.DISCARD).redirectOutput(ProcessBuilder.Redirect.DISCARD).start()
            try {
                if (!child.waitFor(20, java.util.concurrent.TimeUnit.SECONDS)) return
                val chosen = directory.listFiles().orEmpty().filter { it.extension == "srt" }
                    .sortedWith(compareBy<File> {
                        val lang = it.name.removePrefix("caption.").removeSuffix(".srt")
                        when {
                            lang.startsWith("zh", true) -> 0
                            lang.startsWith("ai-zh", true) -> 1
                            else -> 2
                        }
                    }.thenBy { it.name }).firstOrNull() ?: return
                val text = render(chosen.readText())
                if (text.isNotBlank()) {
                    val file = cache(page)
                    Files.createDirectories(file.parentFile.toPath())
                    Files.writeString(file.toPath(), text)
                }
            } finally {
                if (child.isAlive) { child.destroyForcibly(); child.waitFor() }
            }
        } finally {
            directory.listFiles().orEmpty().forEach { it.delete() }
            directory.delete()
        }
    }

    fun render(srt: String): String = srt.removePrefix("\uFEFF").trim()
        .split(Regex("\\r?\\n[ \\t]*\\r?\\n"))
        .mapNotNull { cue ->
            val lines = cue.lines()
            val time = lines.indexOfFirst { " --> " in it }
            if (time < 0) null else {
                val text = lines.drop(time + 1).joinToString(" ").replace(Regex("</?(?:i|b|u)>"), "").trim()
                if (text.isEmpty()) null else "[${lines[time].substringBefore(" --> ").trim()}] $text"
            }
        }.joinToString("\n", postfix = "\n").takeUnless { it.isBlank() }.orEmpty()

    fun save(page: String?, video: File) {
        if (page == null || !video.isFile) return
        val source = cache(page)
        if (!source.isFile) return
        val target = video.resolveSibling("${video.nameWithoutExtension}.txt")
        try {
            Files.copy(source.toPath(), target.toPath())
        } catch (_: FileAlreadyExistsException) {
            // An existing subtitle file may contain the user's edits.
        }
    }
}
