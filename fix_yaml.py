import re
import os

def fix_yaml_formatting(file_path):
    if not os.path.exists(file_path):
        print(f"Error: Could not find {file_path}")
        return

    with open(file_path, 'r', encoding='utf-8') as file:
        lines = file.readlines()

    new_lines = []
    in_images_block = False
    first_attr = False

    for line in lines:
        # Strip the newline temporarily so the regex doesn't accidentally eat it
        line = line.rstrip('\n\r')
        
        # 1. Strip out JS-style inline comments
        line = re.sub(r'//.*', '', line).rstrip()
        
        # 2. Fix backticks to single quotes
        line = re.sub(r'`([^`]+)`', r"'\1'", line)
        
        # 3. Remove the first full stop for image sources (changes '../' to './')
        line = re.sub(r"(['\"])\.\./", r"\1./", line)
        
        # 3. Detect the start of the images array and remove the trailing bracket
        if re.match(r'^\s*images:\s*\[', line):
            in_images_block = True
            line = re.sub(r'\[\s*$', '', line)
            new_lines.append(line + '\n')
            continue

        if in_images_block:
            # Skip standalone opening braces '{'
            if re.match(r'^\s*\{\s*$', line):
                first_attr = True
                continue
            
            # Skip standalone closing braces '},' or '}'
            if re.match(r'^\s*\},?\s*$', line):
                continue
            
            # Detect the end of the array ']'
            if re.match(r'^\s*\]\s*$', line):
                in_images_block = False
                continue

            # Remove trailing commas
            line = re.sub(r',\s*$', '', line)

            # Properly indent the properties to form a valid YAML list
            if first_attr:
                line = re.sub(r'^\s+([a-zA-Z0-9_]+:)', r'  - \1', line)
                first_attr = False
            else:
                # Only apply indentation mapping to lines that start with a property key
                if re.match(r'^\s+[a-zA-Z0-9_]+:', line):
                    line = re.sub(r'^\s+([a-zA-Z0-9_]+:)', r'    \1', line)

        # Append the line with the newline explicitly added back
        new_lines.append(line + '\n')

    # Re-join the parsed lines
    fixed_content = "".join(new_lines)

    with open(file_path, 'w', encoding='utf-8') as file:
        file.write(fixed_content)

    print(f"Successfully converted JS-array syntax to standard YAML in: {file_path}")

# Target the exact file path from your error log
target_file = "/home/gleda/Projects/tests/test1/collections/pallas.md"

fix_yaml_formatting(target_file)