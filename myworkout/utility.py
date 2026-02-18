import json

# Read UTF-16, write UTF-8
with open('data.json', 'r', encoding='utf-16') as f:
    data = json.load(f)

with open('data_utf8.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
