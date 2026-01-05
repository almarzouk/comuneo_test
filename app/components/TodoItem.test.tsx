// Test für TodoItem-Komponente
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TodoItem } from "~/components/TodoItem";
import { createMemoryRouter, RouterProvider } from "react-router";
import type { Todo } from "~/services/todos/types";

describe("TodoItem", () => {
  const mockTodo: Todo = {
    $id: "test-1",
    title: "Testaufgabe",
    completed: false,
    userId: "user-1",
  };

  it("sollte die Aufgabe anzeigen", () => {
    const router = createMemoryRouter(
      [
        {
          path: "/",
          element: <TodoItem todo={mockTodo} />,
        },
      ],
      { initialEntries: ["/"] }
    );
    render(<RouterProvider router={router} />);

    expect(screen.getByText("Testaufgabe")).toBeInTheDocument();
  });

  it("sollte einen Toggle-Button haben", () => {
    const router = createMemoryRouter(
      [
        {
          path: "/",
          element: <TodoItem todo={mockTodo} />,
        },
      ],
      { initialEntries: ["/"] }
    );
    render(<RouterProvider router={router} />);

    const toggleButton = screen.getAllByRole("button")[0];
    expect(toggleButton).toBeInTheDocument();
    expect(toggleButton.textContent).toBe("☐");
  });

  it("sollte einen Löschen-Button haben", () => {
    const router = createMemoryRouter(
      [
        {
          path: "/",
          element: <TodoItem todo={mockTodo} />,
        },
      ],
      { initialEntries: ["/"] }
    );
    render(<RouterProvider router={router} />);

    const deleteButton = screen.getByRole("button", { name: /Löschen/i });
    expect(deleteButton).toBeInTheDocument();
  });

  it("sollte erledigte Aufgabe mit Checkbox anzeigen", () => {
    const completedTodo: Todo = {
      ...mockTodo,
      completed: true,
    };

    const router = createMemoryRouter(
      [
        {
          path: "/",
          element: <TodoItem todo={completedTodo} />,
        },
      ],
      { initialEntries: ["/"] }
    );
    render(<RouterProvider router={router} />);

    const toggleButton = screen.getAllByRole("button")[0];
    expect(toggleButton.textContent).toBe("☑");
  });

  it("sollte durchgestrichenen Text für erledigte Aufgabe haben", () => {
    const completedTodo: Todo = {
      ...mockTodo,
      completed: true,
    };

    const router = createMemoryRouter(
      [
        {
          path: "/",
          element: <TodoItem todo={completedTodo} />,
        },
      ],
      { initialEntries: ["/"] }
    );
    render(<RouterProvider router={router} />);

    const title = screen.getByText("Testaufgabe");
    expect(title).toHaveClass("completed");
  });

  it("sollte Unteraufgaben-Formular anzeigen", () => {
    const router = createMemoryRouter(
      [
        {
          path: "/",
          element: <TodoItem todo={mockTodo} />,
        },
      ],
      { initialEntries: ["/"] }
    );
    render(<RouterProvider router={router} />);

    expect(
      screen.getByPlaceholderText(/Unteraufgabe hinzufügen/i)
    ).toBeInTheDocument();
  });

  it("sollte Unteraufgaben rekursiv anzeigen", () => {
    const todoWithChildren: Todo = {
      ...mockTodo,
      children: [
        {
          $id: "child-1",
          title: "Unteraufgabe 1",
          completed: false,
          userId: "user-1",
          parentId: "test-1",
        },
      ],
    };

    const router = createMemoryRouter(
      [
        {
          path: "/",
          element: <TodoItem todo={todoWithChildren} />,
        },
      ],
      { initialEntries: ["/"] }
    );
    render(<RouterProvider router={router} />);

    expect(screen.getByText("Testaufgabe")).toBeInTheDocument();
    expect(screen.getByText("Unteraufgabe 1")).toBeInTheDocument();
  });

  it("sollte Expand-Button für Aufgaben mit Unteraufgaben anzeigen", () => {
    const todoWithChildren: Todo = {
      ...mockTodo,
      children: [
        {
          $id: "child-1",
          title: "Unteraufgabe 1",
          completed: false,
          userId: "user-1",
          parentId: "test-1",
        },
      ],
    };

    const router = createMemoryRouter(
      [
        {
          path: "/",
          element: <TodoItem todo={todoWithChildren} />,
        },
      ],
      { initialEntries: ["/"] }
    );
    render(<RouterProvider router={router} />);

    const expandButton = screen.getByLabelText(
      /إغلاق المهام الفرعية|توسيع المهام الفرعية/i
    );
    expect(expandButton).toBeInTheDocument();
  });

  it("sollte Unteraufgaben ausblenden wenn collapsed", async () => {
    const todoWithChildren: Todo = {
      ...mockTodo,
      children: [
        {
          $id: "child-1",
          title: "Unteraufgabe 1",
          completed: false,
          userId: "user-1",
          parentId: "test-1",
        },
      ],
    };

    const router = createMemoryRouter(
      [
        {
          path: "/",
          element: <TodoItem todo={todoWithChildren} />,
        },
      ],
      { initialEntries: ["/"] }
    );
    render(<RouterProvider router={router} />);
    const user = userEvent.setup();

    // Standardmäßig sichtbar
    expect(screen.getByText("Unteraufgabe 1")).toBeInTheDocument();

    // Klick auf Expand-Button
    const expandButton = screen.getByLabelText(/إغلاق المهام الفرعية/i);
    await user.click(expandButton);

    // Unteraufgabe sollte ausgeblendet sein
    expect(screen.queryByText("Unteraufgabe 1")).not.toBeInTheDocument();
  });

  it("sollte Anzahl der Unteraufgaben anzeigen", () => {
    const todoWithChildren: Todo = {
      ...mockTodo,
      children: [
        {
          $id: "child-1",
          title: "Unteraufgabe 1",
          completed: false,
          userId: "user-1",
          parentId: "test-1",
        },
        {
          $id: "child-2",
          title: "Unteraufgabe 2",
          completed: false,
          userId: "user-1",
          parentId: "test-1",
        },
      ],
    };

    const router = createMemoryRouter(
      [
        {
          path: "/",
          element: <TodoItem todo={todoWithChildren} />,
        },
      ],
      { initialEntries: ["/"] }
    );
    render(<RouterProvider router={router} />);

    expect(screen.getByText(/\(2\)/)).toBeInTheDocument();
  });
});
