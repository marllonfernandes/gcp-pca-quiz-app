const TRANS_CACHE_KEY = 'gcp_pca_trans_cache';
let translationCache = {};
try {
  translationCache = JSON.parse(localStorage.getItem(TRANS_CACHE_KEY) || '{}');
} catch (e) {}

export async function translateToPortuguese(text) {
  if (!text || !text.trim()) return text;
  const cleanKey = text.trim();
  if (translationCache[cleanKey]) {
    return translationCache[cleanKey];
  }

  // Preserve code blocks with markers
  const codeBlocks = [];
  let textToTranslate = text.replace(/```([a-zA-Z]*)\n([\s\S]*?)```/g, (match) => {
    const idx = codeBlocks.length;
    codeBlocks.push(match);
    return `[[CODE_${idx}]]`;
  });

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=pt&dt=t&q=${encodeURIComponent(textToTranslate)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Translate fetch error');
    const data = await res.json();
    let translated = '';
    if (data && data[0]) {
      translated = data[0].map(item => item[0]).join('');
    } else {
      translated = text;
    }

    // Restore code blocks
    translated = translated.replace(/\[\[CODE_(\d+)\]\]/g, (m, idx) => {
      return codeBlocks[Number(idx)] || m;
    });

    translationCache[cleanKey] = translated;
    try {
      localStorage.setItem(TRANS_CACHE_KEY, JSON.stringify(translationCache));
    } catch (err) {}

    return translated;
  } catch (e) {
    // Return original English if network fails
    return text;
  }
}

export async function getQuestionTranslations(question) {
  if (!question) return null;
  if (question._translations && question._translations.pt) {
    return question._translations.pt;
  }

  const [transQ, transExp] = await Promise.all([
    translateToPortuguese(question.question),
    translateToPortuguese(question.explanation)
  ]);

  const transOptions = {};
  const sortedLetters = Object.keys(question.options || {}).sort();
  const translatedOpts = await Promise.all(
    sortedLetters.map(letter => translateToPortuguese(question.options[letter]))
  );
  sortedLetters.forEach((letter, i) => {
    transOptions[letter] = translatedOpts[i];
  });

  const ptData = {
    question: transQ,
    options: transOptions,
    explanation: transExp
  };

  question._translations = question._translations || {};
  question._translations.pt = ptData;
  return ptData;
}
