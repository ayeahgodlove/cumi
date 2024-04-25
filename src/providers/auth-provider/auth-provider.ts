"use client";

import { TOKEN_KEY, USER_DATA } from "@constants/constant";
import { AuthBindings } from "@refinedev/core";
import { authService } from "@service/auth.service";
import { userService } from "@service/user.service";
import Cookies from "js-cookie";

export const authProvider: AuthBindings = {
  login: async ({ email, username, password, remember }) => {
    // Suppose we actually send a request to the back end here.
    try {
      const response = await authService.login({ email, password });
      const user = response.data.data;

      if (user) {
        Cookies.set("auth", JSON.stringify(user), {
          expires: 30, // 30 days
          path: "/dashboard",
        });
        localStorage.setItem(TOKEN_KEY, JSON.stringify(user.token));
        localStorage.setItem(USER_DATA, JSON.stringify(user));

        return {
          success: true,
          redirectTo: "/dashboard",
        };
      }

      return response.data.data;
    } catch (error: any) {
      const { message } = error.response.data;
      return {
        success: false,
        error: {
          name: "LoginError",
          message,
        },
      };
    }
  },
  logout: async () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_DATA);
    // Cookies.remove("auth", { path: "/" });
    return {
      success: true,
      redirectTo: "/login",
    };
  },
  check: async () => {
    const token = JSON.parse(window.localStorage.getItem(TOKEN_KEY)!);
    if (token) {
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      logout: true,
      redirectTo: "/login",
    };
  },
  getPermissions: async () => {
    const user = JSON.parse(window.localStorage.getItem(USER_DATA)!);
    if (user) {
      return user.roles;
    }
    return null;
  },
  getIdentity: async () => {
    // const auth = Cookies.get("auth");
    // const parsedUser = auth ? JSON.parse(auth) : null;
    const token = JSON.parse(window.localStorage.getItem(TOKEN_KEY)!);
    const user = JSON.parse(window.localStorage.getItem(USER_DATA)!);
    if (token) {
      try {
        const userInfo = await userService.details(user.id);
        return userInfo.data;
      } catch (error) {
        console.warn(error);
        return null;
      }
    }
    return null;
  },
  onError: async (error) => {
    if (error.response?.status === 401) {
      return {
        logout: true,
      };
    }

    return { error };
  },
};
