"use client";
import { Button } from "antd";
import Image from "next/image";
import React from "react";

export const AppService = () => {
  return (
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
          {` Reach out to us today to learn more about our services and training
          programs.`}
          {/* ${
            width > 767 &&
            "Let's collaborate to turn your vision into reality and shape the future of technology together."
          } */}
        </p>
        <Button
          className="primary-btn mt-3 mx-auto"
          href="/contact-us"
          size="large"
          style={{
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
        <Image
          height={500}
          width={1200}
          quality={100}
          src={"/two-business-woman-cafe.jpg"}
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
  );
};
