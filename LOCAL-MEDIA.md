# Windows media integration

This branch ports the local AB Download Manager desktop changes and the Chrome extension used with them. The extension in browser-extension is version 1.5.2.15 and is the built extension bundle.

Build the desktop application using the JBR 25 toolchain and the Windows build instructions in the upstream README. Set SKIP_ANDROID_BUILD=true before running gradlew.bat createReleaseFolderForCi.

For YouTube and Bilibili, create a YouTube directory beside ABDownloadManager.exe and provide yt-dlp.exe, deno.exe and ffmpeg.exe from their respective distributions. The binaries are external runtime dependencies. The desktop application stores temporary media data under its configured application data directory. Set abdm.mux.data or abdm.mux.ffmpeg as JVM properties to override the corresponding paths.

Load browser-extension from chrome://extensions using Load unpacked. Start the matching desktop build to register its native messaging host. The existing user interaction confirms task creation in AB. Bilibili split tracks become one MP4 task. Chinese subtitles are preferred when the existing browser session exposes them, and available captions are saved as a TXT sidecar after completion.

The HLS downloader handles unencrypted TS and fMP4 playlists with one shared initialization file and separate segment files. Browser media ranking uses player duration, source and candidate duration. Site compatibility depends on the actual playlist and formats exposed by the site.

Upstream browser extension source and license are available at https://github.com/amir1376/ab-download-manager-browser-integration.
