// Todo-Item-Komponente mit Unteraufgaben-Support
import { Form, useNavigation } from "react-router";
import { useEffect, useRef, useState } from "react";
import type { Todo } from "~/services/todos/types";

type TodoItemProps = {
  todo: Todo;
  level?: number;
};

export function TodoItem({ todo, level = 0 }: TodoItemProps) {
  const navigation = useNavigation();
  const subtaskFormRef = useRef<HTMLFormElement>(null);
  const [isExpanded, setIsExpanded] = useState(true);

  const isDeleting =
    (navigation.state === "submitting" || navigation.state === "loading") &&
    navigation.formData?.get("intent") === "delete" &&
    navigation.formData?.get("todoId") === todo.$id;

  const isToggling =
    navigation.state === "submitting" &&
    navigation.formData?.get("intent") === "toggle" &&
    navigation.formData?.get("todoId") === todo.$id;

  // Subtask-Formular nach erfolgreichem Submit zurücksetzen
  useEffect(() => {
    if (navigation.state === "idle" && subtaskFormRef.current) {
      subtaskFormRef.current.reset();
    }
  }, [navigation.state]);

  // Ausblenden während des Löschens
  if (isDeleting) {
    return null;
  }

  return (
    <div className={`todo-item-wrapper ${level > 0 ? "nested" : ""}`}>
      <div className="todo-item">
        {todo.children && todo.children.length > 0 && (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="expand-btn"
            aria-label={
              isExpanded ? "إغلاق المهام الفرعية" : "توسيع المهام الفرعية"
            }
          >
            {isExpanded ? "▼" : "▶"}
          </button>
        )}

        {/* Toggle-Button */}
        <Form method="post" className="todo-form">
          <input type="hidden" name="intent" value="toggle" />
          <input type="hidden" name="todoId" value={todo.$id} />
          <input
            type="hidden"
            name="completed"
            value={String(todo.completed)}
          />
          <button
            type="submit"
            disabled={isToggling}
            className={`toggle-btn ${todo.completed ? "completed" : ""}`}
          >
            {todo.completed ? "☑" : "☐"}
          </button>
        </Form>

        {/* Aufgaben-Titel */}
        <span className={`todo-title ${todo.completed ? "completed" : ""}`}>
          {todo.title}
          {todo.children && todo.children.length > 0 && (
            <span className="subtask-count"> ({todo.children.length})</span>
          )}
        </span>

        {/* Löschen-Button */}
        <Form method="post" className="todo-form">
          <input type="hidden" name="intent" value="delete" />
          <input type="hidden" name="todoId" value={todo.$id} />
          <button type="submit" className="delete-btn">
            Löschen
          </button>
        </Form>
      </div>
      {isExpanded && (
        <>
          {/* Formular zum Hinzufügen von Unteraufgaben */}
          <Form method="post" className="subtask-form" ref={subtaskFormRef}>
            <input type="hidden" name="intent" value="add" />
            <input type="hidden" name="parentId" value={todo.$id} />
            <input
              type="text"
              name="title"
              placeholder="Unteraufgabe hinzufügen..."
              className="subtask-input"
            />
            <button type="submit" className="subtask-btn">
              +
            </button>
          </Form>

          {/* Rekursive Darstellung der Unteraufgaben */}
          {todo.children && todo.children.length > 0 && (
            <div className="subtasks-container">
              {todo.children.map((child) => (
                <TodoItem key={child.$id} todo={child} level={level + 1} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
