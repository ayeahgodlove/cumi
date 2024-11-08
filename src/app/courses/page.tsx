"use client";
import BannerComponent from "@components/banner/banner.component";
import { AppFooter } from "@components/footer/footer";
import { AppFootnote } from "@components/footnote/footnote";
import { AppNav } from "@components/nav/nav.component";
import { Suspense } from "react";

export default function IndexPage() {
  return (
    <Suspense>
      <div className="container-fluid mt-3" style={{ width: "100%" }}>
        {/* navigation bar */}
        <AppNav logoPath="/" />
      </div>

      {/* banner */}
      <BannerComponent
        breadcrumbs={[{ label: "Courses", uri: "courses" }]}
        pageTitle="Courses"
      />

      <AppFooter logoPath="/" />
      <AppFootnote />
    </Suspense>
  );
}
