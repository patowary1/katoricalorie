import os
import re

root_dir = r"C:\Users\USER\.gemini\antigravity\scratch\katoricalorie"

html_files = []
for root, dirs, files in os.walk(root_dir):
    if "node_modules" in root or ".git" in root or "scratch" in root or "backups" in root:
        continue
    for file in files:
        if file.endswith(".html"):
            html_files.append(os.path.join(root, file))

print(f"Found {len(html_files)} HTML files:")

cornerstone_matches = []
food_guides_matches = []

for filepath in html_files:
    rel_path = os.path.relpath(filepath, root_dir)
    with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()
        if "/cornerstone-articles" in content:
            cornerstone_matches.append(rel_path)
        if "/food-guides" in content:
            food_guides_matches.append(rel_path)

print("\nFiles containing '/cornerstone-articles':")
for p in cornerstone_matches:
    print(f"  {p}")

print("\nFiles containing '/food-guides':")
for p in food_guides_matches:
    print(f"  {p}")
