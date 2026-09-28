const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/quiz_data.json');
let data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Retain original translate mechanism
async function translateText(text) {
  if (!text || !text.trim()) return text;
  
  const codeBlocks = [];
  let textToTranslate = text.replace(/```([a-zA-Z]*)\n([\s\S]*?)```/g, (match) => {
    const idx = codeBlocks.length;
    codeBlocks.push(match);
    return `___CODE_BLOCK_${idx}___`;
  });

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=pt&dt=t&q=${encodeURIComponent(textToTranslate)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Translate fetch error');
    const json = await res.json();
    
    let translated = '';
    if (json && json[0]) {
      translated = json[0].map(item => item[0]).join('');
    } else {
      translated = text;
    }

    translated = translated.replace(/___(?:CODE_BLOCK|BLOCO_DE_CÓDIGO)_?(\d+)___/gi, (m, idx) => {
      return codeBlocks[Number(idx)] || m;
    });

    return translated;
  } catch (e) {
    console.error('Translation error:', e.message);
    return text;
  }
}

async function translateAll() {
  console.log(`Translating ${data.quizzes.length} quizzes...`);
  
  for (let i = 0; i < data.quizzes.length; i++) {
    const quiz = data.quizzes[i];
    console.log(`Processing Quiz ${quiz.id}: ${quiz.title}`);
    
    for (let j = 0; j < quiz.questions.length; j++) {
      const q = quiz.questions[j];
      
      if (!q._translations || !q._translations.pt) {
        process.stdout.write(`  Translating Q${j+1}... `);
        
        try {
          const [transQ, transExp] = await Promise.all([
            translateText(q.question),
            translateText(q.explanation)
          ]);
          
          const transOptions = {};
          const sortedLetters = Object.keys(q.options || {}).sort();
          
          const translatedOpts = [];
          for (let k = 0; k < sortedLetters.length; k++) {
             translatedOpts.push(await translateText(q.options[sortedLetters[k]]));
          }
          
          sortedLetters.forEach((letter, idx) => {
            transOptions[letter] = translatedOpts[idx];
          });
          
          q._translations = q._translations || {};
          q._translations.pt = {
            question: transQ,
            options: transOptions,
            explanation: transExp
          };
          
          console.log('Done.');
          
          // Save incrementally just in case
          if (j % 5 === 0) {
            fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
          }
          
          // Wait a bit to avoid rate limits
          await new Promise(r => setTimeout(r, 300));
        } catch (err) {
          console.error('Error translating question:', err);
        }
      }
    }
    
    // Save per quiz
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  }
  
  console.log('Translation complete!');
}

translateAll().catch(console.error);
