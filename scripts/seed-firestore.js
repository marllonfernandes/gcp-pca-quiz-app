/**
 * Script de Migração / Seed para Cloud Firestore Native
 * Popula a base de questões e exames no banco: certificacao
 */

const fs = require('fs');
const path = require('path');
const { Firestore } = require('@google-cloud/firestore');

const FIRESTORE_DATABASE_ID = process.env.FIRESTORE_DATABASE_ID || 'certificacao';
const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT || process.env.GCP_PROJECT;

if (!PROJECT_ID) {
  console.warn('⚠️  Aviso: GOOGLE_CLOUD_PROJECT não definido. Usando credenciais padrão do ambiente gcloud.');
}

console.log('================================================================');
console.log('🌱 GCP PCA Quiz App - Migração de Questões para Cloud Firestore');
console.log(`☁️  Projeto GCP    : ${PROJECT_ID}`);
console.log(`🗄️  Banco Firestore: ${FIRESTORE_DATABASE_ID}`);
console.log('================================================================\n');

// 1. Carrega os dados originais do arquivo JSON seguro
const jsonPath = path.join(__dirname, '..', 'data', 'quiz_data.json');

if (!fs.existsSync(jsonPath)) {
  console.error(`❌ Arquivo não encontrado: ${jsonPath}`);
  process.exit(1);
}

console.log('📖 Lendo e processando dados de quiz_data.json...');
let quizData = null;
try {
  const fileContent = fs.readFileSync(jsonPath, 'utf8');
  quizData = JSON.parse(fileContent);
} catch (err) {
  console.error('❌ Falha ao analisar quiz_data.json:', err.message);
  process.exit(1);
}

if (!quizData || !quizData.quizzes) {
  console.error('❌ Estrutura inválida em quiz_data.json.');
  process.exit(1);
}

console.log(`✅ Dados carregados com sucesso:`);
console.log(`   - Título do Exame: ${quizData.examTitle}`);
console.log(`   - Total de Simulados: ${quizData.quizzes.length}`);
console.log(`   - Total de Questões: ${quizData.totalQuestions}`);
console.log(`   - Total de Seções: ${Object.keys(quizData.sections || {}).length}\n`);

// 2. Inicializa o cliente Firestore
const firestore = new Firestore({
  projectId: PROJECT_ID,
  databaseId: FIRESTORE_DATABASE_ID
});

async function runSeed() {
  try {
    // 3. Salva Metadados Gerais do Exame na coleção 'config_exame' -> doc 'pca_info'
    console.log('📤 [1/8] Gravando metadados do exame em "config_exame/pca_info"...');
    
    // Gera sumário dos quizzes (sem carregar todas as 420 questões no documento de config)
    const quizzesSummary = quizData.quizzes.map(q => ({
      id: q.id,
      title: q.title,
      description: q.description,
      questionCount: q.questionCount || (q.questions ? q.questions.length : 60),
      sourceFile: q.sourceFile || '',
      sectionDistribution: q.sectionDistribution || {}
    }));

    const examConfigDoc = {
      examTitle: quizData.examTitle,
      version: quizData.version || '1.0',
      totalQuizzes: quizData.totalQuizzes || quizzesSummary.length,
      totalQuestions: quizData.totalQuestions || 420,
      sections: quizData.sections,
      quizzesSummary: quizzesSummary,
      migratedAt: Firestore.FieldValue.serverTimestamp(),
      updatedAt: new Date().toISOString()
    };

    await firestore.collection('config_exame').doc('pca_info').set(examConfigDoc, { merge: true });
    console.log('   ✅ Metadados gerais salvos com sucesso.');

    // 4. Salva cada um dos 7 Simulados na coleção 'simulados_catalogo'
    console.log('\n📤 Gravando os 7 Simulados na coleção "simulados_catalogo"...');

    for (let i = 0; i < quizData.quizzes.length; i++) {
      const quiz = quizData.quizzes[i];
      const docId = `quiz_${quiz.id}`;
      console.log(`   ⏳ [${i + 2}/8] Salvando "${docId}" (${quiz.questions.length} questões)...`);

      // Calcula sectionDistribution caso não exista
      const sectionDist = quiz.sectionDistribution || {};
      if (Object.keys(sectionDist).length === 0 && quiz.questions) {
        quiz.questions.forEach(q => {
          const secId = (q.section && q.section.id) ? String(q.section.id) : '1';
          sectionDist[secId] = (sectionDist[secId] || 0) + 1;
        });
      }

      const quizPayload = {
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        sourceFile: quiz.sourceFile || '',
        questionCount: quiz.questions ? quiz.questions.length : 60,
        sectionDistribution: sectionDist,
        questions: quiz.questions,
        migratedAt: Firestore.FieldValue.serverTimestamp(),
        updatedAt: new Date().toISOString()
      };

      await firestore.collection('simulados_catalogo').doc(docId).set(quizPayload);
      console.log(`   ✅ "${docId}" salvo com sucesso!`);
    }

    console.log('\n================================================================');
    console.log('🎉 MIGRAÇÃO CONCLUÍDA COM SUCESSO NO FIRESTORE!');
    console.log(`   - Coleção "config_exame": 1 documento (pca_info)`);
    console.log(`   - Coleção "simulados_catalogo": 7 documentos com 420 questões.`);
    console.log('================================================================\n');

  } catch (error) {
    console.error('\n❌ Erro durante a migração para o Firestore:', error);
    process.exit(1);
  }
}

runSeed();
