import React from "react";

import { Breadcrumb, Col, Row } from "antd";
import Link from "next/link";
import { API_URL_UPLOADS_MEDIA } from "@constants/api-url";

export default function PageContent(props: any) {
  const { title, breadcrumb, desc, banner } = props;

  return (
    <Col
      span={24}
      className="bg-dark p-5 overflow-hidden d-flex justify-content-center"
      style={{
        borderRadius: 32,
        backgroundImage: `url('${API_URL_UPLOADS_MEDIA}/${banner}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Row justify={"center"}>
        {title && (
          <Col span={24}>
            <h1 className="mt-3 text-light text-capitalize">{title}</h1>
          </Col>
        )}

        {breadcrumb && (
          <Col span={24} className="mb-3">
            <Breadcrumb
              className="d-flex flex-wrap mt-4"
              items={[
                {
                  title: (
                    <Link href={"/"} className="text-white">
                      Home
                    </Link>
                  ),
                },
                ...breadcrumb.map((item: any) => {
                  return {
                    title: (
                      <Link
                        href={item.link ? item.link : "#"}
                        className={`${
                          item.link ? " text-white" : "text-warning"
                        }`}
                      >
                        {item.title}
                      </Link>
                    ),
                  };
                }),
              ]}
            />
          </Col>
        )}

        {desc && (
          <Col span={24}>
            <p className="h5 mt-5 text-dark">{desc}</p>
          </Col>
        )}
      </Row>
    </Col>
  );
}
