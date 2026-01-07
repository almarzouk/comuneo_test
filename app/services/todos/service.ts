// Todos Service - Hauptverwaltung der Aufgaben
import { redirect } from "react-router";
import { createSessionClient } from "~/lib/appwrite.server";
import { ID, Query, type Databases } from "node-appwrite";
import { validateTodoTitle } from "./validation";
import { buildTodoHierarchy, DATABASE_CONFIG } from "./helpers.server";
import type { Todo } from "./types";

const { DATABASE_ID, TODOS_COLLECTION_ID } = DATABASE_CONFIG;

/**
 * Alle Hauptaufgaben des aktuellen Benutzers abrufen
 */
export async function getUserTodos(request: Request) {
  try {
    const { databases, user } = await createSessionClient(request);

    const response = await databases.listDocuments(
      DATABASE_ID,
      TODOS_COLLECTION_ID,
      [
        Query.equal("userId", user.$id),
        Query.isNull("parentId"), // Nur Hauptaufgaben abrufen
        Query.limit(1000),
      ]
    );

    const todos = response.documents as unknown as Todo[];
    // buildTodoHierarchy nicht erforderlich, da noch keine children geladen
    return { todos, user };
  } catch (error) {
    // Redirect mit Löschung des ungültigen Cookies
    throw new Response(null, {
      status: 302,
      headers: {
        Location: "/login",
        "Set-Cookie": `a_session_${process.env.APPWRITE_PROJECT_ID}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`,
      },
    });
  }
}

/**
 * Unteraufgaben einer bestimmten Aufgabe abrufen
 */
export async function getChildTodos(
  databases: Databases,
  userId: string,
  parentId: string
) {
  const response = await databases.listDocuments(
    DATABASE_ID,
    TODOS_COLLECTION_ID,
    [
      Query.equal("userId", userId),
      Query.equal("parentId", parentId),
      Query.limit(100),
    ]
  );

  return response.documents as unknown as Todo[];
}

/**
 * Neue Aufgabe hinzufügen
 */
export async function addTodo(
  databases: Databases,
  userId: string,
  title: string,
  parentId?: string | null
) {
  const validation = validateTodoTitle(title);
  if (!validation.valid) {
    return { error: validation.error };
  }

  const todoData: any = {
    title: title.trim(),
    completed: false,
    userId: userId,
  };

  if (parentId) {
    todoData.parentId = parentId;
  }

  await databases.createDocument(
    DATABASE_ID,
    TODOS_COLLECTION_ID,
    ID.unique(),
    todoData
  );

  return { success: true };
}

/**
 * Umschalten des Erledigt-Status einer Aufgabe
 */
export async function toggleTodo(
  databases: Databases,
  todoId: string,
  currentCompleted: boolean
) {
  await databases.updateDocument(DATABASE_ID, TODOS_COLLECTION_ID, todoId, {
    completed: !currentCompleted,
  });

  return { success: true };
}

/**
 * Löschen einer Aufgabe und aller ihrer Unteraufgaben
 */
export async function deleteTodoWithChildren(
  databases: Databases,
  todoId: string
) {
  async function deleteRecursive(id: string) {
    const children = await databases.listDocuments(
      DATABASE_ID,
      TODOS_COLLECTION_ID,
      [Query.equal("parentId", id)]
    );

    for (const child of children.documents) {
      await deleteRecursive(child.$id);
    }

    await databases.deleteDocument(DATABASE_ID, TODOS_COLLECTION_ID, id);
  }

  await deleteRecursive(todoId);
  return { success: true };
}

/**
 *  Verarbeiten von Aktionen für Aufgaben (Hinzufügen, Umschalten, Löschen, Abmelden)
 */
export async function handleTodoAction(request: Request) {
  const { databases, user } = await createSessionClient(request);
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "add") {
    const title = formData.get("title") as string;
    const parentId = formData.get("parentId") as string | null;
    return addTodo(databases, user.$id, title, parentId);
  }

  if (intent === "toggle") {
    const todoId = formData.get("todoId") as string;
    const completed = formData.get("completed") === "true";
    return toggleTodo(databases, todoId, completed);
  }

  if (intent === "delete") {
    const todoId = formData.get("todoId") as string;
    return deleteTodoWithChildren(databases, todoId);
  }

  if (intent === "loadChildren") {
    const parentId = formData.get("parentId") as string;
    const children = await getChildTodos(databases, user.$id, parentId);
    return { children, parentId };
  }

  return { error: "Unbekannte Aktion" };
}
