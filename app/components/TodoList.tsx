// Todo-Listen-Komponente
import { TodoItem } from "./TodoItem";
import type { Todo } from "~/services/todos/types";

type TodoListProps = {
  todos: Todo[];
  loadedChildren: Record<string, Todo[]>;
};

export function TodoList({ todos, loadedChildren }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div>
        <h2 className="tasks-section-title">Meine Aufgaben</h2>
        <div className="empty-state">
          <p className="empty-state-text">Noch keine Aufgaben vorhanden.</p>
          <p className="empty-state-subtext">
            Erstellen Sie Ihre erste Aufgabe oben!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="tasks-section-title">Meine Aufgaben</h2>
      <div className="tasks-list">
        {todos.map((todo) => (
          <TodoItem
            key={todo.$id}
            todo={todo}
            loadedChildren={loadedChildren}
          />
        ))}
      </div>
    </div>
  );
}
