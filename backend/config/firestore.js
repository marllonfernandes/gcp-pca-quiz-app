const { Firestore } = require('@google-cloud/firestore');

const FIRESTORE_DATABASE_ID = process.env.FIRESTORE_DATABASE_ID || 'certificacao';
const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT || process.env.GCP_PROJECT;
const GCP_REGION = process.env.GCP_REGION || 'southamerica-east1';

let firestore = null;
let firestoreConnected = false;

try {
  const firestoreConfig = {
    databaseId: FIRESTORE_DATABASE_ID
  };
  if (PROJECT_ID) {
    firestoreConfig.projectId = PROJECT_ID;
  }
  firestore = new Firestore(firestoreConfig);
  console.log(`[Firestore] Client initialized for database: "${FIRESTORE_DATABASE_ID}"`);
} catch (error) {
  console.warn(`[Firestore] Warning initializing client: ${error.message}`);
}

module.exports = {
  firestore,
  firestoreConnected,
  FIRESTORE_DATABASE_ID,
  GCP_REGION
};
