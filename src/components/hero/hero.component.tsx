"use client";

import React from "react";
import { Button, Space } from "antd";
import useWindowSize from "@hooks/windows-resize/window-resize.hook";
import Image from "next/image";

export const AppHero = () => {
  const { width } = useWindowSize()
  return (
    <div
      className="mx-auto row align-items-center"
      style={{ marginTop: "4rem", width: "90%", minHeight: "23rem" }}
    >
      <div className="col-12 d-flex flex-column col-md-5">
        <h1 className="gradient-title">Empowering Your Digital Journey</h1>
        <p className="text-wrap">
         {` We're committed to revolutionizing the digital landscape, offering
          cutting-edge solutions tailored to individuals, startups, enterprises,
          and organizations.`}
        </p>
        <div className="mt-3">
          <Space>
            <Button
              className="primary-btn shadow-sm"
              shape="round"
              href="/our_services"
              size="large"
            >
              Hire our services
            </Button>
            <Button
              size="large"
              href="/about_us"
              className="default-btn fw-bold"
              shape="round"
            >
              Our Mission
            </Button>
          </Space>
        </div>
      </div>
      <div className="d-sm-none ms-auto d-md-inline col-md-6" style={{ marginTop: width < 767 ? 40 : 0 }}>
        <Image
          src={"/img/IMG_4491-min.jpeg"}
          alt="Software engineering"
          height={500}
          width={1200}
          quality={100}
          style={{
            width: "100%",
            height: "23rem",
            borderRadius: 50,
            objectFit: "cover",
            border: "6px solid #54c6aa",
          }}
        />
      </div>
    </div>
  );
};
