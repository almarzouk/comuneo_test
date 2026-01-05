// Error Page Component - مكون صفحة الخطأ
import { Link, isRouteErrorResponse, useRouteError } from "react-router";

export function ErrorPage() {
  const error = useRouteError();

  // التعامل مع أخطاء Route المختلفة
  if (isRouteErrorResponse(error)) {
    return (
      <div className="error-page">
        <div className="error-container">
          <h1 className="error-code">{error.status}</h1>
          <h2 className="error-title">{getErrorTitle(error.status)}</h2>
          <p className="error-message">{getErrorMessage(error.status)}</p>
          <div className="error-actions">
            <Link to="/" className="btn-primary">
              🏠 Zur Startseite
            </Link>
            <button
              onClick={() => window.history.back()}
              className="btn-secondary"
            >
              ← Zurück
            </button>
          </div>
        </div>
      </div>
    );
  }

  // خطأ عام غير متوقع
  return (
    <div className="error-page">
      <div className="error-container">
        <h1 className="error-code">❌</h1>
        <h2 className="error-title">Unerwarteter Fehler</h2>
        <p className="error-message">
          {error instanceof Error
            ? error.message
            : "Ein unbekannter Fehler ist aufgetreten"}
        </p>
        <div className="error-actions">
          <Link to="/" className="btn-primary">
            Zur Startseite
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * Error title based on status code
 */
function getErrorTitle(status: number): string {
  switch (status) {
    case 400:
      return "Ungültige Anfrage";
    case 401:
      return "Nicht autorisiert";
    case 403:
      return "Zugriff verweigert";
    case 404:
      return "Seite nicht gefunden";
    case 500:
      return "Serverfehler";
    case 503:
      return "Dienst nicht verfügbar";
    default:
      return `Fehler ${status}`;
  }
}

/**
 * Error message based on status code
 */
function getErrorMessage(status: number): string {
  switch (status) {
    case 400:
      return "Die Anfrage konnte nicht verarbeitet werden. Bitte überprüfen Sie Ihre Eingabe.";
    case 401:
      return "Sie müssen sich anmelden, um auf diese Seite zuzugreifen.";
    case 403:
      return "Sie haben keine Berechtigung, auf diese Seite zuzugreifen.";
    case 404:
      return "Die angeforderte Seite konnte nicht gefunden werden. Möglicherweise wurde sie verschoben oder gelöscht.";
    case 500:
      return "Auf dem Server ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.";
    case 503:
      return "Der Dienst ist vorübergehend nicht verfügbar. Bitte versuchen Sie es später erneut.";
    default:
      return "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.";
  }
}
