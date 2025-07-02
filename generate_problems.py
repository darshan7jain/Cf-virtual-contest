# This script fetches all problems from Codeforces API and organizes them by rating and tag.
# For each rating (800 to 3000, step 100), it creates a JSON file with tag-wise lists of problems (contestId, index).
# Place this script in the project root and run it to generate the data files in src/problemset/.

import requests
import json
import os

TAGS = [
    "2-sat", "binary search", "bitmasks", "brute force", "chinese remainder theorem", "combinatorics",
    "constructive algorithms", "data structures", "dfs and similar", "divide and conquer", "dsu",
    "expression parsing", "fft", "flows", "games", "geometry", "graph matchings", "graphs", "greedy",
    "hashing", "implementation", "interactive", "matrices", "math", "meet-in-the-middle", "number theory",
    "probabilities", "schedules", "shortest paths", "sortings", "special", "string suffix structures",
    "strings", "ternary search", "trees", "two pointers"
]

RATINGS = list(range(800, 3600, 100))
PROBLEMSET_DIR = os.path.join(os.path.dirname(__file__), 'src', 'problemset')

os.makedirs(PROBLEMSET_DIR, exist_ok=True)

print("Fetching problems from Codeforces API...")
resp = requests.get("https://codeforces.com/api/problemset.problems")
data = resp.json()
problems = data['result']['problems']

# Organize problems by rating and tag
db = {r: {tag: [] for tag in TAGS} for r in RATINGS}
for p in problems:
    rating = p.get('rating')
    if rating not in db:
        continue
    for tag in p.get('tags', []):
        if tag in TAGS:
            db[rating][tag].append({
                'contestId': p['contestId'],
                'index': p['index']
            })

# Write to files
for rating in RATINGS:
    out = {tag: db[rating][tag] for tag in TAGS}
    with open(os.path.join(PROBLEMSET_DIR, f"{rating}.json"), 'w', encoding='utf-8') as f:
        json.dump(out, f, indent=2)
print("Done! Problem files generated in src/problemset/")
