// Header-Komponente für Todos-Seite
import { Form } from "react-router";

type TodoHeaderProps = {
  userName: string;
};

export function TodoHeader({ userName }: TodoHeaderProps) {
  return (
    <div className="todos-header">
      <div className="header-container">
        <div>
          <h1 className="header-title">Hallo {userName}!</h1>
          <p className="header-subtitle">
            Verwalten Sie Ihre Aufgaben effizient
          </p>
        </div>
        <Form method="post">
          <input type="hidden" name="intent" value="logout" />
          <button type="submit" className="logout-btn">
            Abmelden
          </button>
        </Form>
      </div>
    </div>
  );
}
