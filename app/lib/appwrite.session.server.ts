// Appwrite Session Management - إدارة جلسات المستخدمين
import { Account, Databases, Users } from "node-appwrite";
import { adminClient } from "./appwrite.config.server";

/**
 * erhalten der Sitzung aus Cookies
 */
export function getSessionFromCookies(request: Request): string | null {
  const cookieHeader = request.headers.get("Cookie");
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(";").reduce(
    (acc, cookie) => {
      const [key, value] = cookie.trim().split("=");
      if (key && value) acc[key] = value;
      return acc;
    },
    {} as Record<string, string>
  );

  const sessionKey = Object.keys(cookies).find((key) =>
    key.startsWith("a_session_")
  );

  return sessionKey && cookies[sessionKey] ? cookies[sessionKey] : null;
}

/**
 * Erstellen eines Appwrite-Clients mit Benutzersitzung
 */
export async function createSessionClient(request: Request) {
  const userId = getSessionFromCookies(request);

  if (!userId) {
    throw new Error("No session found");
  }

  try {
    const usersApi = new Users(adminClient);
    const user = await usersApi.get(userId);

    return {
      client: adminClient,
      account: new Account(adminClient),
      databases: new Databases(adminClient),
      user,
    };
  } catch (error: any) {
    throw new Error("Invalid session");
  }
}

/**
 * Holen Sie den aktuellen Benutzer basierend auf der Anforderung
 */
export async function getCurrentUser(request: Request) {
  try {
    const session = await createSessionClient(request);
    return session.user;
  } catch {
    return null;
  }
}
