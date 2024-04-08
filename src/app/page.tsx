"use client";

import { Button, Space } from "antd";
import { Suspense } from "react";

import { AppFooter } from "@components/footer/footer";
import { AppFootnote } from "@components/footnote/footnote";

import FeatureSection from "@components/feature-section/feature-section";
import AboutNote from "@components/about-note/about-note";

export default function IndexPage() {
  return (
    <Suspense>
      <div
        className="container-fluid mx-auto mt-3"
        style={{ width: "90%" }}
        // minHeight: "50rem",
      >
        <nav className="navbar bg-white navbar-expand-lg">
          <div className="container-fluid">
            <img
              src="./cumi-green.jpeg"
              height={50}
              width={100}
              alt="Cumi logo"
            />
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <a
                    className="nav-link active"
                    aria-current="page"
                    href="/landing-page-1"
                  >
                    Home
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/our_services">
                    Services
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/blog_posts">
                    Blog Posts
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" aria-disabled="true" href="/about_us">
                    About Us
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    aria-disabled="true"
                    href="/contact_us"
                  >
                    Contact Us
                  </a>
                </li>
              </ul>
              <div className="d-flex flex-sm-column flex-md-row">
                <Button
                  className="primary-btn"
                  shape="round"
                  style={{ backgroundColor: "#00BFFF" }}
                  href="/login"
                  size="large"
                >
                  Log in
                </Button>
              </div>
            </div>
          </div>
        </nav>
        <div
          className="mx-auto row"
          style={{ marginTop: "6rem", width: "90%", minHeight: "23rem" }}
        >
          <div className="col-12 d-flex flex-column col-md-5">
            <h1 className="gradient-title">Empowering Your Digital Journey</h1>
            <p className="text-wrap">
              We're committed to revolutionizing the digital landscape, offering
              cutting-edge solutions tailored to individuals, startups,
              enterprises, and organizations.
            </p>
            <div className="mt-3">
              <Space>
                <Button
                  className="primary-btn shadow-sm"
                  shape="round"
                  href="/contact-us"
                  size="large"
                >
                  Hire our services
                </Button>
                <Button
                  size="large"
                  href="/about#mission"
                  className="default-btn fw-bold"
                  shape="round"
                >
                  Our Mission
                </Button>
              </Space>
            </div>
          </div>
          <div className="d-sm-none ms-auto d-md-inline col-md-6">
            <img
              src={"./undraw_software_engineer_re_tnjc.svg"}
              alt="Software engineering"
              style={{ width: "100%", height: "20rem" }}
            />
          </div>
        </div>
      </div>

      {/* why us */}
      <AboutNote />

      {/* feature section */}
      <FeatureSection />

      {/* next */}
      <div
        id="work-with-us"
        className="container-fluid mx-auto rounded p-0 bg-light row"
        style={{ minHeight: "20rem" }}
      >
        <div
          className="col-5 p-3 p-lg-5 bg-light d-flex flex-column justify-content-center align-items"
          style={{
            borderTopLeftRadius: "1rem",
            borderBottomLeftRadius: "1rem",
          }}
        >
          <h3 className="text-center mb-4">Ready to work with Cumi?</h3>
          <p className="text-center">
            Reach out to us today to learn more about our services and training
            programs. Let's collaborate to turn your vision into reality and
            shape the future of technology together.
          </p>
          <Button
            className="primary-btn mt-3 mx-auto"
            href="/contact-us"
            size="large"
            style={{
              // background: "darkslategray",
              // borderColor: "#362F2A",
              width: "10rem",
            }}
            shape="round"
          >
            Get In Touch
          </Button>
        </div>
        <div
          className="col-6 p-0 ms-auto"
          style={{
            borderRadius: "7rem",
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
          }}
        >
          <img
            src={"./two-business-woman-cafe.jpg"}
            style={{
              width: "100%",
              height: "20rem",
              objectFit: "cover",
              borderTopLeftRadius: "7rem",
              borderBottomLeftRadius: "7rem",
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
            }}
            alt="drinking"
          />
        </div>
      </div>

      <AppFooter />
      <AppFootnote />
    </Suspense>
  );
}
