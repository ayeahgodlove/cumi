"use client";

import { Suspense } from "react";

import { AppFooter } from "@components/footer/footer";
import { AppFootnote } from "@components/footnote/footnote";

import FeatureSection from "@components/feature-section/feature-section";
import AboutNote from "@components/about-note/about-note";
import { AppNav } from "@components/nav/nav.component";
import { AppHero } from "@components/hero/hero.component";
import { AppService } from "@components/service/service.component";
import { Spin } from "antd";

export default function IndexPage() {
  return (
    <Suspense
      fallback={
        <Spin
          size="large"
          style={{
            minHeight: "65vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        />
      }
    >
      <div className="container-fluid mt-3" style={{ width: "100%" }}>
        {/* navigation bar */}
        <AppNav logoPath="/" />

        {/* hero section */}
        <AppHero />
      </div>

      {/* why us */}
      <AboutNote />

      {/* feature section */}
      <FeatureSection />

      {/* service section */}
      <AppService />

      <AppFooter logoPath="/" />
      <AppFootnote />
    </Suspense>
  );
}
