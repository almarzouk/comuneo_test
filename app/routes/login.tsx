// Login-Seite Komponente
// Behandelt Benutzeranmeldung mit E-Mail und Passwort
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { Form, Link, useActionData, useNavigation } from "react-router";
import { useState } from "react";
import { loginUser } from "~/services/auth/service.server";
import { validateLoginCredentials } from "~/services/auth/validation";

/**
 * Überprüft, ob Benutzer bereits angemeldet ist
 * Leitet authentifizierte Benutzer zu /todos weiter
 */
export async function loader({ request }: LoaderFunctionArgs) {
  return null;
}

/**
 * Verarbeitet Anmeldeversuch
 */
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  return loginUser({ email, password });
}

export default function Login() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});

  const isSubmitting = navigation.state === "submitting";

  // Client-side Validierung beim Submit
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const validation = validateLoginCredentials(email, password);
    if (!validation.valid) {
      e.preventDefault();
      setClientErrors(validation.fieldErrors || {});
    } else {
      setClientErrors({});
    }
  };

  // Server-side Fehler haben Priorität
  const fieldErrors = actionData?.fieldErrors || clientErrors;

  return (
    <div className="container">
      <h1>Anmelden</h1>

      {actionData?.error && (
        <div className="error" role="alert">
          {actionData.error}
        </div>
      )}

      <Form method="post" onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="email">E-Mail</label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="E-Mail"
            autoComplete="email"
            required
            aria-invalid={fieldErrors.email ? "true" : undefined}
            aria-describedby={fieldErrors.email ? "email-error" : undefined}
          />
          {fieldErrors.email && (
            <span className="field-error" id="email-error" role="alert">
              {fieldErrors.email}
            </span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="password">Passwort</label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="Passwort"
            autoComplete="current-password"
            required
            aria-invalid={fieldErrors.password ? "true" : undefined}
            aria-describedby={
              fieldErrors.password ? "password-error" : undefined
            }
          />
          {fieldErrors.password && (
            <span className="field-error" id="password-error" role="alert">
              {fieldErrors.password}
            </span>
          )}
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Wird angemeldet..." : "Anmelden"}
        </button>
      </Form>

      <div className="auth-links">
        <Link to="/signup">Noch kein Konto? Registrieren</Link>
      </div>
    </div>
  );
}
