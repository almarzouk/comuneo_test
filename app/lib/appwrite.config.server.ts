// Appwrite Server Configuration
// Appwrite-Konfiguration serverseitig mit Admin-Rechten
import { Client } from "node-appwrite";

/**
 * Überprüfung der erforderlichen Umgebungsvariablen
 */
function validateEnv() {
  const required = {
    APPWRITE_ENDPOINT: process.env.APPWRITE_ENDPOINT,
    APPWRITE_PROJECT_ID: process.env.APPWRITE_PROJECT_ID,
    APPWRITE_API_KEY: process.env.APPWRITE_API_KEY,
  };

  const missing = Object.entries(required)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}\n` +
        `Please add them to your .env file.`
    );
  }
}

validateEnv();

/**
 * Admin Client - Für Admin-Operationen wie User-Erstellung
 *
 * ⚠️ WICHTIG: Nicht direkt für Operationen verwenden, die eine Session benötigen
 * Stattdessen createSessionClient() nutzen
 */
export const adminClient = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT!)
  .setProject(process.env.APPWRITE_PROJECT_ID!)
  .setKey(process.env.APPWRITE_API_KEY!);

/**
 * Projekt-Informationen für die Verwendung an anderen Stellen
 */
export const appwriteConfig = {
  endpoint: process.env.APPWRITE_ENDPOINT!,
  projectId: process.env.APPWRITE_PROJECT_ID!,
  databaseId: process.env.APPWRITE_DATABASE_ID || "default",
  todosCollectionId: process.env.APPWRITE_TODOS_COLLECTION_ID || "todos",
} as const;
