#!/bin/bash

# Check if ffmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo "FFmpeg is required but not installed. Please install FFmpeg first."
    exit 1
fi

# Default values
FPS=15
SCALE_WIDTH=800
QUALITY=90

# Help function
show_help() {
    echo "Usage: $0 [-f fps] [-w width] [-q quality] input_directory"
    echo
    echo "Options:"
    echo "  -f fps      Frames per second (default: 15)"
    echo "  -w width    Output width in pixels (default: 800)"
    echo "  -q quality  Quality percentage (default: 90)"
    echo "  -h         Show this help message"
    echo
    echo "Example:"
    echo "  $0 -f 12 -w 600 -q 85 ./videos"
}

# Parse command line options
while getopts "f:w:q:h" opt; do
    case $opt in
        f) FPS=$OPTARG ;;
        w) SCALE_WIDTH=$OPTARG ;;
        q) QUALITY=$OPTARG ;;
        h) show_help; exit 0 ;;
        \?) echo "Invalid option: -$OPTARG" >&2; exit 1 ;;
    esac
done

# Remove the options from the positional parameters
shift $((OPTIND-1))

# Check if input directory is provided
if [ -z "$1" ]; then
    echo "Error: Input directory is required"
    show_help
    exit 1
fi

INPUT_DIR="$1"
OUTPUT_DIR="${INPUT_DIR}/gifs"

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Convert each video file to GIF
find "$INPUT_DIR" -type f \( -name "*.mp4" -o -name "*.mov" -o -name "*.avi" -o -name "*.mkv" \) | while read -r video; do
    filename=$(basename "$video")
    filename_noext="${filename%.*}"
    output_path="${OUTPUT_DIR}/${filename_noext}.gif"
    
    echo "Converting: $filename"
    
    # Generate palette for better quality
    palette_path="/tmp/palette.png"
    filters="fps=$FPS,scale=$SCALE_WIDTH:-1:flags=lanczos"
    
    ffmpeg -v warning -i "$video" -vf "$filters,palettegen=stats_mode=diff" -y "$palette_path"
    
    # Create GIF using the palette
    ffmpeg -v warning -i "$video" -i "$palette_path" -lavfi "$filters [x]; [x][1:v] paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle" \
        -y "$output_path"
    
    # Clean up palette
    rm "$palette_path"
    
    echo "Created: $output_path"
done

echo "Conversion complete! GIFs are saved in: $OUTPUT_DIR"