// Todo-Item-Komponente mit Unteraufgaben-Support
import { Form, useNavigation, useFetcher } from "react-router";
import { useEffect, useRef, useState } from "react";
import type { Todo } from "~/services/todos/types";

type TodoItemProps = {
  todo: Todo;
  level?: number;
  loadedChildren: Record<string, Todo[]>;
};

export function TodoItem({ todo, level = 0, loadedChildren }: TodoItemProps) {
  const navigation = useNavigation();
  const fetcher = useFetcher();
  const addSubtaskFetcher = useFetcher();
  const subtaskFormRef = useRef<HTMLFormElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [localChildren, setLocalChildren] = useState<Todo[]>([]);

  const isDeleting =
    (navigation.state === "submitting" || navigation.state === "loading") &&
    navigation.formData?.get("intent") === "delete" &&
    navigation.formData?.get("todoId") === todo.$id;

  const isToggling =
    navigation.state === "submitting" &&
    navigation.formData?.get("intent") === "toggle" &&
    navigation.formData?.get("todoId") === todo.$id;

  // Daten vom fetcher lokal speichern
  useEffect(() => {
    if (
      fetcher.data &&
      "children" in fetcher.data &&
      fetcher.data.parentId === todo.$id
    ) {
      setLocalChildren(fetcher.data.children as Todo[]);
    }
  }, [fetcher.data, todo.$id]);

  // Nach erfolgreicher Subtask-Erstellung, Children neu laden
  useEffect(() => {
    if (
      addSubtaskFetcher.state === "idle" &&
      addSubtaskFetcher.data &&
      "success" in addSubtaskFetcher.data
    ) {
      fetcher.submit(
        { intent: "loadChildren", parentId: todo.$id },
        { method: "post" }
      );
      if (subtaskFormRef.current) {
        subtaskFormRef.current.reset();
      }
    }
  }, [addSubtaskFetcher.state, addSubtaskFetcher.data, todo.$id]);

  // Children aus verschiedenen Quellen abrufen
  const children =
    loadedChildren[todo.$id] || localChildren || todo.children || [];
  const hasChildren = children.length > 0;
  const isLoadingChildren =
    fetcher.state === "submitting" &&
    fetcher.formData?.get("parentId") === todo.$id;

  // Expand-Button Handler mit automatischem Laden
  const handleExpand = () => {
    if (!isExpanded) {
      if (
        !loadedChildren[todo.$id] &&
        !localChildren.length &&
        !todo.children
      ) {
        fetcher.submit(
          { intent: "loadChildren", parentId: todo.$id },
          { method: "post" }
        );
      }
    }
    setIsExpanded(!isExpanded);
  };

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
        {/* Expand-Button für alle Aufgaben */}
        <button
          type="button"
          onClick={handleExpand}
          className="expand-btn"
          aria-label={
            isExpanded ? "Unteraufgaben schließen" : "Unteraufgaben erweitern"
          }
        >
          {isLoadingChildren ? "⋯" : isExpanded ? "▼" : "▶"}
        </button>

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
          {hasChildren && (
            <span className="subtask-count"> ({children.length})</span>
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
          <addSubtaskFetcher.Form
            method="post"
            className="subtask-form"
            ref={subtaskFormRef}
          >
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
          </addSubtaskFetcher.Form>

          {/* Rekursive Darstellung der Unteraufgaben */}
          {hasChildren && (
            <div className="subtasks-container">
              {children.map((child) => (
                <TodoItem
                  key={child.$id}
                  todo={child}
                  level={level + 1}
                  loadedChildren={loadedChildren}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
