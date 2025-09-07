"use client";
import BannerComponent from "@components/banner/banner.component";
import { AppFooter } from "@components/footer/footer";
import { AppFootnote } from "@components/footnote/footnote";
import { AppNav } from "@components/nav/nav.component";
import { serviceAPI } from "@store/api/service_api";
import { Spin, Row, Col, Typography, Card, Button, Space } from "antd";
import Link from "next/link";
import "swiper/css";
import ServiceList from "@components/service/service-list.component";
import { motion } from "framer-motion";
import { 
  RocketOutlined, 
  BulbOutlined, 
  ThunderboltOutlined,
  HeartOutlined,
  CheckCircleOutlined,
  ArrowRightOutlined
} from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

export default function OurServicesPageComponent() {
  const {
    data: services,
    isLoading: isLoadingService,
    isFetching: isFetchService,
  } = serviceAPI.useFetchAllServicesQuery(1);

  if (isLoadingService || isFetchService) {
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

  const features = [
    {
      icon: <RocketOutlined />,
      title: "Fast Delivery",
      description: "We deliver projects on time with exceptional quality"
    },
    {
      icon: <BulbOutlined />,
      title: "Innovative Solutions",
      description: "Cutting-edge technology and creative problem solving"
    },
    {
      icon: <ThunderboltOutlined />,
      title: "Performance Focused",
      description: "Optimized solutions for maximum efficiency and speed"
    },
    {
      icon: <HeartOutlined />,
      title: "Client Centric",
      description: "Your success is our priority in every project"
    }
  ];

  const benefits = [
    "24/7 Technical Support",
    "Scalable Solutions",
    "Modern Technology Stack",
    "SEO Optimized",
    "Mobile Responsive",
    "Security First Approach"
  ];

  return (
    <>
      <div className="container-fluid mt-3" style={{ width: "100%" }}>
        <AppNav logoPath="/" />
      </div>

      <BannerComponent
        breadcrumbs={[{ label: "Services", uri: "our_services" }]}
        pageTitle="Our Services"
      />

      {/* Hero Section */}
      <section 
        className="py-5"
        style={{
          background: 'linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%)'
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
                  Transform Your Digital Vision Into Reality
                </Title>
                <Paragraph className="fs-5 text-muted mb-4">
                  We provide comprehensive digital solutions that drive growth, 
                  enhance user experience, and deliver measurable results for 
                  businesses of all sizes.
                </Paragraph>
                <Space size="large">
                  <Button 
                    type="primary" 
                    size="large"
                    icon={<ArrowRightOutlined />}
                    href="https://wa.me/237681289411"
                    target="_blank"
                  >
                    Get Started
                  </Button>
                  <Button size="large" href="/contact_us">
                    Learn More
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
                  src="/img/christopher-gower-m_HRfLhgABo-unsplash.jpg"
                  alt="Digital Solutions"
                />
              </motion.div>
            </Col>
          </Row>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <div className="container">
          <Row justify="center" className="mb-5">
            <Col xs={24} lg={16} className="text-center">
              <Title level={2} className="mb-3">Why Choose Cumi Digital?</Title>
              <Paragraph className="fs-5 text-muted">
                We combine technical expertise with creative innovation to deliver 
                solutions that exceed expectations.
              </Paragraph>
            </Col>
          </Row>
          <Row gutter={[24, 24]}>
            {features.map((feature, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card 
                    className="h-100 text-center border-0 shadow-sm"
                    hoverable
                    style={{
                      transition: 'all 0.3s ease',
                      borderRadius: '12px'
                    }}
                    styles={{
                      body: {
                        padding: '2rem 1.5rem'
                      }
                    }}
                  >
                    <div className="text-primary mb-3" style={{ fontSize: '2.5rem' }}>
                      {feature.icon}
                    </div>
                    <Title level={4} className="mb-3">{feature.title}</Title>
                    <Paragraph className="text-muted">{feature.description}</Paragraph>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Services List */}
      <ServiceList services={services} />

      {/* Benefits Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <Row justify="center" align="middle">
            <Col xs={24} lg={12}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Title level={2} className="mb-4">
                  What You Get With Our Services
                </Title>
                <Paragraph className="fs-5 text-muted mb-4">
                  Every project comes with comprehensive support and cutting-edge 
                  features designed to give you a competitive advantage.
                </Paragraph>
                <Row gutter={[16, 16]}>
                  {benefits.map((benefit, index) => (
                    <Col xs={24} sm={12} key={index}>
                      <div className="d-flex align-items-center">
                        <CheckCircleOutlined className="text-success me-3" style={{ fontSize: '1.2rem' }} />
                        <Text strong>{benefit}</Text>
                      </div>
                    </Col>
                  ))}
                </Row>
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
                  className="w-100 img-fluid rounded-3"
                  style={{ maxHeight: 350 }}
                  src="/img/desola-lanre-ologun-IgUR1iX0mqM-unsplash.jpg"
                  alt="Benefits"
                />
              </motion.div>
            </Col>
          </Row>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5">
        <div className="container">
          <Card 
            className="text-center border-0 shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #1890ff 0%, #722ed1 100%)',
              color: 'white'
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Title level={2} style={{ color: 'white' }} className="mb-3">
                Ready to Build Your Next Project?
              </Title>
              <Paragraph 
                className="fs-5 mb-4"
                style={{ color: 'rgba(255, 255, 255, 0.8)' }}
              >
                Let&apos;s discuss your project requirements and create something amazing together.
              </Paragraph>
              <Space size="large">
                <Button 
                  type="primary" 
                  size="large"
                  style={{
                    backgroundColor: 'white',
                    color: '#1890ff',
                    borderColor: 'white',
                    fontWeight: 'bold'
                  }}
                  href="https://wa.me/237681289411"
                  target="_blank"
                >
                  Start Your Project
                </Button>
                <Button 
                  size="large"
                  style={{
                    backgroundColor: 'transparent',
                    color: 'white',
                    borderColor: 'white',
                    fontWeight: 'bold'
                  }}
                  href="/contact_us"
                >
                  Contact Us
                </Button>
              </Space>
            </motion.div>
          </Card>
        </div>
      </section>

      <AppFooter logoPath="/" />
      <AppFootnote />
    </>
  );
}
