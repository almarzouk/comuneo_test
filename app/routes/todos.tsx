import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { getUserTodos, handleTodoAction } from "~/services/todos/service";
import { TodoHeader } from "~/components/TodoHeader";
import { AddTodoForm } from "~/components/AddTodoForm";
import { TodoList } from "~/components/TodoList";

// Lädt die Aufgabenliste für den aktuellen Benutzer
export async function loader({ request }: LoaderFunctionArgs) {
  return getUserTodos(request);
}

// Verarbeitet alle Aktionen: Hinzufügen, Umschalten, Löschen
export async function action({ request }: ActionFunctionArgs) {
  return handleTodoAction(request);
}

// Hauptkomponente für die Aufgabenverwaltung
export default function Todos() {
  const { todos, user } = useLoaderData<typeof loader>();

  return (
    <div className="todos-page">
      <TodoHeader userName={user.name} />

      <div className="main-content">
        <AddTodoForm />
        <TodoList todos={todos} />
      </div>
    </div>
  );
}
