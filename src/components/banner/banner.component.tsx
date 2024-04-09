import { Breadcrumb, Typography } from "antd";
import Link from "next/link";
import React from "react";

const BannerComponent = () => {
  return (
    <>
      <div className="container mx-auto px-3">
        <div
          className="flex flex-column align-items-center justify-content-center text-center"
          style={{
            paddingTop: "120px",
            paddingBottom: "120px",
            position: "relative",
          }}
        >
          <Typography.Title level={1}>Blog Posts</Typography.Title>
          <Breadcrumb
            style={{ display: "flex", justifyContent: "center" }}
            items={[
              {
                title: <Link href="/">Home</Link>,
              },
              {
                title: "Blog Posts",
              },
            ]}
          />
        </div>
        <div className="banner-theme">
    
        </div>
      </div>
    </>
  );
};

export default BannerComponent;
