# Windows-only script
$FfmpegVersion = "6.1"

mkdir bin
curl "https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-n$FfmpegVersion-latest-win64-lgpl-$FfmpegVersion.zip" -L -o ffmpeg.zip
Expand-Archive ffmpeg.zip
Move-Item "ffmpeg/ffmpeg-n$FfmpegVersion-latest-win64-lgpl-$FfmpegVersion/bin/ffmpeg.exe" ./bin/ffmpeg.exe
Remove-Item "ffmpeg.zip"
Remove-Item -Force -Recurse "ffmpeg"