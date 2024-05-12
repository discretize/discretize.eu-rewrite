#!/bin/bash

# This script is not meant to be executed by people other than princeps, unless you know what you are doing and have wrangler setup correctly.

set -x
set -e

# parse arguments
if [ $# -eq 0 ]
  then
    echo "No arguments supplied"
    exit 1
fi

BUCKET_NAME="discretize-videos"
WRANGLER="../node_modules/.bin/wrangler"

# first argument is the video file mkv

# strip ending from filename 
filename=$(basename -- "$1")
FILENAME="${filename%.*}"
RESIZED="$FILENAME.resized.mp4"

mkdir -p "$FILENAME"


# 3440-2560 = 880 pixel to subtract from both sides to get to 16:9
# then downscale to 720p
ffmpeg -i "$1" -r 25 -filter:v "crop=iw-880:ih,scale=1280:720" -an "$RESIZED" 

# av1an -i "$RESIZED" -v "--cpu-used=4 --threads=12 --target-bitrate=400 " --pix-format yuv420p -o "$FILENAME/$FILENAME.av1.mp4"
ffmpeg -i "$RESIZED" -c:v libsvtav1 -pix_fmt yuv420p -crf 55 "$FILENAME/$FILENAME.av1.mp4" -y
# crazy slow
#ffmpeg -i "$RESIZED" -c:v libaom-av1 -b:v 400K "$FILENAME/$FILENAME.av1.mp4" -y
ffmpeg -i "$RESIZED" -c:v libvpx-vp9 -b:v 400K "$FILENAME/$FILENAME.vp9.mp4" -y
# iOS devices dont support VP9
ffmpeg -i "$RESIZED" -c:v libx264 -b:v 600K "$FILENAME/$FILENAME.x264.mp4" -y

rm "$RESIZED"



# upload all files in $FILENAME directory to R2

for f in "$FILENAME"/*; do
    echo "Uploading $f file..."
    $WRANGLER r2 object put "$BUCKET_NAME/$FILENAME/$(basename -- "$f")" --file "$f"
done
$WRANGLER r2 object put "$BUCKET_NAME/$FILENAME/$1" --file "$1"

# output the video component
echo "======================================="

echo "<GifPlayer sourceId=\"$FILENAME\" />"