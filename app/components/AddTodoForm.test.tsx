// Test für AddTodoForm-Komponente
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddTodoForm } from "~/components/AddTodoForm";
import { createMemoryRouter, RouterProvider } from "react-router";

describe("AddTodoForm", () => {
  it("sollte das Formular rendern", () => {
    const router = createMemoryRouter(
      [
        {
          path: "/",
          element: <AddTodoForm />,
        },
      ],
      { initialEntries: ["/"] }
    );
    render(<RouterProvider router={router} />);

    expect(screen.getByText(/Neue Aufgabe erstellen/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Was möchten Sie erledigen?/i)
    ).toBeInTheDocument();
  });

  it("sollte einen Hinzufügen-Button haben", () => {
    const router = createMemoryRouter(
      [
        {
          path: "/",
          element: <AddTodoForm />,
        },
      ],
      { initialEntries: ["/"] }
    );
    render(<RouterProvider router={router} />);

    const addButton = screen.getByRole("button", { name: /Hinzufügen/i });
    expect(addButton).toBeInTheDocument();
  });

  it("sollte Texteingabe ermöglichen", async () => {
    const user = userEvent.setup();

    const router = createMemoryRouter(
      [
        {
          path: "/",
          element: <AddTodoForm />,
        },
      ],
      { initialEntries: ["/"] }
    );
    render(<RouterProvider router={router} />);

    const input = screen.getByPlaceholderText(
      /Was möchten Sie erledigen?/i
    ) as HTMLInputElement;

    await user.type(input, "Neue Testaufgabe");

    expect(input.value).toBe("Neue Testaufgabe");
  });

  it("sollte ein required-Feld sein", () => {
    const router = createMemoryRouter(
      [
        {
          path: "/",
          element: <AddTodoForm />,
        },
      ],
      { initialEntries: ["/"] }
    );
    render(<RouterProvider router={router} />);

    const input = screen.getByPlaceholderText(/Was möchten Sie erledigen?/i);
    expect(input).toBeRequired();
  });
});
