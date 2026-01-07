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
    const session = await createSessionClient(request);
    throw redirect("/todos");
  } catch (error) {
    if (error instanceof Response) {
      throw error;
    }
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

    if (!session.secret) {
      return {
        error:
          "Fehler beim Erstellen der Session. Bitte versuchen Sie es erneut.",
      };
    }

    const headers = createSessionCookie(session.secret);
    const cookieHeader = headers.get("Set-Cookie");

    throw redirect("/todos", {
      headers: {
        "Set-Cookie": cookieHeader || "",
      },
    });
  } catch (error: any) {
    if (error instanceof Response) {
      throw error;
    }
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

    const user = await account.create(ID.unique(), email, password, name);

    const session = await account.createEmailPasswordSession(email, password);

    if (!session.secret) {
      return {
        error:
          "Benutzer erstellt, aber Anmeldung fehlgeschlagen. Bitte melden Sie sich manuell an.",
      };
    }

    const headers = createSessionCookie(session.secret);
    const cookieHeader = headers.get("Set-Cookie");

    return new Response(null, {
      status: 302,
      headers: {
        Location: "/todos",
        "Set-Cookie": cookieHeader || "",
      },
    });
  } catch (error: any) {
    if (error instanceof Response) {
      throw error;
    }
    return { error: handleAuthError(error) };
  }
}

/**
 * Meldet den Benutzer ab
 *
 * Löscht die Session aus Appwrite und das Session-Cookie,
 * dann leitet zur Login-Seite weiter
 *
 * @param request - Die eingehende HTTP-Anfrage
 * @returns Redirect zur Login-Seite mit gelöschtem Cookie
 */
export async function logoutUser(request: Request) {
  const projectId = process.env.APPWRITE_PROJECT_ID!;
  const cookieName = `a_session_${projectId}`;

  try {
    const session = await createSessionClient(request);
    await session.account.deleteSession("current");
  } catch (error) {
    // Cookie trotzdem löschen, auch wenn Session-Löschung fehlschlägt
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: "/login",
      "Set-Cookie": `${cookieName}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`,
    },
  });
}

/**
 * Erfordert, dass der Benutzer authentifiziert ist
 *
 * Überprüft eine gültige Session und leitet zur
 * Login-Seite weiter, falls nicht authentifiziert
 *
 * @param request - Die eingehende HTTP-Anfrage
 * @returns User object wenn authentifiziert
 * @throws Redirect zu /login wenn nicht authentifiziert
 */
export async function requireAuth(request: Request) {
  try {
    const session = await createSessionClient(request);
    return session.user;
  } catch (error) {
    throw redirect("/login");
  }
}
