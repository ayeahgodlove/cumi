import { AccessControlProvider } from "@refinedev/core";

interface User {
  role: "admin" | "editor" | "user"; // Define allowed roles
}

export const accessControlProvider: AccessControlProvider = {
  can: async ({ resource, action, params }): Promise<{ can: boolean }> => {
    const user: User | undefined = params?.user; // Ensure type safety

    if (!user) {
      return { can: false };
    }

    // Define role-based permissions
    const permissions: Record<User["role"], { can: string[] }> = {
      admin: { can: ["create", "edit", "delete", "show", "list"] },
      editor: { can: ["create", "edit", "show", "list"] },
      user: { can: ["show", "list"] },
    };

    // Check if the user has access to the resource and action
    const canAccess: boolean =
      permissions[user.role]?.can.includes(action) ?? false;

    return { can: canAccess };
  },
};
