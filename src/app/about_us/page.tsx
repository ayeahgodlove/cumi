"use client";
import { Suspense } from "react";
import { AppNav } from "@components/nav/nav.component";
import BannerComponent from "@components/banner/banner.component";
import { Typography, Row, Col, Card, Button, Divider } from "antd";
import { RocketOutlined, CodeOutlined } from "@ant-design/icons";
import { AppFooter } from "@components/footer/footer";
import { AppFootnote } from "@components/footnote/footnote";
import styles from "./about-page.module.css";
import YouTubePlayerFrame from "@components/shared/youtube.component";

const { Title, Paragraph } = Typography;

export default function AboutPage() {
  return (
    <Suspense>
      <div className="container-fluid mt-3" style={{ width: "100%" }}>
        <AppNav logoPath="/" />
      </div>

      <BannerComponent
        breadcrumbs={[{ label: "About Us", uri: "about_us" }]}
        pageTitle="About Us"
        // description="We're committed to revolutionizing the digital landscape, offering cutting-edge solutions tailored to individuals, startups, enterprises, and organizations."
      />

      <div className="container py-5">
        {/* What We Offer */}
        {/* Optional Vision Section */}
        <section className="my-5 text-center">
          <Title level={2} className={styles.sectionTitle}>
            Our Vision
          </Title>
          <Paragraph className="text-muted">
            We envision a digital world where innovation is accessible to
            everyone—where businesses and individuals thrive using cutting-edge
            technology and skills.
          </Paragraph>
        </section>

        {/* Call to Action */}
        <section className="text-center my-5">
          <Title level={3} className="mb-3">
            Ready to innovate with us?
          </Title>
          <Button
            size="large"
            type="primary"
            href="https://wa.me/237681289411"
            target="_blank"
          >
            Let&apos;s Build Together
          </Button>
        </section>
        <div className={`my-4 ${styles.screenshotBox}`}>
          <YouTubePlayerFrame
            videoId="Y5Hu_UZ93bc"
            title="RISE UP - Jordan Peterson | Powerful Motivational Speech"
            channel="INSPIRED NATION"
            views="968K views"
            uploadDate="2 years ago"
            description="Jordan Peterson, professor of psychology, clinical psychologist, author and YouTube personality, shares why you need to discipline yourself, pursue meaning not happiness and don't waste your life."
          />
        </div>
      </div>

      <AppFooter logoPath="/" />
      <AppFootnote />
    </Suspense>
  );
}
