// Auth Service - Hauptauthentifizierungsdienst
// Nur serverseitig verwendbar
import { redirect } from "react-router";
import { Account, ID } from "node-appwrite";
import { createSessionClient } from "~/lib/appwrite.server";
import {
  validateLoginCredentials,
  validateSignupCredentials,
  type LoginCredentials,
  type SignupCredentials,
} from "./validation";
import {
  createAdminClient,
  createSessionCookie,
  handleAuthError,
} from "./helpers.server";

/**
 * Überprüft, ob ein Benutzer bereits authentifiziert ist
 *
 * Prüft die aktuelle Session und leitet authentifizierte
 * Benutzer zur Aufgabenseite weiter
 *
 * @param request - Die eingehende HTTP-Anfrage
 * @returns Redirect zu /todos oder null
 */
export async function checkIfAlreadyAuthenticated(request: Request) {
  try {
    await createSessionClient(request);
    return redirect("/todos");
  } catch (error) {
    return null;
  }
}

/**
 * Meldet einen Benutzer an
 *
 * Validiert die Anmeldedaten, erstellt eine Session und
 * setzt ein sicheres Cookie für die Authentifizierung
 *
 * @param credentials - E-Mail und Passwort des Benutzers
 * @returns Redirect zu /todos oder Fehlermeldung
 */
export async function loginUser(credentials: LoginCredentials) {
  const { email, password } = credentials;

  const validation = validateLoginCredentials(email, password);
  if (!validation.valid) {
    return { error: validation.error, fieldErrors: validation.fieldErrors };
  }

  try {
    const client = createAdminClient();
    const account = new Account(client);
    const session = await account.createEmailPasswordSession(email, password);
    const headers = createSessionCookie(session.userId);

    return redirect("/todos", { headers });
  } catch (error: any) {
    return { error: handleAuthError(error) };
  }
}

/**
 * Registriert einen neuen Benutzer
 *
 * Erstellt ein neues Benutzerkonto, meldet den Benutzer
 * automatisch an und leitet zur Aufgabenseite weiter
 *
 * @param credentials - E-Mail, Passwort und Name des neuen Benutzers
 * @returns Redirect zu /todos oder Fehlermeldung
 */
export async function signupUser(credentials: SignupCredentials) {
  const { email, password, name } = credentials;

  const validation = validateSignupCredentials(email, password, name);
  if (!validation.valid) {
    return { error: validation.error, fieldErrors: validation.fieldErrors };
  }

  try {
    const client = createAdminClient();
    const account = new Account(client);

    await account.create(ID.unique(), email, password, name);
    const session = await account.createEmailPasswordSession(email, password);
    const headers = createSessionCookie(session.userId);

    return redirect("/todos", { headers });
  } catch (error: any) {
    return { error: handleAuthError(error) };
  }
}

/**
 * Meldet den Benutzer ab
 *
 * Löscht das Session-Cookie und leitet zur Login-Seite weiter
 *
 * @returns Redirect zur Login-Seite mit gelöschtem Cookie
 */
export function logoutUser() {
  return redirect("/login", {
    headers: {
      "Set-Cookie": `a_session_${process.env.APPWRITE_PROJECT_ID}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`,
    },
  });
}
