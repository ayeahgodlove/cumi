"use client";
import BannerComponent from "@components/banner/banner.component";
import { AppFooter } from "@components/footer/footer";
import { AppFootnote } from "@components/footnote/footnote";
import { AppNav } from "@components/nav/nav.component";
import ProjectCard from "@components/project/ProjectCard";
import SpinnerList from "@components/shared/spinner-list";
import { projectAPI } from "@store/api/project_api";
import { Col, Empty, Layout, Row } from "antd";
import { motion } from "framer-motion";
import { Suspense } from "react";

const { Content } = Layout;

export default function IndexPage() {
  const {
    data: projects,
    isLoading: isLoadingEvent,
    isFetching: isFetchEvent,
  } = projectAPI.useFetchAllProjectsQuery(1);

  return (
    <Suspense>
      <div className="container-fluid mt-3" style={{ width: "100%" }}>
        {/* navigation bar */}
        <AppNav logoPath="/" />
      </div>
      {/* banner */}
      <BannerComponent
        breadcrumbs={[{ label: "Projects", uri: "projects" }]}
        pageTitle="Projects"
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
        {projects && projects.length ? (
          <div className="row justify-content-center align-items-start">
            <div className="col-12 col-md-12">
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                {projects?.map((project) => (
                  <Col
                    className="gutter-row"
                    xs={{ span: 24, offset: 0 }}
                    sm={{ span: 12, offset: 0 }}
                    lg={{ span: 8, offset: 0 }}
                    key={project.id}
                    style={{ marginBottom: 20 }}
                  >
                    <motion.div
                      className="box"
                      initial={{ opacity: 0, y: "-5%" }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <ProjectCard project={project} />
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
