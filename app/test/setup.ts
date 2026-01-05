// Test Setup-Datei
import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Automatisches Aufräumen nach jedem Test
afterEach(() => {
  cleanup();
});
