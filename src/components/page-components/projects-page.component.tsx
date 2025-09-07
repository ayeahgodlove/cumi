"use client";
import BannerComponent from "@components/banner/banner.component";
import { AppFooter } from "@components/footer/footer";
import { AppFootnote } from "@components/footnote/footnote";
import { AppNav } from "@components/nav/nav.component";
import ProjectCard from "@components/project/ProjectCard";
import SpinnerList from "@components/shared/spinner-list";
import { projectAPI } from "@store/api/project_api";
import {
  Col,
  Empty,
  Layout,
  Row,
  Spin,
  Typography,
  Card,
  Button,
  Space,
  Tag,
  Statistic,
} from "antd";
import { motion } from "framer-motion";
import styles from "@app/projects/project-card.module.css";
import {
  RocketOutlined,
  CodeOutlined,
  GlobalOutlined,
  TrophyOutlined,
  ArrowRightOutlined,
  FilterOutlined,
  MailOutlined,
} from "@ant-design/icons";

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

export default function ProjectsPageComponent() {
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

  const stats = [
    {
      title: "Projects Completed",
      value: projects?.length || 0,
      icon: <TrophyOutlined />,
    },
    { title: "Technologies Used", value: "15+", icon: <CodeOutlined /> },
    { title: "Happy Clients", value: "50+", icon: <RocketOutlined /> },
    { title: "Years Experience", value: "5+", icon: <GlobalOutlined /> },
  ];

  const technologies = [
    'JavaScript',
    'PHP',
    "React",
    "Next.js",
    "Node.js",
    "TypeScript",
    "PostgreSQL",
    'MySQL',
    "GraphQL",
    "Python",
    "REST API",
    "UI/UX Design",
    "Laravel",
  ];

  return (
    <>
      <div className="container-fluid mt-3" style={{ width: "100%" }}>
        <AppNav logoPath="/" />
      </div>

      <BannerComponent
        breadcrumbs={[{ label: "Projects", uri: "projects" }]}
        pageTitle="Our Projects"
      />

      {/* Hero Section */}
      <section
        className="py-5"
        style={{
          background: "linear-gradient(135deg, #faf5ff 0%, #f0f9ff 100%)",
        }}
      >
        <div className="container">
          <Row justify="center" align="middle">
            <Col xs={24} lg={12}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Title level={1} className="mb-4">
                  Innovative Projects That Drive Success
                </Title>
                <Paragraph className="fs-5 text-muted mb-4">
                  Explore our portfolio of cutting-edge digital solutions that
                  have transformed businesses and delivered exceptional results
                  across various industries.
                </Paragraph>
                <Space size="large">
                  <Button
                    type="primary"
                    size="large"
                    icon={<ArrowRightOutlined />}
                    href="/contact_us"
                  >
                    Start Your Project
                  </Button>
                  <Button size="large" href="/our_services">
                    View Services
                  </Button>
                </Space>
              </motion.div>
            </Col>
            <Col xs={24} lg={12}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-center"
              >
                <img
                  className="w-100 img-fluid rounded-3 shadow-lg"
                  style={{ maxHeight: 400 }}
                  src="/img/emmanuel-ikwuegbu-MSX3O-Sqa8U-unsplash.jpg"
                  alt="Project Portfolio"
                />
              </motion.div>
            </Col>
          </Row>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-5">
        <div className="container">
          <Row gutter={[24, 24]} justify="center">
            {stats.map((stat, index) => (
              <Col xs={12} sm={6} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="text-center border-0 shadow-sm h-100">
                    <div
                      className="text-primary mb-3"
                      style={{ fontSize: "2rem" }}
                    >
                      {stat.icon}
                    </div>
                    <Statistic
                      title={stat.title}
                      value={stat.value}
                      valueStyle={{
                        color: "#1890ff",
                        fontSize: "2rem",
                        fontWeight: "bold",
                      }}
                    />
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <Row justify="center" className="mb-4">
            <Col xs={24} lg={16} className="text-center">
              <Title level={2} className="mb-3">
                Technologies We Master
              </Title>
              <Paragraph className="fs-5 text-muted">
                We work with cutting-edge technologies to build robust,
                scalable, and high-performance applications.
              </Paragraph>
            </Col>
          </Row>
          <Row justify="center">
            <Col xs={24} lg={18}>
              <div className="text-center">
                <Space wrap size="large">
                  {technologies.map((tech, index) => (
                    <motion.div
                      key={tech}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Tag
                        color="blue"
                        className="px-3 py-2 fs-6"
                        style={{ borderRadius: "20px", fontSize: "1rem" }}
                      >
                        {tech}
                      </Tag>
                    </motion.div>
                  ))}
                </Space>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {/* Projects Grid */}
      <Content className="container py-5">
        <Row justify="center" className="mb-5">
          <Col xs={24} lg={16} className="text-center">
            <Title level={2} className="mb-3">
              <span className={styles.glow}>Featured Projects</span>
            </Title>
            <Paragraph className="fs-5 text-muted">
              Each project represents our commitment to excellence, innovation,
              and delivering solutions that exceed expectations.
            </Paragraph>
          </Col>
        </Row>

        {projects && projects.length > 0 ? (
          <Row gutter={[24, 24]} justify="center">
            {projects?.map((project, index) => (
              <Col xs={24} sm={12} lg={8} key={project.id}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
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
        ) : (
          <Row justify="center">
            <Col span={24}>
              <Card className="text-center border-0 shadow-sm">
                <Empty
                  description="No projects available at the moment"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              </Card>
            </Col>
          </Row>
        )}
      </Content>

      {/* CTA Section */}
      <Card className="cumi-card">
        <div className="text-center p-4">
          <Title level={3} className="mb-3">
            Ready to Get Started?
          </Title>
          <Paragraph className="fs-6 mb-4">
            Let&apos;s discuss your project and bring your vision to life with
            our professional services.
          </Paragraph>
          <Space size="large">
            <Button
              type="primary"
              size="large"
              className="cumi-button-primary"
              icon={<ArrowRightOutlined />}
              href="https://wa.me/237681289411"
              target="_blank"
            >
              Start Your Project
            </Button>
            <Button
              size="large"
              className="cumi-gradient-border text-black"
              icon={<MailOutlined />}
              href="mailto:info@cumitech.com"
            >
              Get Quote
            </Button>
          </Space>
        </div>
      </Card>
      <AppFooter logoPath="/" />
      <AppFootnote />
    </>
  );
}
