"use client";

import { TOKEN_KEY } from "@constants/constant";
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

      localStorage.setItem(TOKEN_KEY, user.token);
      if (user) {
        Cookies.set("auth", JSON.stringify(user), {
          expires: 30, // 30 days
          path: "/",
        });
        return {
          success: true,
          redirectTo: "/",
        };
      }

      return response.data.data;
    } catch (error: any) {
      console.log("login error", error.response.data);
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
    Cookies.remove("auth", { path: "/" });
    return {
      success: true,
      redirectTo: "/login",
    };
  },
  check: async () => {
    const token = JSON.parse(
      JSON.stringify(window.localStorage.getItem(TOKEN_KEY)!)
    );
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
    const auth = Cookies.get("auth");
    if (auth) {
      const parsedUser = JSON.parse(auth);
      return parsedUser.roles;
    }
    return null;
  },
  getIdentity: async () => {
    const auth = Cookies.get("auth");
    const parsedUser = auth ? JSON.parse(auth) : null;
    const token = JSON.parse(
      JSON.stringify(window.localStorage.getItem(TOKEN_KEY)!)
    );
    if (token) {
      try {
        const userInfo = await userService.details(parsedUser.id);
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
