import re

with open('backend/server.js', 'r') as f:
    content = f.read()

# 1. Add requires for lru-cache and config
requires_addition = """const { LRUCache } = require('lru-cache');
const { EXAMS_CATALOG } = require('./config/exams');
"""
content = re.sub(r"(const \{ OAuth2Client \} = require\('google-auth-library'\);)", r"\1\n" + requires_addition, content)

# 2. Replace cache Map with LRUCache
cache_replacement = """const cachedQuizzes = new LRUCache({
  max: 100, // max 100 quizzes in memory
  ttl: CACHE_TTL_MS
});"""
content = re.sub(r"const cachedQuizzes = new Map\(\);", cache_replacement, content)

# 3. Remove hardcoded EXAMS_CATALOG (lines 336-462)
# We can find it by finding "// ============================================================================" and removing down to "];"
content = re.sub(r"// ===+.*?Multi-Exam Google Cloud Catalog.*?\n// ===+.*?\nconst EXAMS_CATALOG = \[\s*\{.*?\];\n", "", content, flags=re.DOTALL)

# 4. Update the logic for cache get/set since LRUCache uses get/set but doesn't need manual TTL check if TTL is built-in
# Update `cacheKey` reading
content = re.sub(r"const cached = cachedQuizzes\.get\(cacheKey\) \|\| cachedQuizzes\.get\(quizId\);\n\s*const now = Date\.now\(\);\n\n\s*// Return from in-memory cache if fresh\n\s*if \(\!forceRefresh && cached && \(now - cached\.time < CACHE_TTL_MS\)\) \{\n\s*return res\.json\(\{ success: true, source: 'firestore-cache', examId, quiz: cached\.data \}\);\n\s*\}",
"""const cached = cachedQuizzes.get(cacheKey) || cachedQuizzes.get(quizId);
  const now = Date.now();

  // Return from in-memory cache if fresh
  if (!forceRefresh && cached) {
    return res.json({ success: true, source: 'firestore-cache', examId, quiz: cached.data });
  }""", content)

# Update cacheKey writing
content = re.sub(r"cachedQuizzes\.set\(cacheKey, \{ data, time: now \}\);", "cachedQuizzes.set(cacheKey, { data, time: now });", content)

# 5. Fix security: Validate examId in routes
validation_snippet = """  const validExamIds = EXAMS_CATALOG.map(e => e.id);
  if (!validExamIds.includes(examId)) {
    return res.status(400).json({ success: false, message: 'Invalid examId' });
  }"""

# For POST /api/progress/:quizId
post_progress = r"(const examId = String\(req\.body\.examId \|\| req\.query\.examId \|\| 'gcp-pca'\)\.toLowerCase\(\);\n\n\s*if \(isNaN\(quizId\).*?\{\n.*?\}\n)"
content = re.sub(post_progress, r"\1\n" + validation_snippet + "\n", content)

# For DELETE /api/progress/:quizId
delete_progress = r"(const examId = String\(req\.body\.examId \|\| req\.query\.examId \|\| 'gcp-pca'\)\.toLowerCase\(\);\n\n\s*if \(isNaN\(quizId\).*?\{\n.*?\}\n)"
content = re.sub(delete_progress, r"\1\n" + validation_snippet + "\n", content)

# For GET /api/progress/:quizId
get_progress_quiz = r"(const examId = String\(req\.query\.examId \|\| 'gcp-pca'\)\.toLowerCase\(\);\n\n\s*if \(isNaN\(quizId\).*?\{\n.*?\}\n)"
content = re.sub(get_progress_quiz, r"\1\n" + validation_snippet + "\n", content)

# For POST /api/results
post_results = r"(const selectedExamId = String\(examId \|\| 'gcp-pca'\)\.toLowerCase\(\);\n)"
validation_results_snippet = """    if (!EXAMS_CATALOG.find(e => e.id === selectedExamId)) {
      return res.status(400).json({ success: false, message: 'Invalid examId' });
    }
"""
content = re.sub(post_results, r"\1" + validation_results_snippet, content)

with open('backend/server.js', 'w') as f:
    f.write(content)
