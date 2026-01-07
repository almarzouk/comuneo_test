// Logout Route
// Behandelt Benutzer-Abmeldung
import type { ActionFunctionArgs } from "react-router";
import { logoutUser } from "~/services/auth/service.server";

/**
 * Action-Funktion für Logout
 * Wird bei POST request ausgeführt (Form submission)
 */
export async function action({ request }: ActionFunctionArgs) {
  return logoutUser(request);
}

// Diese Route braucht keine UI-Komponente
// da sie direkt zum Login weiterleitet
export default function Logout() {
  return null;
}
