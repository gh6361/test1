import re
import os


def fix_yaml_formatting(file_path):
    if not os.path.exists(file_path):
        print(f"Error: Could not find {file_path}")
        return

    with open(file_path, "r", encoding="utf-8") as file:
        lines = file.readlines()

    new_lines = []
    in_images_block = False
    first_attr = False

    for line in lines:
        line = line.rstrip("\n\r")

        # 1. Strip out JS-style inline comments
        line = re.sub(r"//.*", "", line).rstrip()

        # 2. Fix backticks to single quotes
        line = re.sub(r"`([^`]+)`", r"'\1'", line)

        # 3. Remove the first full stop for image sources (changes '../' to './')
        line = re.sub(r"(['\"])\.\./", r"\1./", line)

        # 4. Detect the start of the images array (with or without the bracket)
        if re.match(r"^\s*images:\s*\[?", line):
            in_images_block = True
            line = re.sub(r"\[\s*$", "", line)
            new_lines.append(line + "\n")
            continue

        if in_images_block:
            # Exit the block if we hit the end of the frontmatter or a new root key
            if (
                re.match(r"^---", line)
                or (
                    re.match(r"^[a-zA-Z0-9_]+:(?!.*:)", line)
                    and not line.strip().startswith("http")
                )
            ):
                in_images_block = False

            else:
                # Skip standalone opening braces '{'
                if re.match(r"^\s*\{\s*$", line):
                    first_attr = True
                    continue

                # Skip standalone closing braces '},' or '}'
                if re.match(r"^\s*\},?\s*$", line):
                    continue

                # Detect the end of the array ']'
                if re.match(r"^\s*\]\s*$", line):
                    in_images_block = False
                    continue

                # Remove trailing commas
                line = re.sub(r",\s*$", "", line)

                # If the line is already a valid YAML list item
                # (e.g., "- src:"), ignore it
                if re.match(r"^\s*-\s+[a-zA-Z0-9_]+:", line):
                    first_attr = False

                # Properly indent the properties to form a valid YAML list
                elif (
                    first_attr
                    and re.match(r"^\s+[a-zA-Z0-9_]+:", line)
                ):
                    line = re.sub(
                        r"^\s+([a-zA-Z0-9_]+:)",
                        r"  - \1",
                        line,
                    )
                    first_attr = False

                elif re.match(r"^\s+[a-zA-Z0-9_]+:", line):
                    line = re.sub(
                        r"^\s+([a-zA-Z0-9_]+:)",
                        r"    \1",
                        line,
                    )

        # Append the line with the newline explicitly added back
        new_lines.append(line + "\n")

    # Re-join the parsed lines
    fixed_content = "".join(new_lines)

    with open(file_path, "w", encoding="utf-8") as file:
        file.write(fixed_content)

    print(f"Successfully formatted mixed JS/YAML data in: {file_path}")


# Target the exact file path from your error log
target_file = "/home/gleda/Projects/tests/test1/collections/pallas.md"

fix_yaml_formatting(target_file)