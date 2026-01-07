// Appwrite Session Management
// Session- und Authentifizierungsverwaltung serverseitig
import { Client, Account, Databases } from "node-appwrite";

/**
 * Session aus Cookies extrahieren
 *
 * @param request - HTTP request object
 * @returns Session secret oder null
 */
export function getSessionFromCookies(request: Request): string | null {
  const cookieHeader = request.headers.get("Cookie");

  if (!cookieHeader) {
    return null;
  }

  const cookies = cookieHeader.split(";").reduce(
    (acc, cookie) => {
      const [key, value] = cookie.trim().split("=");
      if (key && value) {
        acc[key] = value;
      }
      return acc;
    },
    {} as Record<string, string>
  );

  const sessionKey = Object.keys(cookies).find((key) =>
    key.startsWith("a_session_")
  );

  if (!sessionKey) {
    return null;
  }

  const sessionSecret = cookies[sessionKey];

  return sessionSecret || null;
}

/**
 * Appwrite Client mit Benutzer-Session erstellen
 *
 * @param request - HTTP request object
 * @returns Object mit client, account, databases, user
 * @throws Error wenn keine gültige Session vorhanden
 */
export async function createSessionClient(request: Request) {
  const sessionSecret = getSessionFromCookies(request);

  if (!sessionSecret) {
    throw new Error("No session found");
  }

  try {
    const client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT!)
      .setProject(process.env.APPWRITE_PROJECT_ID!)
      .setSession(sessionSecret);

    const account = new Account(client);
    const user = await account.get();

    return {
      client,
      account,
      databases: new Databases(client),
      user,
    };
  } catch (error: any) {
    throw new Error(`Invalid session: ${error.message || "Unknown error"}`);
  }
}

/**
 * Aktuellen Benutzer aus Session abrufen
 *
 * @param request - HTTP request object
 * @returns User object oder null wenn keine Session
 */
export async function getCurrentUser(request: Request) {
  try {
    const session = await createSessionClient(request);
    return session.user;
  } catch (error) {
    return null;
  }
}

/**
 * Überprüfen ob Benutzer eine gültige Session hat
 *
 * @param request - HTTP request object
 * @returns true wenn gültige Session vorhanden
 */
export async function hasValidSession(request: Request): Promise<boolean> {
  try {
    await createSessionClient(request);
    return true;
  } catch {
    return false;
  }
}
