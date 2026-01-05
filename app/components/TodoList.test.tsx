// Test für TodoList-Komponente
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TodoList } from "~/components/TodoList";
import { createMemoryRouter, RouterProvider } from "react-router";
import type { Todo } from "~/services/todos/types";

describe("TodoList", () => {
  it("sollte leeren Zustand anzeigen, wenn keine Aufgaben vorhanden sind", () => {
    const router = createMemoryRouter(
      [
        {
          path: "/",
          element: <TodoList todos={[]} />,
        },
      ],
      { initialEntries: ["/"] }
    );
    render(<RouterProvider router={router} />);

    expect(
      screen.getByText(/Noch keine Aufgaben vorhanden/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Erstellen Sie Ihre erste Aufgabe oben!/i)
    ).toBeInTheDocument();
  });

  it("sollte den Titel 'Meine Aufgaben' anzeigen", () => {
    const router = createMemoryRouter(
      [
        {
          path: "/",
          element: <TodoList todos={[]} />,
        },
      ],
      { initialEntries: ["/"] }
    );
    render(<RouterProvider router={router} />);

    expect(screen.getByText(/Meine Aufgaben/i)).toBeInTheDocument();
  });

  it("sollte eine einzelne Aufgabe anzeigen", () => {
    const todos: Todo[] = [
      {
        $id: "1",
        title: "Aufgabe 1",
        completed: false,
        userId: "user-1",
      },
    ];

    const router = createMemoryRouter(
      [
        {
          path: "/",
          element: <TodoList todos={todos} />,
        },
      ],
      { initialEntries: ["/"] }
    );
    render(<RouterProvider router={router} />);

    expect(screen.getByText("Aufgabe 1")).toBeInTheDocument();
  });

  it("sollte mehrere Aufgaben anzeigen", () => {
    const todos: Todo[] = [
      {
        $id: "1",
        title: "Aufgabe 1",
        completed: false,
        userId: "user-1",
      },
      {
        $id: "2",
        title: "Aufgabe 2",
        completed: true,
        userId: "user-1",
      },
      {
        $id: "3",
        title: "Aufgabe 3",
        completed: false,
        userId: "user-1",
      },
    ];

    const router = createMemoryRouter(
      [
        {
          path: "/",
          element: <TodoList todos={todos} />,
        },
      ],
      { initialEntries: ["/"] }
    );
    render(<RouterProvider router={router} />);

    expect(screen.getByText("Aufgabe 1")).toBeInTheDocument();
    expect(screen.getByText("Aufgabe 2")).toBeInTheDocument();
    expect(screen.getByText("Aufgabe 3")).toBeInTheDocument();
  });

  it("sollte keinen leeren Zustand anzeigen, wenn Aufgaben vorhanden sind", () => {
    const todos: Todo[] = [
      {
        $id: "1",
        title: "Aufgabe 1",
        completed: false,
        userId: "user-1",
      },
    ];

    const router = createMemoryRouter(
      [
        {
          path: "/",
          element: <TodoList todos={todos} />,
        },
      ],
      { initialEntries: ["/"] }
    );
    render(<RouterProvider router={router} />);

    expect(
      screen.queryByText(/Noch keine Aufgaben vorhanden/i)
    ).not.toBeInTheDocument();
  });
});
