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
import {
  generatePageMetadata,
  generateStructuredData,
  defaultImages,
} from "../lib/seo";
import Script from "next/script";

export const metadata: Metadata = generatePageMetadata({
  title: "CUMI - Leading Software Development & Digital Solutions Company",
  description:
    "Transform your business with CUMI's cutting-edge software development, web applications, mobile apps, and digital solutions. Expert team delivering innovative technology solutions for startups to enterprises.",
  keywords: [
    "software development company",
    "web development services",
    "mobile app development",
    "digital transformation",
    "custom software solutions",
    "technology consulting",
    "full-stack development",
    "cloud solutions",
    "API development",
    "database design",
    "user experience design",
    "responsive web design",
    "e-commerce development",
    "content management systems",
    "progressive web apps",
    "business automation",
    "IT consulting services",
  ],
  url: "https://cumi.dev",
  image: defaultImages[0],
  images: defaultImages.map((img) => ({
    url: img,
    width: 1200,
    height: 630,
    alt: "CUMI - Software Development & Digital Solutions",
  })),
  openGraph: {
    type: "website",
    title: "CUMI - Leading Software Development & Digital Solutions",
    description:
      "Transform your business with CUMI's cutting-edge software development, web applications, mobile apps, and digital solutions.",
    images: defaultImages,
    siteName: "CUMI",
    locale: "en_US",
    url: "https://cumi.dev",
  },
  twitter: {
    card: "summary_large_image",
    title: "CUMI - Software Development & Digital Solutions",
    description:
      "Transform your business with CUMI's cutting-edge software development and digital solutions.",
    images: defaultImages,
    creator: "@cumi_dev",
  },
  schema: generateStructuredData("organization", {}),
});

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
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* SEO metadata */}
        <meta name="robots" content="index, follow" />
        <meta name="theme-color" content="#15b9a1" />
        <meta
          name="google-site-verification"
          content="EwAFsxtAXhVOAGglKgaihgaEa3YiI9yB7cOzQc4qBw4"
        />
        {/* Apple Touch Icons */}
        <link
          rel="apple-touch-icon"
          sizes="57x57"
          href="/apple-icon-57x57.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="60x60"
          href="/apple-icon-60x60.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="72x72"
          href="/apple-icon-72x72.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href="/apple-icon-76x76.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="114x114"
          href="/apple-icon-114x114.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href="/apple-icon-120x120.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href="/apple-icon-144x144.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/apple-icon-152x152.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-icon-180x180.png"
        />

        {/* Standard Icons */}
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/android-icon-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="/favicon-96x96.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />

        {/* Manifest and Theme */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN"
          crossOrigin="anonymous"
        />
        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-N98JPQ8F');
        `}
        </Script>
      </head>
      <body cz-shortcut-listen="false">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-N98JPQ8F"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
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
