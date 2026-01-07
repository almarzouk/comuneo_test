// Auth Helper Functions - Hilfsfunktionen für Authentifizierung
// Nur serverseitig verwendbar
import { Client } from "node-appwrite";
import { AppwriteException } from "node-appwrite";

/**
 * Erstellt einen Admin-Client für Appwrite
 * Verwendet den API-Schlüssel für Admin-Operationen
 *
 * @returns Appwrite Client mit Admin-Rechten
 */
export function createAdminClient(): Client {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT!)
    .setProject(process.env.APPWRITE_PROJECT_ID!)
    .setKey(process.env.APPWRITE_API_KEY!);

  return client;
}

/**
 * Erstellt ein sicheres Session-Cookie
 *
 * @param secret - Das Session-Secret von Appwrite
 * @returns Headers object mit Set-Cookie header
 */
export function createSessionCookie(secret: string): Headers {
  const projectId = process.env.APPWRITE_PROJECT_ID!;
  const cookieName = `a_session_${projectId}`;
  const isProduction = process.env.NODE_ENV === "production";

  // إعدادات الـ cookie الآمنة
  const cookieParts = [
    `${cookieName}=${secret}`,
    "Path=/",
    "HttpOnly", // لا يمكن الوصول إليه من JavaScript
    "SameSite=Strict", // حماية من CSRF
    "Max-Age=31536000", // سنة واحدة (يمكن تعديلها)
  ];

  // إضافة Secure flag في الإنتاج فقط
  if (isProduction) {
    cookieParts.push("Secure");
  }

  const cookieValue = cookieParts.join("; ");

  console.log("🍪 Creating session cookie:", {
    name: cookieName,
    hasSecret: !!secret,
    secretLength: secret.length,
    isProduction,
    cookiePreview: cookieValue.substring(0, 100) + "...",
  });

  const headers = new Headers();
  headers.set("Set-Cookie", cookieValue);

  return headers;
}

/**
 * معالجة أخطاء Appwrite وإرجاع رسائل مفهومة للمستخدم
 *
 * @param error - خطأ من Appwrite
 * @returns رسالة خطأ مفهومة بالألمانية
 */
export function handleAuthError(error: any): string {
  console.error("🔴 Auth error:", {
    type: error.type,
    code: error.code,
    message: error.message,
  });

  // إذا كان الخطأ من Appwrite
  if (error instanceof AppwriteException || error.type) {
    switch (error.type || error.code) {
      case "user_invalid_credentials":
      case 401:
        return "E-Mail oder Passwort ist falsch.";

      case "user_already_exists":
      case 409:
        return "Ein Benutzer mit dieser E-Mail existiert bereits.";

      case "user_unauthorized":
        return "Sie sind nicht berechtigt, diese Aktion durchzuführen.";

      case "user_blocked":
        return "Ihr Konto wurde gesperrt. Bitte kontaktieren Sie den Support.";

      case "password_mismatch":
        return "Das Passwort entspricht nicht den Anforderungen.";

      case "user_email_not_verified":
        return "Bitte bestätigen Sie Ihre E-Mail-Adresse.";

      case "rate_limit_exceeded":
      case 429:
        return "Zu viele Anfragen. Bitte warten Sie einen Moment und versuchen Sie es erneut.";

      case "general_argument_invalid":
        return "Ungültige Eingabe. Bitte überprüfen Sie Ihre Daten.";

      case "general_server_error":
      case 500:
        return "Ein Serverfehler ist aufgetreten. Bitte versuchen Sie es später erneut.";

      default:
        return error.message || "Ein unerwarteter Fehler ist aufgetreten.";
    }
  }

  // أخطاء عامة
  if (error.message) {
    return error.message;
  }

  return "Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.";
}

/**
 * التحقق من صحة بيانات البيئة المطلوبة
 * يجب استدعاء هذه الدالة عند بدء التطبيق
 */
export function validateEnvironmentVariables(): void {
  const required = [
    "APPWRITE_ENDPOINT",
    "APPWRITE_PROJECT_ID",
    "APPWRITE_API_KEY",
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }

  console.log("✅ Environment variables validated");
}
