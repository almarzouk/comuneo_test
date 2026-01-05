// Appwrite Server - تصدير جميع وظائف Appwrite
// هذا الملف للتوافق مع الإصدارات السابقة

export { adminClient as databases } from "./appwrite.config.server";
export { adminClient } from "./appwrite.config.server";
export {
  createSessionClient,
  getSessionFromCookies,
  getCurrentUser,
} from "./appwrite.session.server";

// للتوافق مع الكود القديم
export { createSessionClient as createSessionFromCookies } from "./appwrite.session.server";

// تصدير Users API
import { Users } from "node-appwrite";
import { adminClient } from "./appwrite.config.server";

export const users = new Users(adminClient);
