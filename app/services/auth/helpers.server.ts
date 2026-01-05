// Auth Helpers - Authentifizierungs-Hilfsfunktionen
// Nur serverseitig verwendbar
import { Client } from "node-appwrite";

/**
 * Erstellt einen Appwrite Admin Client
 *
 * Dieser Client hat volle Administratorrechte und wird für
 * serverseitige Operationen wie Benutzerverwaltung verwendet
 *
 * @returns Konfigurierter Appwrite Client mit API-Schlüssel
 */
export function createAdminClient() {
  return new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT!)
    .setProject(process.env.APPWRITE_PROJECT_ID!)
    .setKey(process.env.APPWRITE_API_KEY!);
}

/**
 * Erstellt einen Session-Cookie-Header
 *
 * Generiert einen sicheren HTTP-Cookie für die Benutzersitzung
 * mit HttpOnly und SameSite-Attributen für erhöhte Sicherheit
 *
 * @param userId - Die Benutzer-ID für die Session
 * @returns Headers-Objekt mit Set-Cookie-Header
 */
export function createSessionCookie(userId: string): Headers {
  const headers = new Headers();
  const cookieName = `a_session_${process.env.APPWRITE_PROJECT_ID}`;
  const cookieValue = `${cookieName}=${userId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=31536000`;
  headers.append("Set-Cookie", cookieValue);
  return headers;
}

/**
 * Behandelt Authentifizierungsfehler
 *
 * Wandelt technische Fehlermeldungen in benutzerfreundliche
 * deutschsprachige Nachrichten um
 *
 * @param error - Das aufgetretene Error-Objekt
 * @returns Benutzerfreundliche Fehlermeldung auf Deutsch
 */
export function handleAuthError(error: any): string {
  if (error.message?.includes("timeout")) {
    return "Zeitüberschreitung. Bitte versuchen Sie es erneut.";
  }
  if (error.message?.includes("Rate limit")) {
    return "Zu viele Versuche. Bitte warten Sie eine Minute und versuchen Sie es erneut.";
  }
  if (error.message?.includes("Invalid credentials") || error.code === 401) {
    return "E-Mail oder Passwort ist falsch";
  }
  if (
    error.message?.includes("user with the same email already exists") ||
    error.code === 409
  ) {
    return "E-Mail-Adresse ist bereits registriert";
  }
  return error.message || "Ein Fehler ist aufgetreten";
}
