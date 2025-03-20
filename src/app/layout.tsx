import { useNotificationProvider } from "@refinedev/antd";
import { Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import routerProvider from "@refinedev/nextjs-router";
import { Metadata } from "next";
import { cookies } from "next/headers";
import React, { Suspense } from "react";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ColorModeContextProvider } from "@contexts/color-mode";
import { dataProvider } from "@providers/data-provider";
import "@refinedev/antd/dist/reset.css";
import { NextIntlClientProvider, useLocale, useTranslations } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { SessionProvider, signIn, signOut, useSession } from "next-auth/react";

import { GrBlog, GrDashboard, GrServices } from "react-icons/gr";
import { TbCategoryPlus } from "react-icons/tb";
import { FiBook, FiGlobe, FiPaperclip, FiTag } from "react-icons/fi";
import { FcEditImage } from "react-icons/fc";
import { SlEvent } from "react-icons/sl";
import { AiOutlineFundProjectionScreen } from "react-icons/ai";
import "../styles/app.scss";
import "../styles/home.scss";
import ClientProvider from "@contexts/provider";
import { MdBrowseGallery } from "react-icons/md";
import { FaCircleQuestion } from "react-icons/fa6";
import { FaFireExtinguisher } from "react-icons/fa";
import { IoSchoolOutline } from "react-icons/io5";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { setUserLocale } from "@i18n";
import { usePathname } from "next/navigation";
import { useMenu } from "@utils/menus";
import { accessControlProvider } from "@providers/access-control-provider";

export const metadata: Metadata = {
  title: "",
  description: "",
  openGraph: {
    title: "",
    description: "",
    url: "",
    images: [
      {
        url: "/desola-lanre-ologun-IgUR1iX0mqM-unsplash",
        alt: "",
      },
    ],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data, status } = useSession();
  const cookieStore = cookies();
  const theme = cookieStore.get("theme");
  const defaultMode = theme?.value === "dark" ? "dark" : "light";
  const t = useTranslations();
  const to = usePathname();
  const { menus } = useMenu();

  const locale = await getLocale();
  const messages = await getMessages();

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
      console.log("key | option: ", key, options);
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

      // return { role: data?.user?.role ?? "user" }; // Default role is "user"
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

  const filteredMenus = menus.filter((menu) =>
    menu.meta?.canAccess?.includes(data!.user.role)
  );

  return (
    <html lang="en">
      <head>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN"
          crossOrigin="anonymous"
        />
      </head>
      <body cz-shortcut-listen="false">
        <Suspense
          fallback={
            <Spin
              size="large"
              indicator={
                <LoadingOutlined
                  style={{
                    fontSize: 48,
                  }}
                  spin
                />
              }
              style={{
                minHeight: "65vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              fullscreen
            />
          }
        >
          <SessionProvider>
            <NextIntlClientProvider locale={locale} messages={messages}>
              <RefineKbarProvider>
                <AntdRegistry>
                  <ClientProvider>
                    <ColorModeContextProvider defaultMode={defaultMode}>
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
                        }}
                      >
                        {children}
                        <RefineKbar />
                      </Refine>
                    </ColorModeContextProvider>
                  </ClientProvider>
                </AntdRegistry>
              </RefineKbarProvider>
            </NextIntlClientProvider>
          </SessionProvider>
        </Suspense>

        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
          integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL"
          crossOrigin="anonymous"
        ></script>
      </body>
    </html>
  );
}
