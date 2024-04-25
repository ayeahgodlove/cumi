"use client";
import React from "react";
import { Authenticated } from "@refinedev/core";
import { NavigateToResource } from "@refinedev/nextjs-router";
import FeatureCard from "@components/dashboard/feature-card.component";
import { Col, Row } from "antd";
import { TbUsersGroup } from "react-icons/tb";
import { GrArticle } from "react-icons/gr";
import { FcInvite } from "react-icons/fc";
import { SiGooglemessages } from "react-icons/si";
import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";

export default function IndexPage() {
  return (
    <div>
      <Col span={24}>
        <PageBreadCrumbs items={["Dashboard"]} />
        <Row gutter={[32, 32]}>
          <Col span={24}>
            <h3>Welcome back, Ayeah 👋</h3>
            <p className="mb-0">Your current status and analytics are here</p>
          </Col>

          <Col sm={8} md={6} span={24}>
            <FeatureCard
              icon={<TbUsersGroup size={24} />}
              title="Total Users"
              // titleIcon={<GrArticle size={24} fontWeight={"bold"} />}
              // date="April 2022"
              price="1,000"
            />
          </Col>

          <Col sm={8} md={6} span={24}>
            <FeatureCard
              icon={<GrArticle size={24} fontWeight={"bold"} />}
              title="Total Posts"
              // titleIcon={<SiGooglemessages />}
              // date="April 2022"
              price="05"
            />
          </Col>
          <Col sm={8} md={6} span={24}>
            <FeatureCard
              icon={<FcInvite size={24} fontWeight={"bold"} />}
              title="Total Events"
              // titleIcon={<SiGooglemessages />}
              // date="April 2022"
              price="05"
            />
          </Col>
          <Col sm={8} md={6} span={24}>
            <FeatureCard
              icon={<SiGooglemessages size={24} fontWeight={"bold"} />}
              title="Total Mails"
              // titleIcon={<SiGooglemessages />}
              // date="April 2022"
              price="05"
            />
          </Col>
        </Row>
      </Col>

      <Authenticated key="home-page">
        <NavigateToResource />
      </Authenticated>
    </div>
  );
}
