package com.abdownloadmanager.desktop.nativemessaging.host

import com.abdownloadmanager.desktop.utils.singleInstance.IPCServiceProviderAwakerSupport
import com.abdownloadmanager.desktop.utils.singleInstance.service.IDefaultAppIPCService
import com.abdownloadmanager.integration.model.AddDownloadsFromIntegration
import kotlinx.serialization.json.*

class AddDownloadNativeRequestHandler(
    private val json: Json,
    private val appIPC: IPCServiceProviderAwakerSupport<IDefaultAppIPCService>,
) : NativeMessagingMessageHandler {
    override fun accept(request: NativeMessagingMessage.Content): Boolean {
        return request.action == "add"
    }

    override suspend fun handle(request: NativeMessagingMessage.Content): NativeMessagingMessage.Content {
        val integrationRequest = json.decodeFromString<AddDownloadsFromIntegration>(request.payload)
        appIPC.getService().useService {
            it.addDownloadByGui(integrationRequest)
        }
        return context(json) {
            NativeMessagingMessage.Content.boolean(true)
        }
    }
}

class PingNativeRequestHandler(
    private val json: Json
) : NativeMessagingMessageHandler {
    override fun accept(request: NativeMessagingMessage.Content): Boolean {
        return request.action == "ping"
    }

    override suspend fun handle(request: NativeMessagingMessage.Content): NativeMessagingMessage.Content {
        return context(json) {
            NativeMessagingMessage.Content.boolean(true)
        }
    }
}

object DefinedNativeMessagingHandlers {
    fun getAll(
        json: Json, appIPC: IPCServiceProviderAwakerSupport<IDefaultAppIPCService>,
    ): List<NativeMessagingMessageHandler> {
        return listOf(
            AddDownloadNativeRequestHandler(json, appIPC),
            PingNativeRequestHandler(json),
            YouTubeNativeRequestHandler(json, appIPC)
        )
    }
}

class YouTubeNativeRequestHandler(
    private val json: Json,
    private val appIPC: IPCServiceProviderAwakerSupport<IDefaultAppIPCService>,
) : NativeMessagingMessageHandler {
    override fun accept(request: NativeMessagingMessage.Content): Boolean =
        request.action in setOf("downloadYouTube", "downloadBilibili")

    override suspend fun handle(request: NativeMessagingMessage.Content): NativeMessagingMessage.Content {
        val payload = json.parseToJsonElement(request.payload).jsonObject
        val url = java.net.URI(payload.getValue("url").jsonPrimitive.content)
        val bilibili = request.action == "downloadBilibili"
        val rows = payload["cookies"]?.jsonArray?.map { it.jsonPrimitive.content }.orEmpty()
        require((bilibili || rows.isNotEmpty()) && rows.size <= 500 && rows.sumOf { it.length } < 128000)
        require(rows.all {
            val fields = it.split('\t')
            val domain = fields.first().trimStart('.')
            fields.size == 7 && '\n' !in it && '\r' !in it &&
                (if (bilibili) {
                    (domain == "bilibili.com" || domain == "api.bilibili.com") && fields[5] == "SESSDATA"
                } else domain == "youtube.com" || domain.endsWith(".youtube.com"))
        })
        require(url.scheme == "https" && url.userInfo == null && url.port == -1)
        val id: String
        val page: String
        if (bilibili) {
            require(url.host == "www.bilibili.com" || url.host == "bilibili.com")
            val match = requireNotNull(Regex("/video/(BV[A-Za-z0-9]{10}|av[0-9]+)/?").matchEntire(url.path))
            id = match.groupValues[1]
            val part = url.rawQuery?.split('&')?.firstOrNull { it.matches(Regex("p=[1-9][0-9]{0,5}")) }
            page = "https://www.bilibili.com/video/$id" + (part?.let { "?$it" } ?: "")
        } else {
            require(url.host in setOf("www.youtube.com", "youtube.com", "m.youtube.com") && url.path == "/watch")
            id = requireNotNull(url.rawQuery?.split('&')?.firstOrNull { it.startsWith("v=") }?.substring(2))
            require(id.matches(Regex("[A-Za-z0-9_-]{11}")))
            page = "https://www.youtube.com/watch?v=$id"
        }
        val folder = java.io.File(
            requireNotNull(com.abdownloadmanager.desktop.utils.AppInfo.installationFolder), "YouTube"
        )
        val media = kotlinx.coroutines.withContext(kotlinx.coroutines.Dispatchers.IO) {
            resolveMedia(folder, page, rows, bilibili)
        }
        val title = media["title"]?.jsonPrimitive?.contentOrNull.orEmpty()
        val safeTitle = title.map { character ->
            if (character < ' ' || character in "<>:\"/\\|?*") '_' else character
        }.joinToString("").trim().take(140).trimEnd(' ', '.')
        val stem = when {
            safeTitle.isBlank() -> id
            safeTitle.substringBefore('.').uppercase() in setOf("CON", "PRN", "AUX", "NUL") ||
                Regex("(COM|LPT)[1-9]").matches(safeTitle.substringBefore('.').uppercase()) -> "_$safeTitle"
            else -> safeTitle
        }
        val height = media["height"]?.jsonPrimitive?.intOrNull
        val name = if (height != null && height > 0) "$stem [${height}p].mp4" else "$stem.mp4"

        val tracks = if (bilibili) media["requested_formats"]?.jsonArray?.map { it.jsonObject } else null
        val item = if (bilibili && tracks?.size == 2) {
            val ordered = tracks.sortedBy { it["vcodec"]?.jsonPrimitive?.contentOrNull == "none" }
            val sources = ordered.map { createDownload(it, page, name) as
                com.abdownloadmanager.integration.model.HttpDownloadCredentialsFromIntegration }
            val token = java.util.UUID.randomUUID().toString()
            val plan = ir.amirab.downloader.connection.BilibiliMux.planFile(token)
            plan.parentFile.mkdirs()
            java.io.File(plan.parentFile, "$token.name").writeText("$stem.mp4")
            media["duration"]?.jsonPrimitive?.doubleOrNull?.takeIf { it.isFinite() && it > 0 }?.let {
                java.io.File(plan.parentFile, "$token.duration").writeText(it.toString())
            }
            java.io.DataOutputStream(plan.outputStream()).use { out ->
                sources.forEach { source ->
                    out.writeUTF(source.link)
                    val headers = source.headers.orEmpty()
                    out.writeInt(headers.size)
                    headers.forEach { (key, value) -> out.writeUTF(key); out.writeUTF(value) }
                }
            }
            com.abdownloadmanager.integration.model.HttpDownloadCredentialsFromIntegration(
                "https://bilibili-mux.invalid/$token", null, page, "$stem.mp4"
            )
        } else {
            createDownload(media, page, if (bilibili) "$stem.mp4" else name)
        }
        appIPC.getService().useService {
            it.addDownloadByGui(AddDownloadsFromIntegration(listOf(item)))
        }
        return context(json) { NativeMessagingMessage.Content.boolean(true) }
    }
    private fun createDownload(
        media: JsonObject, page: String, name: String,
    ): com.abdownloadmanager.integration.model.IDownloadCredentialsFromIntegration {
        val stream = media.getValue("url").jsonPrimitive.content
        require(java.net.URI(stream).scheme == "https")
        val headers = media["http_headers"]?.jsonObject?.mapNotNull { (key, value) ->
            if (key.lowercase() in setOf("user-agent", "accept", "origin", "referer")) {
                key to value.jsonPrimitive.content
            } else null
        }?.toMap().orEmpty().toMutableMap()
        if (java.net.URI(page).host == "www.bilibili.com" &&
            headers.keys.none { it.equals("Referer", ignoreCase = true) }) {
            headers["Referer"] = page
        }
        return when (media.getValue("protocol").jsonPrimitive.content) {
            "https" -> com.abdownloadmanager.integration.model.HttpDownloadCredentialsFromIntegration(
                stream, headers, page, name
            )
            "m3u8_native", "m3u8" -> com.abdownloadmanager.integration.model.HLSDownloadCredentialsFromIntegration(
                stream, headers, page, name
            )
            else -> error("Unsupported media protocol.")
        }
    }

    private fun resolveMedia(folder: java.io.File, page: String, rows: List<String>, bilibili: Boolean): JsonObject {
        val cookieFile = java.nio.file.Files.createTempFile("abdm-youtube-", ".txt")
        val output = java.nio.file.Files.createTempFile("abdm-media-", ".json")
        val errors = java.nio.file.Files.createTempFile("abdm-media-errors-", ".txt")
        try {
            java.nio.file.Files.writeString(
                cookieFile, "# Netscape HTTP Cookie File\n" + rows.joinToString("\n", postfix = "\n")
            )
                        val proxySettings = java.io.File(
                com.abdownloadmanager.desktop.utils.AppInfo.definedPaths.proxySettingsFile.toString()
            )
            val proxyArgs = if (proxySettings.isFile) {
                val settings = json.parseToJsonElement(proxySettings.readText()).jsonObject
                val proxy = settings["proxyWithRules"]?.jsonObject?.get("proxy")?.jsonObject
                val host = proxy?.get("host")?.jsonPrimitive?.contentOrNull
                val port = proxy?.get("port")?.jsonPrimitive?.intOrNull
                if (settings["proxyMode"]?.jsonPrimitive?.contentOrNull == "manual" &&
                    proxy?.get("type")?.jsonPrimitive?.contentOrNull == "http" &&
                    host in setOf("localhost", "127.0.0.1") && port != null && port in 1..65535
                ) listOf("--proxy", "http://$host:$port") else emptyList()
            } else emptyList()
            val sessionArgs = if (rows.isEmpty()) emptyList() else listOf("--cookies", cookieFile.toString())
            val format = if (bilibili) "bv[ext=mp4][protocol=https]+ba[ext=m4a][protocol=https]/b[ext=mp4][protocol=https]" else "b[ext=mp4][protocol~='^(https|m3u8(_native)?)$']"
            val process = ProcessBuilder(
                java.io.File(folder, "yt-dlp.exe").path,
                *proxyArgs.toTypedArray(), "--ignore-config", "--no-cache-dir", "--no-playlist", "--simulate", "--write-subs", "--write-auto-subs",
                "--socket-timeout", "12", "--retries", "0", "--extractor-retries", "0",
                "--windows-filenames", "--js-runtimes", "deno:" + java.io.File(folder, "deno.exe").path,
                *sessionArgs.toTypedArray(), "--no-warnings", "--dump-single-json",
                "--format-sort-force", "-S", "res,fps,br",
                "-f", format,
                "--", page
            ).directory(folder).redirectOutput(output.toFile()).redirectError(errors.toFile()).start()
            try {
                check(process.waitFor(45, java.util.concurrent.TimeUnit.SECONDS)) { "YouTube format lookup timed out." }
                                check(process.exitValue() == 0) {
                    val detail = java.nio.file.Files.readString(errors)
                    when {
                        detail.contains("not a bot", true) -> "YouTube requires additional sign-in verification."
                        detail.contains("requested format is not available", true) -> "No compatible combined MP4 or HLS format is available."
                        detail.contains("timed out", true) -> "YouTube connection timed out."
                        detail.contains("private video", true) -> "This video requires account access."
                        detail.contains("proxy", true) -> "Could not connect using the AB proxy."
                        else -> if (bilibili) "Bilibili media lookup failed." else "YouTube media lookup failed."
                    }
                }
                val media = json.parseToJsonElement(java.nio.file.Files.readString(output)).jsonObject
                if (listOf("subtitles", "automatic_captions").any { field ->
                    (media[field] as? JsonObject)?.keys?.any {
                        it.startsWith("zh", true) || it.startsWith("ai-zh", true) ||
                            it == "en" || it.startsWith("en-")
                    } == true
                }) {
                    runCatching {
                        ir.amirab.downloader.connection.CaptionTextExport.prepare(
                            folder, page, proxyArgs + sessionArgs + listOf(
                                "--ignore-config", "--no-cache-dir", "--no-playlist", "--socket-timeout", "6",
                                "--retries", "0", "--extractor-retries", "0",
                                "--js-runtimes", "deno:" + java.io.File(folder, "deno.exe").path,
                                "-f", format
                            )
                        )
                    }
                }
                return media
            } finally {
                if (process.isAlive) process.destroyForcibly()
            }
        } finally {
            java.nio.file.Files.deleteIfExists(cookieFile)
            java.nio.file.Files.deleteIfExists(output)
            java.nio.file.Files.deleteIfExists(errors)
        }
    }
}
