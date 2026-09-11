import os
import sys
from PIL import Image

def generate_js_data(target_dir):
    if not os.path.isdir(target_dir):
        print(f"Error: Directory '{target_dir}' not found.")
        sys.exit(1)

    if 'assets' in target_dir:
        js_base_path = "../assets" + target_dir.split('assets')[1].replace('\\', '/')
    else:
        js_base_path = target_dir

    thumb1280_dir = os.path.join(target_dir, "thumbnail1280")
    if not os.path.isdir(thumb1280_dir):
        print(f"Error: Cannot find '{thumb1280_dir}'. Make sure subfolders exist.")
        sys.exit(1)

    for filename in sorted(os.listdir(thumb1280_dir)):
        if not filename.lower().endswith(('.jpg', '.jpeg')):
            continue

        base_name = os.path.splitext(filename)[0]
        # FIX: Safely remove the prefix instead of splitting by hyphens
        file_id = base_name.replace("thumbnail1280-", "")

        file_path = os.path.join(thumb1280_dir, filename)
        try:
            with Image.open(file_path) as img:
                ratio = img.width / img.height
        except Exception:
            ratio = 1.5

        print("{")
        print(f"  src: `{js_base_path}/avif/avif-{file_id}.avif`,")
        print(f"  thumb400: '{js_base_path}/thumbnail400/thumbnail400-{file_id}.jpg',")
        print(f"  thumb800: '{js_base_path}/thumbnail800/thumbnail800-{file_id}.jpg',")
        print(f"  thumbSrc: '{js_base_path}/thumbnail1280/thumbnail1280-{file_id}.jpg',")
        print(f"  ratio: {round(ratio, 4)},") 
        print(f"  detailedDescription: \"\",")
        print("},")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 generate_js.py <path_to_folder>")
        sys.exit(1)
        
    generate_js_data(sys.argv[1])