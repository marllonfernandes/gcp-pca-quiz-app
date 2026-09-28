import re

with open('backend/server.js', 'r') as f:
    content = f.read()

validation_snippet = """
  const validExamIds = EXAMS_CATALOG.map(e => e.id);
  if (!validExamIds.includes(examId)) {
    return res.status(400).json({ success: false, message: 'Invalid examId' });
  }
"""

# Replace in POST /api/progress/:quizId, DELETE /api/progress/:quizId, GET /api/progress/:quizId
# We just look for the check "return res.status(400).json({ success: false, message: 'Invalid quizId' });\n  }" and append.
content = re.sub(
    r"(return res\.status\(400\)\.json\(\{ success: false, message: 'Invalid quizId' \}\);\n\s*\})",
    r"\1" + validation_snippet,
    content
)

with open('backend/server.js', 'w') as f:
    f.write(content)
