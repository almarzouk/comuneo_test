// Todos Validation - Aufgaben-Validierung

/**
 * Validiert den Titel einer Aufgabe
 *
 * Überprüft, ob der Titel nicht leer ist und
 * die maximale Länge nicht überschreitet
 *
 * @param title - Der zu validierende Aufgabentitel
 * @returns Validierungsergebnis mit Fehlermeldung
 */
export function validateTodoTitle(title: string | null): {
  valid: boolean;
  error?: string;
} {
  if (!title || title.trim() === "") {
    return { valid: false, error: "Der Titel darf nicht leer sein" };
  }

  if (title.trim().length > 500) {
    return { valid: false, error: "Der Titel ist zu lang (max. 500 Zeichen)" };
  }

  return { valid: true };
}
