// Test für TodoHeader-Komponente
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TodoHeader } from "~/components/TodoHeader";
import { createMemoryRouter, RouterProvider } from "react-router";

describe("TodoHeader", () => {
  it("sollte den Benutzernamen anzeigen", () => {
    const router = createMemoryRouter(
      [
        {
          path: "/",
          element: <TodoHeader userName="Max Mustermann" />,
        },
      ],
      { initialEntries: ["/"] }
    );
    render(<RouterProvider router={router} />);

    expect(screen.getByText(/Hallo Max Mustermann!/i)).toBeInTheDocument();
  });

  it("sollte den Untertitel anzeigen", () => {
    const router = createMemoryRouter(
      [
        {
          path: "/",
          element: <TodoHeader userName="Test User" />,
        },
      ],
      { initialEntries: ["/"] }
    );
    render(<RouterProvider router={router} />);

    expect(
      screen.getByText(/Verwalten Sie Ihre Aufgaben effizient/i)
    ).toBeInTheDocument();
  });

  it("sollte einen Abmelden-Button haben", () => {
    const router = createMemoryRouter(
      [
        {
          path: "/",
          element: <TodoHeader userName="Test User" />,
        },
      ],
      { initialEntries: ["/"] }
    );
    render(<RouterProvider router={router} />);

    const logoutButton = screen.getByRole("button", { name: /Abmelden/i });
    expect(logoutButton).toBeInTheDocument();
  });
});
