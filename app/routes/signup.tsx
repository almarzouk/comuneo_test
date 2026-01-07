// Signup-Seite Komponente
// Behandelt Benutzerregistrierung mit E-Mail, Passwort und Name
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { Form, Link, useActionData, useNavigation } from "react-router";
import { useState } from "react";
import {
  signupUser,
  checkIfAlreadyAuthenticated,
} from "~/services/auth/service.server";
import { validateSignupCredentials } from "~/services/auth/validation";

/**
 * Überprüft, ob Benutzer bereits angemeldet ist
 */
export async function loader({ request }: LoaderFunctionArgs) {
  return checkIfAlreadyAuthenticated(request);
}

/**
 * Verarbeitet Registrierungsversuch
 */
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  return signupUser({ email, password, name });
}

export default function Signup() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});

  const isSubmitting = navigation.state === "submitting";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;

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
      <h1>Registrieren</h1>

      {actionData?.error && (
        <div className="error" role="alert">
          {actionData.error}
        </div>
      )}

      <Form method="post" onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            name="name"
            placeholder="Ihr Name"
            autoComplete="name"
            required
            aria-invalid={fieldErrors.name ? "true" : undefined}
            aria-describedby={fieldErrors.name ? "name-error" : undefined}
          />
          {fieldErrors.name && (
            <span className="field-error" id="name-error" role="alert">
              {fieldErrors.name}
            </span>
          )}
        </div>

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
            autoComplete="new-password"
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
          <small className="help-text">
            Mindestens 8 Zeichen mit Groß- und Kleinbuchstaben und Zahlen
          </small>
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Wird registriert..." : "Registrieren"}
        </button>
      </Form>

      <div className="auth-links">
        <Link to="/login">Bereits ein Konto? Anmelden</Link>
      </div>

      <style>{`
        .help-text {
          display: block;
          margin-top: 0.25rem;
          color: #6b7280;
          font-size: 0.875rem;
        }
      `}</style>
    </div>
  );
}
