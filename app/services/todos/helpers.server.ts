// Todos Helpers - Aufgaben-Hilfsfunktionen
// Nur serverseitig verwendbar
import type { Todo } from "./types";

/**
 * Datenbank-Konfiguration für Aufgaben
 *
 * Zentrale Konfiguration für Datenbank-IDs,
 * kann über Umgebungsvariablen überschrieben werden
 */
export const DATABASE_CONFIG = {
  DATABASE_ID:
    process.env.APPWRITE_DATABASE_ID || "764711298712647129812497124817248124",
  TODOS_COLLECTION_ID: process.env.APPWRITE_TODOS_COLLECTION_ID || "todos",
} as const;

/**
 * Baut eine hierarchische Aufgabenstruktur auf
 *
 * Wandelt eine flache Liste von Aufgaben in eine Baumstruktur um,
 * wobei Unteraufgaben ihren Elternaufgaben zugeordnet werden
 *
 * @param todos - Flache Liste aller Aufgaben
 * @returns Hierarchisch organisierte Aufgaben (nur Root-Aufgaben)
 */
export function buildTodoHierarchy(todos: Todo[]): Todo[] {
  const todoMap = new Map<string, Todo>();

  todos.forEach((todo) => {
    todoMap.set(todo.$id, { ...todo, children: [] });
  });

  const rootTodos: Todo[] = [];

  // Linking sub-tasks to their parent tasks
  todos.forEach((todo) => {
    const currentTodo = todoMap.get(todo.$id)!;

    if (todo.parentId) {
      const parent = todoMap.get(todo.parentId);
      if (parent) {
        parent.children!.push(currentTodo);
      } else {
        // If no parent is found, consider it a root task
        rootTodos.push(currentTodo);
      }
    } else {
      rootTodos.push(currentTodo);
    }
  });

  return rootTodos;
}
