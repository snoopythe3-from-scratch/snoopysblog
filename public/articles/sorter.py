import os
import json
from datetime import datetime
import re

def extract_date_from_md(file_path):
    """Extract the date from a markdown file's header table"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Use regex to find the table row with data
    match = re.search(r'\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(\d{2}/\d{2}/\d{2})\s*\|', content)
    if match:
        return match.group(3)  # Return the date string
    return None

def main():
    # Get script directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Get all markdown files in script directory
    md_files = [f for f in os.listdir(script_dir) if f.endswith('.md')]
    
    # Extract files with their dates
    files_with_dates = []
    for file in md_files:
        file_path = os.path.join(script_dir, file)
        date_str = extract_date_from_md(file_path)
        if date_str:
            try:
                date_obj = datetime.strptime(date_str, '%d/%m/%y')
                files_with_dates.append((file, date_obj, file_path))
            except ValueError:
                print(f"Skipping {file}: Invalid date format")

    # Sort files by date (oldest first)
    files_with_dates.sort(key=lambda x: x[1])
    
    # Create numbered files (oldest = 1.md, next = 2.md, etc.)
    new_filenames = []
    temp_rename_map = []
    
    # First pass: Rename to temporary names to avoid conflicts
    for idx, (file, _, file_path) in enumerate(files_with_dates, 1):
        temp_name = f"temp_{idx}.md"
        temp_path = os.path.join(script_dir, temp_name)
        os.rename(file_path, temp_path)
        temp_rename_map.append((temp_path, os.path.join(script_dir, f"{idx}.md")))
    
    # Second pass: Rename to final numbered names
    for temp_path, new_path in temp_rename_map:
        os.rename(temp_path, new_path)
        new_filenames.append(os.path.basename(new_path))
    
    # Create index.json content (newest first)
    index_content = [f for f in reversed(new_filenames)]
    
    # Write to index.json in script directory
    index_path = os.path.join(script_dir, 'index.json')
    with open(index_path, 'w') as f:
        json.dump(index_content, f, indent=4)
    
    print("Successfully processed files:")
    for new_name in index_content:
        print(f"- {new_name}")

if __name__ == "__main__":
    main()