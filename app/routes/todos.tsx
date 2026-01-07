// Todos-Seite - Geschützte Route
import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import { Form, useLoaderData, useActionData } from "react-router";
import { requireAuth } from "~/services/auth/service.server";
import { getUserTodos, handleTodoAction } from "~/services/todos/service";
import { TodoList } from "~/components/TodoList";
import { AddTodoForm } from "~/components/AddTodoForm";
import { useState, useEffect } from "react";
import type { Todo } from "~/services/todos/types";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAuth(request);
  const data = await getUserTodos(request);
  return data;
}

export async function action({ request }: ActionFunctionArgs) {
  return handleTodoAction(request);
}

export default function Todos() {
  const { user, todos } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  // تخزين الأبناء المحملة لكل مهمة
  const [loadedChildren, setLoadedChildren] = useState<Record<string, Todo[]>>(
    {}
  );

  // عند استلام children من action، نضيفها للـ state
  useEffect(() => {
    if (actionData && "children" in actionData && "parentId" in actionData) {
      setLoadedChildren((prev) => ({
        ...prev,
        [actionData.parentId as string]: actionData.children as Todo[],
      }));
    }
  }, [actionData]);

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="header-title">My Tasks</h1>
            <p className="header-subtitle">
              Welcome, {user.name || user.email}
            </p>
          </div>
          <Form method="post" action="/logout">
            <button type="submit" className="btn-logout">
              Logout
            </button>
          </Form>
        </div>
      </header>

      <main className="main-content">
        <section className="add-task-section">
          <h2 className="section-title">Add New Task</h2>
          <AddTodoForm />
        </section>

        <section className="tasks-section">
          <div className="section-header">
            <h2 className="section-title">All Tasks</h2>
            <span className="task-counter">{todos.length} tasks</span>
          </div>

          {todos.length === 0 ? (
            <div className="empty-state">
              <p className="empty-text">
                No tasks yet. Create your first task above!
              </p>
            </div>
          ) : (
            <TodoList todos={todos} loadedChildren={loadedChildren} />
          )}
        </section>
      </main>
    </div>
  );
}
