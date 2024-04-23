import { Avatar, Breadcrumb, Typography } from "antd";
import Link from "next/link";
import React from "react";
import "./banner.scss";
import { API_URL_UPLOADS_BANNERS } from "@constants/api-url";

type Props = {
  page: { title: string; path: string }[];
  banner: { imageUrl: string | undefined; title: string | undefined };
};
const BannerDetailComponent: React.FC<Props> = ({ page, banner }) => {
  return (
    <>
      <div
        className="container-fluid mx-auto position-relative custom__banner"
        style={{
          backgroundImage: `url('${API_URL_UPLOADS_BANNERS}/${banner.imageUrl}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className="flex flex-column align-items-center justify-content-center text-center"
          style={{
            paddingTop: "120px",
            paddingBottom: "120px",
            position: "relative",
            color: "#f4f4f4",
          }}
        >
          <Typography.Title level={1} style={{ color: "#f3f3f3" }}>
            {banner.title}
          </Typography.Title>
          <Breadcrumb
            style={{
              display: "flex",
              justifyContent: "center",
              color: "#f4f4f4",
            }}
            items={[
              {
                title: (
                  <Link href="/" className="text-secondary">
                    Home
                  </Link>
                ),
              },
              {
                title: (
                  <Link href={`${page[0].path}`} className="text-secondary">
                    {page[0].title}
                  </Link>
                ),
              },
              {
                title: `${page[1].title}`,
                className: "text-light",
              },
            ]}
          />
        </div>
        <div className="banner-theme">
          <Avatar
            className="position-absolute top-0 start-0 top-circle"
            size={50}
            src={"./../img/banner/ellipse-3.png"}
          />
          <Avatar
            className="position-absolute top-0 end-0 top-circle"
            size={50}
            src={"./../img/banner/ellipse-4.png"}
          />
          <Avatar
            className="position-absolute top-50 start-50 top-circle"
            size={25}
            src={"./../img/banner/round.png"}
          />
          <Avatar
            className="position-absolute bottom-50 end-50 top-circle"
            size={25}
            src={"./../img/banner/round2.png"}
          />
          {/*  */}
          <Avatar
            className="position-absolute top-50 start-50 translate-middle-y top-circle"
            size={25}
            src={"./../img/banner/circle.png"}
          />
          <Avatar
            className="position-absolute bottom-50 end-50 translate-middle-x top-circle"
            size={25}
            src={"./../img/banner/circle.png"}
          />
          {/*  */}
          <Avatar
            className="position-absolute bottom-0 start-0 bottom-circle"
            size={70}
            src={"./../img/banner/ellipse-1.png"}
          />
          <Avatar
            className="position-absolute bottom-0 end-0 bottom-circle"
            size={70}
            src={"./../img/banner/ellipse-2.png"}
          />
        </div>
      </div>
    </>
  );
};

export default BannerDetailComponent;
