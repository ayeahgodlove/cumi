import { Avatar, Breadcrumb, Typography } from "antd";
import Link from "next/link";
import React from "react";
import "./banner.scss";
import { API_URL } from "@constants/api-url";

interface IBreadcrumb {
  label: string;
  uri: string;
}
type Props = {
  pageTitle: string;
  breadcrumbs: IBreadcrumb[];
};
const BannerComponent: React.FC<Props> = ({ pageTitle, breadcrumbs }) => {
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
              ...breadcrumbs.map((b, index) => {
                return {
                  title: (
                    <Link
                      href={`/${b.uri}`}
                      key={index}
                      className="text-capitalize"
                    >
                      {b.label}
                    </Link>
                  ),
                };
              }),
            ]}
          />
        </div>
        <div className="banner-theme">
          <Avatar
            className="position-absolute top-0 start-0 top-circle"
            size={50}
            src={`${API_URL}/img/banner/ellipse-3.png`}
          />
          <Avatar
            className="position-absolute top-0 end-0 top-circle"
            size={50}
            src={`${API_URL}/img/banner/ellipse-4.png`}
          />
          <Avatar
            className="position-absolute top-50 start-50 top-circle"
            size={25}
            src={`${API_URL}/img/banner/round.png`}
          />
          <Avatar
            className="position-absolute bottom-50 end-50 top-circle"
            size={25}
            src={`${API_URL}/img/banner/round2.png`}
          />
          {/*  */}
          <Avatar
            className="position-absolute top-50 start-50 translate-middle-y top-circle"
            size={25}
            src={`${API_URL}/img/banner/circle.png`}
          />
          <Avatar
            className="position-absolute bottom-50 end-50 translate-middle-x top-circle"
            size={25}
            src={`${API_URL}/img/banner/circle.png`}
          />
          {/*  */}
          <Avatar
            className="position-absolute bottom-0 start-0 bottom-circle"
            size={70}
            src={`${API_URL}/img/banner/ellipse-1.png`}
          />
          <Avatar
            className="position-absolute bottom-0 end-0 bottom-circle"
            size={70}
            src={`${API_URL}/img/banner/ellipse-2.png`}
          />
        </div>
      </div>
    </>
  );
};

export default BannerComponent;
