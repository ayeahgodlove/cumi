import { Metadata } from "next";
import { cookies } from "next/headers";
import React, { Suspense } from "react";
import { NextIntlClientProvider } from "next-intl";
import "../styles/app.scss";
import "../styles/home.scss";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { RefineContext } from "@contexts/refine-context";
import { getLocale, getMessages } from "next-intl/server";

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
  const cookieStore = cookies();
  const theme = cookieStore.get("theme");
  const defaultMode = theme?.value === "dark" ? "dark" : "light";

  const locale = await getLocale();
  const messages = await getMessages();

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
          <NextIntlClientProvider locale={locale} messages={messages}>
            <RefineContext defaultMode={defaultMode}>{children}</RefineContext>
          </NextIntlClientProvider>
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
