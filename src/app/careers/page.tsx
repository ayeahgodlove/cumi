"use client";
import BannerComponent from "@components/banner/banner.component";
import CareerCard from "@components/career/career-card.component";
import { AppFooter } from "@components/footer/footer";
import { AppFootnote } from "@components/footnote/footnote";
import { AppNav } from "@components/nav/nav.component";
import SpinnerList from "@components/shared/spinner-list";
import { opportunityAPI } from "@store/api/opportunity_api";
import { Col, Empty, Layout } from "antd";
import { motion } from "framer-motion";
import { Suspense } from "react";

const { Content } = Layout;
export default function IndexPage() {
  const {
    data: opportunities,
    error,
    isLoading,
    isFetching,
  } = opportunityAPI.useFetchAllOpportunitiesQuery();

  return (
    <Suspense>
      <div className="container-fluid mt-3" style={{ width: "100%" }}>
        {/* navigation bar */}
        <AppNav logoPath="/" />
      </div>
      {/* banner */}
      <BannerComponent
        breadcrumbs={[{ label: "Careers", uri: "careers" }]}
        pageTitle="Careers & Opportunities"
      />

      <div className="container mb-5">
        {error && <h1>Something wrong...</h1>}

        <Content>
          {(isLoading || isFetching) && (
            <motion.div
              className="box"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <SpinnerList />
            </motion.div>
          )}
          {opportunities && opportunities.length ? (
            <div className="row justify-content-center align-items-start">
              <CareerCard data={opportunities} />
            </div>
          ) : (
            <Col span={24}>
              <div className="empty-wrap">
                <Empty />
              </div>
            </Col>
          )}
        </Content>
      </div>
      <AppFooter logoPath="/" />
      <AppFootnote />
    </Suspense>
  );
}
