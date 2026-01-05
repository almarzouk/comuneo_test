// Registrierungs-Seite Komponente
// Behandelt Benutzererstellung und automatische Anmeldung
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { Form, Link, useActionData } from "react-router";
import { useState } from "react";
import {
  checkIfAlreadyAuthenticated,
  signupUser,
} from "~/services/auth/service.server";
import { validateSignupCredentials } from "~/services/auth/validation";

// Überprüft, ob Benutzer bereits angemeldet ist
export async function loader({ request }: LoaderFunctionArgs) {
  return checkIfAlreadyAuthenticated(request);
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  return signupUser({ email, password, name });
}

export default function Signup() {
  const actionData = useActionData<typeof action>();
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});

  // Client-side Validierung beim Submit
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const validation = validateSignupCredentials(email, password, name);
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
      <h1>Neues Konto erstellen</h1>
      {actionData?.error && <div className="error">{actionData.error}</div>}

      <Form method="post" onSubmit={handleSubmit}>
        <div className="form-field">
          <input
            type="text"
            name="name"
            placeholder="Name"
            autoComplete="name"
            required
            minLength={2}
            maxLength={128}
            aria-invalid={fieldErrors.name ? "true" : undefined}
            aria-describedby={fieldErrors.name ? "name-error" : undefined}
          />
          {fieldErrors.name && (
            <span className="field-error" id="name-error">
              {fieldErrors.name}
            </span>
          )}
        </div>

        <div className="form-field">
          <input
            type="email"
            name="email"
            placeholder="E-Mail"
            autoComplete="email"
            required
            maxLength={320}
            aria-invalid={fieldErrors.email ? "true" : undefined}
            aria-describedby={fieldErrors.email ? "email-error" : undefined}
          />
          {fieldErrors.email && (
            <span className="field-error" id="email-error">
              {fieldErrors.email}
            </span>
          )}
        </div>

        <div className="form-field">
          <input
            type="password"
            name="password"
            placeholder="Passwort (min. 8 Zeichen, Groß-/Kleinbuchstaben, Ziffer)"
            autoComplete="new-password"
            required
            minLength={8}
            maxLength={256}
            aria-invalid={fieldErrors.password ? "true" : undefined}
            aria-describedby={
              fieldErrors.password ? "password-error" : undefined
            }
          />
          {fieldErrors.password && (
            <span className="field-error" id="password-error">
              {fieldErrors.password}
            </span>
          )}
        </div>

        <button type="submit">Konto erstellen</button>
      </Form>

      <br />
      <Link to="/login">Bereits ein Konto? Anmelden</Link>
    </div>
  );
}
