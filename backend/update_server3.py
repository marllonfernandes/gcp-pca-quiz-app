import re

with open('backend/server.js', 'r') as f:
    content = f.read()

# Add require for validator
content = re.sub(
    r"(const \{ EXAMS_CATALOG \} = require\('\./config/exams'\);)",
    r"\1\nconst { sanitizeObjectKeys } = require('./utils/validator');",
    content
)

# Replace in POST /api/progress/:quizId
# `const { quizTitle, userAnswers, flaggedQuestions, revealedExplanations, currentQuestionIndex, timeElapsed, filteredWrongOnly } = req.body;`
# -> wrap userAnswers, flaggedQuestions, revealedExplanations with sanitizeObjectKeys
replace_destructuring = """  let { quizTitle, userAnswers, flaggedQuestions, revealedExplanations, currentQuestionIndex, timeElapsed, filteredWrongOnly } = req.body;
  userAnswers = sanitizeObjectKeys(userAnswers, 420);
  flaggedQuestions = sanitizeObjectKeys(flaggedQuestions, 420);
  revealedExplanations = sanitizeObjectKeys(revealedExplanations, 420);
"""
content = re.sub(
    r"const \{ quizTitle, userAnswers, flaggedQuestions, revealedExplanations, currentQuestionIndex, timeElapsed, filteredWrongOnly \} = req\.body;",
    replace_destructuring,
    content
)

# Replace in POST /api/results
# `breakdown: breakdown || {},`
# -> `breakdown: sanitizeObjectKeys(breakdown, 50),`
content = re.sub(
    r"breakdown: breakdown \|\| \{\},",
    r"breakdown: sanitizeObjectKeys(breakdown, 50),",
    content
)

with open('backend/server.js', 'w') as f:
    f.write(content)
