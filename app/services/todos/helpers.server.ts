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

  // إنشاء خريطة من جميع المهام
  todos.forEach((todo) => {
    todoMap.set(todo.$id, { ...todo, children: [] });
  });

  const rootTodos: Todo[] = [];

  // ربط المهام الفرعية بالمهام الأساسية
  todos.forEach((todo) => {
    const currentTodo = todoMap.get(todo.$id)!;

    if (todo.parentId) {
      const parent = todoMap.get(todo.parentId);
      if (parent) {
        parent.children!.push(currentTodo);
      } else {
        // إذا لم يتم العثور على الوالد، اعتبرها مهمة رئيسية
        rootTodos.push(currentTodo);
      }
    } else {
      rootTodos.push(currentTodo);
    }
  });

  return rootTodos;
}
