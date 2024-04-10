import { Avatar, Breadcrumb, Typography } from "antd";
import Link from "next/link";
import React from "react";
import "./banner.scss";

type Props = {
  pageTitle: string;
};
const BannerComponent: React.FC<Props> = ({ pageTitle }) => {
  return (
    <>
      <div className="container-fluid mx-auto px-3 position-relative custom__banner">
        <div
          className="flex flex-column align-items-center justify-content-center text-center"
          style={{
            paddingTop: "120px",
            paddingBottom: "120px",
            position: "relative",
          }}
        >
          <Typography.Title level={1}>{pageTitle}</Typography.Title>
          <Breadcrumb
            style={{ display: "flex", justifyContent: "center" }}
            items={[
              {
                title: <Link href="/">Home</Link>,
              },
              {
                title: `${pageTitle}`,
              },
            ]}
          />
        </div>
        <div className="banner-theme">
          <Avatar
            className="position-absolute top-0 start-0 top-circle"
            size={50}
            src={"./img/banner/ellipse-3.png"}
          />
          <Avatar
            className="position-absolute top-0 end-0 top-circle"
            size={50}
            src={"./img/banner/ellipse-4.png"}
          />
          <Avatar
            className="position-absolute top-50 start-50 top-circle"
            size={25}
            src={"./img/banner/round.png"}
          />
          <Avatar
            className="position-absolute bottom-50 end-50 top-circle"
            size={25}
            src={"./img/banner/round2.png"}
          />
          {/*  */}
          <Avatar
            className="position-absolute top-50 start-50 translate-middle-y top-circle"
            size={25}
            src={"./img/banner/circle.png"}
          />
          <Avatar
            className="position-absolute bottom-50 end-50 translate-middle-x top-circle"
            size={25}
            src={"./img/banner/circle.png"}
          />
          {/*  */}
          <Avatar
            className="position-absolute bottom-0 start-0 bottom-circle"
            size={70}
            src={"./img/banner/ellipse-1.png"}
          />
          <Avatar
            className="position-absolute bottom-0 end-0 bottom-circle"
            size={70}
            src={"./img/banner/ellipse-2.png"}
          />
        </div>
      </div>
    </>
  );
};

export default BannerComponent;
