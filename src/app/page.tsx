"use client";

import { Button, Card, Space } from "antd";
import { Suspense } from "react";
import { MdLightbulbOutline } from "react-icons/md";
import { IoMedalOutline, IoPeopleOutline } from "react-icons/io5";
import { PiTargetDuotone } from "react-icons/pi";
import { AppFooter } from "@components/footer/footer";
import { AppFootnote } from "@components/footnote/footnote";
import { Subscribe } from "@components/subscribe/subscribe";
import { GrUserExpert } from "react-icons/gr";
import FeatureSection from "@components/feature-section/feature-section";
// import { Authenticated } from "@refinedev/core";
// import { NavigateToResource } from "@refinedev/nextjs-router";

export default function IndexPage() {
  return (
    <Suspense>
      {/* <Authenticated key="home-page">
        <NavigateToResource />
      </Authenticated> */}
      {/* landing page */}
      <div
        className="container-fluid mx-auto mt-3"
        style={{ width: "90%" }}
        // minHeight: "50rem",
      >
        <nav className="navbar bg-white navbar-expand-lg">
          <div className="container-fluid">
            <a
              className="navbar-brand fw-bold"
              style={{ color: "#00BFFF" }}
              href="/landing-page-1"
            >
              Cumi
            </a>
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
                  className="text-white"
                  shape="round"
                  style={{ backgroundColor: "#00BFFF" }}
                  href="/login"
                >
                  Log in
                </Button>
                {/* <Button
                  className="border mt-sm-2 mt-md-0 ms-2"
                  shape="round"
                  type="primary"
                  href="/register"
                >
                  Register
                </Button> */}
              </div>
            </div>
          </div>
        </nav>
        <div
          className="mx-auto row"
          style={{ marginTop: "6rem", width: "90%", minHeight: "23rem" }}
        >
          <div className="col-12 d-flex flex-column col-md-5">
            <h1 style={{ color: "darkslategray" }}>
              Welcome to Cumi - Empowering Your Digital Journey
            </h1>
            <p className="text-wrap">
              We're committed to revolutionizing the digital landscape, offering
              cutting-edge solutions tailored to individuals, startups,
              enterprises, and organizations.
            </p>
            <div className="mt-3">
              <Space>
                <Button
                  className="text-white"
                  shape="round"
                  style={{ background: "#00BFFF" }}
                  href="/contact-us"
                >
                  Hire our services
                </Button>
                <Button href="/about#mission" className="fw-bold" shape="round">
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
      {/* feature section */}
      <FeatureSection />

      {/* why us */}
      <div id="about" className="block mt-sm-0 py-5">
        <div className="titleHolder">
          <h2>Why Choose Cumi?</h2>
          <p>
            Together let's collaborate to turn your vision into reality and
            shape the future of technology together.
          </p>
        </div>
        {/* next */}
        <div
          className="mx-auto  row"
          style={{ width: "85%", minHeight: "15rem" }}
        >
          <div className="col-sm-6 col-lg-3 p-3">
            <Card
              bordered={false}
              hoverable
              className="shadow d-flex flex-column align-items-center justify-content-center"
            >
              <p className="fw-bold text-center">Expertise</p>
              <GrUserExpert
                className="mx-auto d-block"
                style={{
                  width: "3rem",
                  height: "3rem",
                  color: "darkslategray",
                }}
              />
              <small className="d-block text-center">
                Our team comprises professionals with extensive experience in
                software development and technology consulting. We leverage our
                expertise to deliver.
              </small>
            </Card>
          </div>

          <div className="col-sm-6 col-lg-3 p-3">
            <Card
              bordered={false}
              hoverable
              className="shadow d-flex flex-column align-items-center justify-content-center"
            >
              <p className="fw-bold text-center">Innovation</p>
              <MdLightbulbOutline
                className="mx-auto d-block"
                style={{ width: "3rem", height: "3rem", color: "#FFDF00" }}
              />

              <small className="d-block text-center">
                We're constantly exploring new technologies and methodologies to
                stay ahead of the curve and deliver cutting-edge solutions that
                drive business growth.
              </small>
            </Card>
          </div>

          <div className="col-sm-6 col-lg-3 p-3">
            <Card
              bordered={false}
              hoverable
              className="shadow d-flex flex-column align-items-center justify-content-center"
            >
              <p className="fw-bold text-center">Collaboration</p>
              <IoPeopleOutline
                className="mx-auto d-block"
                style={{ width: "3rem", height: "3rem", color: "#00BFFF" }}
              />
              <small className="d-block text-center">
                We work closely with our clients, fostering open communication
                and collaboration every step of the way to ensure that we're
                aligned with their goals and objectives.
              </small>
            </Card>
          </div>

          <div className="col-sm-6 col-lg-3 p-3">
            <Card
              bordered={false}
              hoverable
              className="shadow d-flex flex-column align-items-center justify-content-center"
            >
              <p className="fw-bold text-center">Commitment to Excellence</p>
              <IoMedalOutline
                className="mx-auto d-block"
                style={{ width: "3rem", height: "3rem", color: "#32CD32" }}
              />
              <small className="d-block text-center">
                From the quality of our work to the level of service we provide,
                we strive for nothing less than perfection to ensure the success
                of our clients.
              </small>
            </Card>
          </div>
        </div>
      </div>

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
            className="text-white mt-3 mx-auto"
            href="/contact-us"
            style={{
              background: "darkslategray",
              borderColor: "#362F2A",
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

      <Subscribe />
      <AppFooter />
      <AppFootnote />
    </Suspense>
  );
}
