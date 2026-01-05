// Formular-Komponente zum Hinzufügen neuer Aufgaben
import { Form, useNavigation } from "react-router";
import { useEffect, useRef } from "react";

export function AddTodoForm() {
  const navigation = useNavigation();
  const formRef = useRef<HTMLFormElement>(null);

  // Formular nach erfolgreichem Submit zurücksetzen
  useEffect(() => {
    if (navigation.state === "idle" && formRef.current) {
      formRef.current.reset();
    }
  }, [navigation.state]);

  return (
    <div className="add-task-card">
      <h2 className="add-task-title">Neue Aufgabe erstellen</h2>
      <Form method="post" className="add-task-form" ref={formRef}>
        <input type="hidden" name="intent" value="add" />
        <input
          type="text"
          name="title"
          placeholder="Was möchten Sie erledigen?"
          className="add-task-input"
          required
        />
        <button type="submit" className="add-task-btn">
          Hinzufügen
        </button>
      </Form>
    </div>
  );
}
