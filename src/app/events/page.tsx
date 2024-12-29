"use client";
import BannerComponent from "@components/banner/banner.component";
import EventCard from "@components/event/EventCard";
import { AppFooter } from "@components/footer/footer";
import { AppFootnote } from "@components/footnote/footnote";
import { AppNav } from "@components/nav/nav.component";
import SpinnerList from "@components/shared/spinner-list";
import { eventAPI } from "@store/api/event_api";
import { Col, Empty, Layout, Row, Spin } from "antd";
import { motion } from "framer-motion";
import { Suspense } from "react";

const { Content } = Layout;
export default function IndexPage() {
  const {
    data: events,
    isLoading: isLoadingEvent,
    isFetching: isFetchEvent,
  } = eventAPI.useFetchAllEventsQuery(1);

  return (
    <Suspense fallback={<Spin size="large" />}>
      <div className="container-fluid mt-3" style={{ width: "100%" }}>
        {/* navigation bar */}
        <AppNav logoPath="/" />
      </div>
      {/* banner */}
      <BannerComponent
        breadcrumbs={[{ label: "Events", uri: "events" }]}
        pageTitle="Events"
      />

      <Content className="container">
        {(isLoadingEvent || isFetchEvent) && (
          <motion.div
            className="box"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <SpinnerList />
          </motion.div>
        )}
        {events && events.length ? (
          <div className="row justify-content-center align-items-start">
            <div className="col-12 col-md-12">
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                {events?.map((event) => (
                  <Col
                    className="gutter-row"
                    xs={{ span: 24, offset: 0 }}
                    sm={{ span: 12, offset: 0 }}
                    lg={{ span: 8, offset: 0 }}
                    key={event.id}
                    style={{ marginBottom: 20 }}
                  >
                    <motion.div
                      className="box"
                      initial={{ opacity: 0, y: "-5%" }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <EventCard event={event} />
                    </motion.div>
                  </Col>
                ))}
              </Row>
            </div>
          </div>
        ) : (
          <Col span={24}>
            <div className="empty-wrap">
              <Empty />
            </div>
          </Col>
        )}
      </Content>

      <AppFooter logoPath="/" />
      <AppFootnote />
    </Suspense>
  );
}
