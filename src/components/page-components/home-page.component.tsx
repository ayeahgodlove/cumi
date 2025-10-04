"use client";
import { AppFooter } from "@components/footer/footer";
import { AppFootnote } from "@components/footnote/footnote";
import FeatureSection from "@components/feature-section/feature-section";
import AboutNote from "@components/about-note/about-note";
import { AppNav } from "@components/nav/nav.component";
import { AppHero } from "@components/hero/hero.component";
import { AppService } from "@components/service/service.component";
import { PartnersSection } from "@components/partners/partners-section.component";
import { ServicesSection } from "@components/services/services-section.component";

export default function HomePageComponent() {
  return (
    <>
      <div className="container-fluid" style={{ width: "100%" }}>
        <AppNav logoPath="/" />
        <AppHero />
      </div>
      <AboutNote />
      <FeatureSection />
      <ServicesSection showViewAllButton={true} showContainer={true} />
      <AppService />
      <PartnersSection />
      <AppFooter logoPath="/" />
      <AppFootnote />
    </>
  );
}
