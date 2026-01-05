import { Client } from "node-appwrite";

/**
 * Used for operations requiring administrative privileges
 */
export function createAppwriteAdminClient() {
  return new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT!)
    .setProject(process.env.APPWRITE_PROJECT_ID!)
    .setKey(process.env.APPWRITE_API_KEY!);
}

/**
 * Admin Client instance
 */
export const adminClient = createAppwriteAdminClient();
