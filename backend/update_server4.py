import re

with open('backend/server.js', 'r') as f:
    content = f.read()

# Swap CACHE_TTL_MS and cachedQuizzes
content = re.sub(
    r"(const cachedQuizzes = new LRUCache\(\{\n\s*max: 100, // max 100 quizzes in memory\n\s*ttl: CACHE_TTL_MS\n\}\);\nconst CACHE_TTL_MS = 15 \* 60 \* 1000; // 15 minutes TTL)",
    r"const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes TTL\nconst cachedQuizzes = new LRUCache({\n  max: 100, // max 100 quizzes in memory\n  ttl: CACHE_TTL_MS\n});",
    content
)

with open('backend/server.js', 'w') as f:
    f.write(content)
