#!/bin/sh
FFMPEG_VERSION=6.1

mkdir bin
curl https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-n$FFMPEG_VERSION-latest-linux64-lgpl-$FFMPEG_VERSION.tar.xz -L -o ffmpeg.tar.xz
tar xvf ffmpeg.tar.xz ffmpeg-n$FFMPEG_VERSION-latest-linux64-lgpl-$FFMPEG_VERSION/bin/ffmpeg
mv ffmpeg-n$FFMPEG_VERSION-latest-linux64-lgpl-$FFMPEG_VERSION/bin/ffmpeg ./bin/ffmpeg
rm -rf ffmpeg-n$FFMPEG_VERSION-latest-linux64-lgpl-$FFMPEG_VERSION ffmpeg.tar.xz