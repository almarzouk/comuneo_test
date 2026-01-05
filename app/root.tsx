// Haupt-Layout-Komponente der Anwendung
// Definiert die HTML-Struktur und Fehlerbehandlung
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";

import type { Route } from "./+types/root";
import { ErrorPage } from "./components/ErrorPage";
import "./app.css";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Aufgaben-App</title>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

// Fehlergrenze für die gesamte Anwendung
export function ErrorBoundary() {
  return <ErrorPage />;
}
