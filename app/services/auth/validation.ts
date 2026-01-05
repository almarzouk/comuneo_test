// Auth Validation - Authentifizierungs-Validierung
// Kann sowohl auf dem Client als auch auf dem Server verwendet werden

/**
 * Typ für Login-Anmeldedaten
 * Definiert die erforderlichen Felder für die Benutzeranmeldung
 */
export type LoginCredentials = {
  email: string;
  password: string;
};

/**
 * Typ für Registrierungs-Anmeldedaten
 * Definiert die erforderlichen Felder für die Benutzererstellung
 */
export type SignupCredentials = {
  email: string;
  password: string;
  name: string;
};

/**
 * Validiert Login-Anmeldedaten
 *
 * Überprüft E-Mail-Format und Passwortlänge
 *
 * @param email - E-Mail-Adresse des Benutzers
 * @param password - Passwort des Benutzers
 * @returns Validierungsergebnis mit Fehlermeldungen
 */
export function validateLoginCredentials(
  email: string | null,
  password: string | null
): { valid: boolean; error?: string; fieldErrors?: Record<string, string> } {
  const fieldErrors: Record<string, string> = {};

  // E-Mail-Validierung
  if (!email || email.trim().length === 0) {
    fieldErrors.email = "E-Mail ist erforderlich";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fieldErrors.email = "Ungültige E-Mail-Adresse";
  }

  // Passwort-Validierung
  if (!password || password.length === 0) {
    fieldErrors.password = "Passwort ist erforderlich";
  } else if (password.length < 8) {
    fieldErrors.password = "Passwort muss mindestens 8 Zeichen lang sein";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      valid: false,
      fieldErrors,
      error: "Bitte korrigieren Sie die Fehler",
    };
  }

  return { valid: true };
}

/**
 * Validiert Registrierungs-Anmeldedaten
 *
 * Überprüft Name, E-Mail-Format, Passwortlänge und Passwortkomplexität
 *
 * @param email - E-Mail-Adresse des neuen Benutzers
 * @param password - Passwort des neuen Benutzers
 * @param name - Name des neuen Benutzers
 * @returns Validierungsergebnis mit Fehlermeldungen
 */
export function validateSignupCredentials(
  email: string | null,
  password: string | null,
  name: string | null
): { valid: boolean; error?: string; fieldErrors?: Record<string, string> } {
  const fieldErrors: Record<string, string> = {};

  // Name-Validierung
  if (!name || name.trim().length === 0) {
    fieldErrors.name = "Name ist erforderlich";
  } else if (name.length < 2) {
    fieldErrors.name = "Name muss mindestens 2 Zeichen lang sein";
  } else if (name.length > 128) {
    fieldErrors.name = "Name ist zu lang";
  }

  // E-Mail-Validierung
  if (!email || email.trim().length === 0) {
    fieldErrors.email = "E-Mail ist erforderlich";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fieldErrors.email = "Ungültige E-Mail-Adresse";
  } else if (email.length > 320) {
    fieldErrors.email = "E-Mail ist zu lang";
  }

  // Passwort-Validierung
  if (!password || password.length === 0) {
    fieldErrors.password = "Passwort ist erforderlich";
  } else if (password.length < 8) {
    fieldErrors.password = "Passwort muss mindestens 8 Zeichen lang sein";
  } else if (password.length > 256) {
    fieldErrors.password = "Passwort ist zu lang";
  } else if (!/[A-Z]/.test(password)) {
    fieldErrors.password =
      "Passwort muss mindestens einen Großbuchstaben enthalten";
  } else if (!/[a-z]/.test(password)) {
    fieldErrors.password =
      "Passwort muss mindestens einen Kleinbuchstaben enthalten";
  } else if (!/[0-9]/.test(password)) {
    fieldErrors.password = "Passwort muss mindestens eine Ziffer enthalten";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      valid: false,
      fieldErrors,
      error: "Bitte korrigieren Sie die Fehler",
    };
  }

  return { valid: true };
}
