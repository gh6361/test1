import os
import sys
from PIL import Image

def get_aspect_ratios(folder_path):
    # Common image extensions
    valid_exts = {".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp", ".avif"}
    
    # Check if folder exists
    if not os.path.isdir(folder_path):
        print(f"Error: Directory '{folder_path}' not found.")
        sys.exit(1)

    print(f"{'Filename':<30} | {'Dimensions':<15} | {'Aspect Ratio'}")
    print("-" * 65)

    # Added sorted() here to process the list of files alphabetically
    for filename in sorted(os.listdir(folder_path)):
        ext = os.path.splitext(filename)[1].lower()
        if ext in valid_exts:
            file_path = os.path.join(folder_path, filename)
            try:
                with Image.open(file_path) as img:
                    width, height = img.size
                    aspect_ratio = width / height
                    print(f"{filename:<30} | {width}x{height:<9} | {aspect_ratio:.4f}")
            except Exception as e:
                print(f"{filename:<30} | Error reading file")

if __name__ == "__main__":
    # Uses the current directory if no folder path is provided
    target_folder = sys.argv[1] if len(sys.argv) > 1 else "."
    get_aspect_ratios(target_folder)