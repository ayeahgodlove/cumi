"use client";
import BannerComponent from "@components/banner/banner.component";
import { AppFooter } from "@components/footer/footer";
import { AppFootnote } from "@components/footnote/footnote";
import { AppNav } from "@components/nav/nav.component";
import ProjectCard from "@components/project/ProjectCard";
import SpinnerList from "@components/shared/spinner-list";
import { projectAPI } from "@store/api/project_api";
import { Col, Empty, Layout, Row, Spin, Typography } from "antd";
import { motion } from "framer-motion";
import styles from "./project-card.module.css";

const { Content } = Layout;
const { Title } = Typography;

export default function IndexPage() {
  const {
    data: projects,
    isLoading: isLoadingEvent,
    isFetching: isFetchEvent,
  } = projectAPI.useFetchAllProjectsQuery(1);

  if (isLoadingEvent || isFetchEvent) {
    return (
      <div
        style={{
          minHeight: "65vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin size="large" tip="Loading..." fullscreen spinning />
      </div>
    );
  }
  return (
    <>
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
        {projects && projects.length > 0 ? (
          <div className="row justify-content-center align-items-start py-5">
            <div className="col-12">
              <Title
                level={2}
                className="text-center mb-5"
              >
                <span className={styles.glow}>Our Projects</span>
              </Title>
            </div>
            <div className="col-12 col-md-12">
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                {projects?.map((project, index) => (
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
                      <ProjectCard
                        project={project}
                        index={index}
                        styles={styles}
                      />
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
    </>
  );
}
