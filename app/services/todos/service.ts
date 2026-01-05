// Todos Service - خدمة إدارة المهام الرئيسية
import { redirect } from "react-router";
import { createSessionClient } from "~/lib/appwrite.server";
import { ID, Query, type Databases } from "node-appwrite";
import { validateTodoTitle } from "./validation";
import { buildTodoHierarchy, DATABASE_CONFIG } from "./helpers.server";
import type { Todo } from "./types";

const { DATABASE_ID, TODOS_COLLECTION_ID } = DATABASE_CONFIG;

/**
 * جلب جميع مهام المستخدم الحالي
 */
export async function getUserTodos(request: Request) {
  try {
    const { databases, user } = await createSessionClient(request);

    const response = await databases.listDocuments(
      DATABASE_ID,
      TODOS_COLLECTION_ID,
      [Query.equal("userId", user.$id), Query.limit(1000)]
    );

    const todos = response.documents as unknown as Todo[];
    const rootTodos = buildTodoHierarchy(todos);

    return { todos: rootTodos, user };
  } catch (error) {
    return redirect("/login");
  }
}

/**
 * neue Aufgabe hinzufügen
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

  if (intent === "logout") {
    return redirect("/login", {
      headers: {
        "Set-Cookie": `a_session_6954432d000792378fb8=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`,
      },
    });
  }

  return { error: "Unbekannte Aktion" };
}
