// import { DevtoolsProvider } from "@providers/devtools";
import { useNotificationProvider } from "@refinedev/antd";
import { Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import routerProvider from "@refinedev/nextjs-router";
import { Metadata } from "next";
import { cookies } from "next/headers";
import React, { Suspense } from "react";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ColorModeContextProvider } from "@contexts/color-mode";
import { authProvider } from "@providers/auth-provider";
import { dataProvider } from "@providers/data-provider";
import "@refinedev/antd/dist/reset.css";

import { GrBlog, GrDashboard, GrServices } from "react-icons/gr";
import { TbCategoryPlus } from "react-icons/tb";
import { FiBook, FiGlobe, FiPaperclip, FiTag, FiUsers } from "react-icons/fi";
import { FcEditImage } from "react-icons/fc";
import { SlEvent } from "react-icons/sl";
import { AiOutlineFundProjectionScreen } from "react-icons/ai";
import "../styles/app.scss";
import "../styles/home.scss";
import ClientProvider from "@contexts/provider";
import sequelize from "@database/db-sequelize.config";
import { MdBrowseGallery } from "react-icons/md";
import { FaCircleQuestion } from "react-icons/fa6";
import { FaFireExtinguisher } from "react-icons/fa";
import { IoSchoolOutline } from "react-icons/io5";

// initialize.ts

const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    ("Connection has been established successfully!.");
    await sequelize.sync(); // Sync all models
  } catch (error) {
    console.error("Unable to connect to the database", error);
  }
};

initializeDatabase();

export const metadata: Metadata = {
  title: "Cumi - Empowering Your Digital Journey",
  description:
    "We're committed to revolutionizing the digital landscape, offering cutting-edge solutions tailored to individuals, startups, enterprises, and organizations.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const theme = cookieStore.get("theme");
  const defaultMode = theme?.value === "dark" ? "dark" : "light";

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
        <Suspense>
          <RefineKbarProvider>
            <AntdRegistry>
              <ClientProvider>
                <ColorModeContextProvider defaultMode={defaultMode}>
                  {/* <DevtoolsProvider> */}
                  <Refine
                    routerProvider={routerProvider}
                    // dataProvider={dataProvider}
                    dataProvider={dataProvider}
                    notificationProvider={useNotificationProvider}
                    authProvider={authProvider}
                    resources={[
                      {
                        name: "dashboard",
                        list: "/dashboard",
                        icon: <GrDashboard />,
                      },
                      {
                        name: "posts",
                        list: "/dashboard/blog-posts",
                        create: "/dashboard/blog-posts/create",
                        edit: "/dashboard/blog-posts/edit/:id",
                        show: "/dashboard/blog-posts/show/:id",
                        meta: {
                          canDelete: true,
                        },
                        icon: <GrBlog />,
                      },
                      {
                        name: "settings",
                        meta: {
                          canDelete: true,
                          label: "Settings",
                        },
                      },
                      {
                        name: "categories",
                        list: "/dashboard/categories",
                        create: "/dashboard/categories/create",
                        edit: "/dashboard/categories/edit/:id",
                        show: "/dashboard/categories/show/:id",
                        icon: <TbCategoryPlus />,
                        parentName: "settings",
                        meta: {
                          canDelete: true,
                          parent: "settings",
                        },
                      },
                      {
                        name: "tags",
                        list: "/dashboard/tags",
                        create: "/dashboard/tags/create",
                        edit: "/dashboard/tags/edit/:id",
                        show: "/dashboard/tags/show/:id",
                        parentName: "settings",
                        meta: {
                          canDelete: true,
                          parent: "settings",
                        },
                        icon: <FiTag />,
                      },
                      {
                        name: "banners",
                        list: "/dashboard/banners",
                        create: "/dashboard/banners/create",
                        edit: "/dashboard/banners/edit/:id",
                        show: "/dashboard/banners/show/:id",
                        parentName: "settings",
                        meta: {
                          canDelete: true,
                          parent: "settings",
                        },
                        icon: <FcEditImage />,
                      },
                      {
                        name: "media",
                        list: "/dashboard/media",
                        create: "/dashboard/media/create",
                        edit: "/dashboard/media/edit/:id",
                        show: "/dashboard/media/show/:id",
                        parentName: "settings",
                        meta: {
                          canDelete: true,
                          parent: "settings",
                        },
                        icon: <MdBrowseGallery />,
                      },
                      {
                        name: "events",
                        list: "/dashboard/events",
                        create: "/dashboard/events/create",
                        edit: "/dashboard/events/edit/:id",
                        show: "/dashboard/events/show/:id",
                        meta: {
                          canDelete: true,
                        },
                        icon: <SlEvent />,
                      },
                      {
                        name: "services",
                        list: "/dashboard/services",
                        create: "/dashboard/services/create",
                        edit: "/dashboard/services/edit/:id",
                        show: "/dashboard/services/show/:id",
                        meta: {
                          canDelete: true,
                        },
                        icon: <GrServices />,
                      },
                      {
                        name: "projects",
                        list: "/dashboard/projects",
                        create: "/dashboard/projects/create",
                        edit: "/dashboard/projects/edit/:id",
                        show: "/dashboard/projects/show/:id",
                        meta: {
                          canDelete: true,
                        },
                        icon: <AiOutlineFundProjectionScreen />,
                      },
                      {
                        name: "users",
                        list: "/dashboard/users",
                        create: "/dashboard/users/create",
                        edit: "/dashboard/users/edit/:id",
                        show: "/dashboard/users/show/:id",
                        meta: {
                          canDelete: true,
                        },
                        icon: <IoSchoolOutline />,
                      },

                      {
                        name: "opportunities",
                        list: "/dashboard/opportunities",
                        create: "/dashboard/opportunities/create",
                        edit: "/dashboard/opportunities/edit/:id",
                        show: "/dashboard/opportunities/show/:id",
                        meta: {
                          canDelete: true,
                        },
                        icon: <FiGlobe />,
                      },
                      {
                        name: "LMS",
                        meta: {
                          canDelete: true,
                          label: "lms",
                        },
                      },
                      {
                        name: "courses",
                        list: "/dashboard/courses",
                        create: "/dashboard/courses/create",
                        edit: "/dashboard/courses/edit/:id",
                        show: "/dashboard/courses/show/:id",
                        parentName: "lms",
                        meta: {
                          canDelete: true,
                          parent: "lms",
                        },
                        icon: <FiBook />,
                      },
                      {
                        name: "lessons",
                        list: "/dashboard/lessons",
                        create: "/dashboard/lessons/create",
                        edit: "/dashboard/lessons/edit/:id",
                        show: "/dashboard/lessons/show/:id",
                        parentName: "lms",
                        meta: {
                          canDelete: true,
                          parent: "lms",
                        },
                        icon: <FiPaperclip />,
                      },
                      {
                        name: "quizes",
                        list: "/dashboard/quizes",
                        create: "/dashboard/quizes/create",
                        edit: "/dashboard/quizes/edit/:id",
                        show: "/dashboard/quizes/show/:id",
                        parentName: "lms",
                        meta: {
                          canDelete: true,
                          parent: "lms",
                        },
                        icon: <FaCircleQuestion />,
                      },
                      {
                        name: "enrollments",
                        list: "/dashboard/enrollments",
                        create: "/dashboard/enrollments/create",
                        edit: "/dashboard/enrollments/edit/:id",
                        show: "/dashboard/enrollments/show/:id",
                        parentName: "lms",
                        meta: {
                          canDelete: true,
                          parent: "lms",
                        },
                        icon: <FaFireExtinguisher />,
                      },
                    ]}
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
                  {/* </DevtoolsProvider> */}
                </ColorModeContextProvider>
              </ClientProvider>
            </AntdRegistry>
          </RefineKbarProvider>
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
