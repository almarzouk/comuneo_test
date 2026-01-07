// ~/lib/appwrite.server.ts
// Main export file for all Appwrite server-side utilities

// Export admin client and config
export { adminClient, appwriteConfig } from "./appwrite.config.server";

// Export session management functions
export {
  createSessionClient,
  getSessionFromCookies,
  getCurrentUser,
  hasValidSession,
} from "./appwrite.session.server";

// Export auth helpers
export {
  createAdminClient,
  createSessionCookie,
  handleAuthError,
  validateEnvironmentVariables,
} from "../services/auth/helpers.server";

// For backward compatibility
export { createSessionClient as createSessionFromCookies } from "./appwrite.session.server";

// Export Users API helper
import { Users, Databases } from "node-appwrite";
import { adminClient } from "./appwrite.config.server";

export const users = new Users(adminClient);
export const databases = new Databases(adminClient);
