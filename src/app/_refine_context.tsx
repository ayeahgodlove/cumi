"use client";

import { useNotificationProvider } from "@refinedev/antd";
import { Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import React from "react";

import routerProvider from "@refinedev/nextjs-router";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import "@refinedev/antd/dist/reset.css";
import { dataProvider } from "../providers/data-provider";
import { useMenu } from "../utils/menus";

import { Spin } from "antd";
import { accessControlProvider } from "../providers/access-control-provider";
import { useLocale, useTranslations } from "next-intl";
import { setUserLocale } from "../i18n/index";
import ClientProvider from "@contexts/provider";

export const App = (props: any) => {
  const { data, status } = useSession();
  const to = usePathname();
  const t = useTranslations();
  const { menus } = useMenu();

  if (status === "loading") {
    return (
      <Spin
        size="large"
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      />
    );
  }

  const i18nProvider = {
    translate: (key: any, options: any) => {
      return t(key, options);
    },
    getLocale: useLocale,
    changeLocale: setUserLocale,
  };

  const authProvider = {
    login: async () => {
      signIn("auth0", {
        callbackUrl: to ? to.toString() : "/",
        redirect: true,
      });

      return {
        success: true,
        redirectTo: "/",
      };
    },
    logout: async () => {
      signOut({
        redirect: true,
        callbackUrl: "/login",
      });

      return {
        success: true,
      };
    },
    onError: async (error: any) => {
      if (error.response?.status === 401) {
        return {
          logout: true,
        };
      }

      return {
        error,
      };
    },
    check: async () => {
      if (status === "unauthenticated") {
        return {
          authenticated: false,
          redirectTo: "/login",
        };
      }

      return {
        authenticated: true,
      };
    },
    getPermissions: async () => {
      if (!data?.user) return null; // Ensure user exists

      return {
        role: data.user.role ?? "user", // Ensure role is always set
        email: data.user.email,
        name: data.user.name,
        image: data.user.image,
      };
    },
    getIdentity: async () => {
      if (data?.user) {
        const { user } = data;
        return {
          name: user.name,
          email: user.email,
          avatar: user.image,
        };
      }

      return null;
    },
  };

  const filteredMenus = menus.filter((menu) => {
    // Ensure menu has all required properties
    if (!menu || !menu.name || !menu.meta) {
      return false;
    }
    
    // Check access permissions
    if (!menu.meta.canAccess?.includes(data ? data!.user.role : '')) {
      return false;
    }
    
    // Only include resources that have CRUD operations
    if (!menu.list) {
      return false;
    }
    
    // Ensure the resource has a valid name
    if (!menu.name || menu.name.trim() === '') {
      return false;
    }
    
    // Exclude hidden menu items
    if ((menu.meta as any).hidden === true) {
      return false;
    }
    
    return true;
  });

  return (
    <>
      <RefineKbarProvider>
        <AntdRegistry>
          <ClientProvider>
            <Refine
              routerProvider={routerProvider}
              dataProvider={dataProvider}
              accessControlProvider={{
                can: async ({ resource, action }) => {
                  const user = await authProvider.getPermissions();
                  return accessControlProvider.can({
                    resource,
                    action,
                    params: { user },
                  });
                },
                options: {},
              }}
              notificationProvider={useNotificationProvider}
              authProvider={authProvider}
              i18nProvider={i18nProvider}
              resources={filteredMenus}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                useNewQueryKeys: true,
                projectId: "njMZZm-fu7OWZ-sdebsw",
                breadcrumb: true,
                mutationMode: "optimistic",
              }}
              // liveProvider={liveProvider}
            >
              {props.children}
              <RefineKbar />
            </Refine>
          </ClientProvider>
        </AntdRegistry>
      </RefineKbarProvider>
    </>
  );
};
