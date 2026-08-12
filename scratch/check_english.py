import re
from bs4 import BeautifulSoup

with open('hi/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

soup = BeautifulSoup(html, 'html.parser')

# Remove script, style, meta, link, json-ld tags
for tag in soup(['script', 'style', 'meta', 'link']):
    tag.decompose()

# Find all text nodes
text_nodes = soup.find_all(text=True)

print("--- User Facing English Words Found ---")
english_word_re = re.compile(r'\b[A-Za-z]{2,}\b')

for node in text_nodes:
    text = node.strip()
    if not text:
        continue
    # Find any english words (excluding code symbols, standard metrics like kcal, kg, cm)
    matches = english_word_re.findall(text)
    # Filter out acceptable abbreviations
    filtered_matches = [m for m in matches if m.lower() not in ['kcal', 'kg', 'cm', 's', 'm', 'l', 'fb', 'ig', 'yt', 'katoricalorie', 'website', 'webwebsite']]
    if filtered_matches:
        print(f"Line {node.sourceline or '?'}: {text} -> Matches: {filtered_matches}")
