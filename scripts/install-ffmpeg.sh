#!/bin/sh
mkdir bin
wget https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-n6.0-latest-linux64-lgpl-6.0.tar.xz
tar xvf ffmpeg-n6.0-latest-linux64-lgpl-6.0.tar.xz ffmpeg-n6.0-latest-linux64-lgpl-6.0/bin/ffmpeg
mv ffmpeg-n6.0-latest-linux64-lgpl-6.0/bin/ffmpeg ./bin/ffmpeg
rm -rf ffmpeg-n6.0-latest-linux64-lgpl-6.0 ffmpeg-n6.0-latest-linux64-lgpl-6.0.tar.xz