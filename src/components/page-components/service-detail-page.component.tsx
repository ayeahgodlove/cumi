"use client";

import { AppNav } from "@components/nav/nav.component";
import { AppFooter } from "@components/footer/footer";
import { AppFootnote } from "@components/footnote/footnote";
import { Layout, Spin, Card, Typography, Row, Col, Button, Tag, Divider, Space, Alert, Collapse, List } from "antd";
import { 
  CaretRightOutlined, 
  CheckCircleOutlined, 
  PhoneOutlined, 
  MailOutlined, 
  WhatsAppOutlined,
  ArrowRightOutlined,
  StarOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  RocketOutlined
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FiArrowRightCircle } from "react-icons/fi";
import BannerComponent from "@components/banner/banner.component";

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

interface ServiceDetailPageComponentProps {
  slug: string;
}

interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  imageUrl: string;
  items: string[];
  createdAt: string;
  updatedAt: string;
}

interface ServiceListItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  imageUrl: string;
}

export default function ServiceDetailPageComponent({ slug }: ServiceDetailPageComponentProps) {
  const [service, setService] = useState<Service | null>(null);
  const [services, setServices] = useState<ServiceListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch current service
        const serviceResponse = await fetch(`/api/services/slugs/${slug}`);
        if (!serviceResponse.ok) {
          throw new Error('Service not found');
        }
        const serviceData = await serviceResponse.json();
        setService(serviceData);

        // Fetch all services for sidebar
        const servicesResponse = await fetch('/api/services');
        if (servicesResponse.ok) {
          const servicesData = await servicesResponse.json();
          setServices(servicesData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "65vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin size="large" style={{ height: "65vh", width: "100%" }} />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="container-fluid mt-3" style={{ width: "100%" }}>
        <AppNav logoPath="/" />
        <div className="container py-5">
          <Alert
            message="Service Not Found"
            description={error || "The service you're looking for doesn't exist or has been removed."}
            type="error"
            showIcon
            action={
              <Button type="primary" href="/our_services">
                Browse All Services
              </Button>
            }
          />
        </div>
        <AppFooter logoPath="/" />
        <AppFootnote />
      </div>
    );
  }

  return (
    <>
      <div className="container-fluid mt-3" style={{ width: "100%" }}>
        <AppNav logoPath="/" />
        <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <BannerComponent
                breadcrumbs={[{ label: "Services", uri: "our_services" }, { label: service.title, uri: service.slug } ]}
                pageTitle={service.title}
              />
        </motion.div>
        <Content style={{ minHeight: "65vh" }}>
          <div className="container py-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
           
              {/* Hero Section */}
              {/* <div className="cumi-hero cumi-section rounded-4 mb-5">
                <div className="container text-center">
                  <Row justify="center" align="middle">
                    <Col xs={24} md={16}>
                      <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <Title level={1} className="text-white mb-3">
                          {service.title}
                        </Title>
                        <Paragraph className="text-white-50 fs-5 mb-4">
                          Professional {service.title.toLowerCase()} solutions tailored to your business needs
                        </Paragraph>
                        <div className="d-flex justify-content-center gap-3">
                          <Button 
                            type="primary" 
                            size="large"
                            className="cumi-button-primary"
                            icon={<WhatsAppOutlined />}
                            href="https://wa.me/237681289411"
                            target="_blank"
                          >
                            Get Started
                          </Button>
                          <Button 
                            size="large"
                            className="cumi-gradient-border text-black"
                            icon={<MailOutlined />}
                            href="mailto:info@cumi.dev"
                          >
                            Contact Us
                          </Button>
                        </div>
                      </motion.div>
                    </Col>
                  </Row>
                </div>
              </div> */}

              {/* Main Content */}
              <Row gutter={[24, 24]}>
                <Col xs={24} lg={6}>
                  {/* Services Sidebar */}
                  <Card className="cumi-card mb-4">
                    <Title level={4} className="cumi-gradient-text mb-4">
                      Our Services
                    </Title>
                    <div className="services-list">
                      {services.map((item, index) => (
                        <Link
                          href={`/our_services/${item.slug}`}
                          className={`d-flex justify-content-start align-items-center mb-3 p-2 rounded ${
                            slug === item.slug ? "bg-primary text-white" : "hover-bg-light"
                          }`}
                          key={index}
                        >
                          <FiArrowRightCircle
                            style={{ color: slug === item.slug ? "white" : "#22C55E" }}
                            size={15}
                            className="me-2"
                          />
                          <span>{item.title}</span>
                        </Link>
                      ))}
                    </div>
                  </Card>

                  {/* Contact Card */}
                  <Card className="cumi-card">
                    <div className="text-center">
                      <div className="mb-3">
                        <TeamOutlined style={{ fontSize: '48px', color: 'var(--cumi-primary)' }} />
                      </div>
                      <Title level={4} className="mb-3">Need Help?</Title>
                      <Paragraph className="text-muted mb-3">
                        Our expert team is ready to assist you with your project.
                      </Paragraph>
                      <Space direction="vertical" size="middle" className="w-100">
                        <Button 
                          type="primary" 
                          className="cumi-button-primary w-100"
                          icon={<PhoneOutlined />}
                          href="tel:+237681289411"
                        >
                          Call Us
                        </Button>
                        <Button 
                          className="cumi-gradient-border text-black w-100"
                          icon={<WhatsAppOutlined />}
                          href="https://wa.me/237681289411"
                          target="_blank"
                        >
                          WhatsApp
                        </Button>
                        <Button 
                          className="cumi-gradient-border text-black w-100"
                          icon={<MailOutlined />}
                          href="mailto:info@cumi.dev"
                        >
                          Email Us
                        </Button>
                      </Space>
                    </div>
                  </Card>
                </Col>

                <Col xs={24} lg={18}>
                  {/* Service Image */}
                  <Card className="cumi-card mb-4">
                    <img
                      src={`/uploads/media/${service.imageUrl}`}
                      alt={service.title}
                      className="img-fluid rounded"
                      style={{ width: '100%', height: '400px', objectFit: 'cover' }}
                    />
                  </Card>

                  {/* Service Description */}
                  <Card className="cumi-card mb-4">
                    <Title level={3} className="cumi-gradient-text mb-4">
                      About This Service
                    </Title>
                    <Paragraph className="fs-6">
                      {service.description}
                    </Paragraph>
                  </Card>

                  {/* Service Features */}
                  <Card className="cumi-card mb-4">
                    <Title level={3} className="mb-4">What We Offer</Title>
                    <Row gutter={[16, 16]}>
                      {service.items.map((item, index) => (
                        <Col xs={24} sm={12} key={index}>
                          <div className="d-flex align-items-center p-3 border rounded">
                            <CheckCircleOutlined 
                              style={{ color: 'var(--cumi-green)', fontSize: '20px' }} 
                              className="me-3" 
                            />
                            <Text strong>{item}</Text>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </Card>

                  {/* Process Overview */}
                  <Card className="cumi-card mb-4">
                    <Title level={3} className="mb-4">Our Process</Title>
                    <Row gutter={[16, 16]}>
                      <Col xs={24} sm={8}>
                        <div className="text-center p-3">
                          <div className="mb-3">
                            <RocketOutlined style={{ fontSize: '32px', color: 'var(--cumi-primary)' }} />
                          </div>
                          <Title level={5}>1. Discovery</Title>
                          <Text type="secondary">We understand your requirements and goals</Text>
                        </div>
                      </Col>
                      <Col xs={24} sm={8}>
                        <div className="text-center p-3">
                          <div className="mb-3">
                            <TeamOutlined style={{ fontSize: '32px', color: 'var(--cumi-teal)' }} />
                          </div>
                          <Title level={5}>2. Development</Title>
                          <Text type="secondary">Our team builds your solution with expertise</Text>
                        </div>
                      </Col>
                      <Col xs={24} sm={8}>
                        <div className="text-center p-3">
                          <div className="mb-3">
                            <StarOutlined style={{ fontSize: '32px', color: 'var(--cumi-blue)' }} />
                          </div>
                          <Title level={5}>3. Delivery</Title>
                          <Text type="secondary">We deliver and support your project</Text>
                        </div>
                      </Col>
                    </Row>
                  </Card>

                  {/* CTA Section */}
                  <Card className="cumi-card">
                    <div className="text-center p-4">
                      <Title level={3} className="mb-3">Ready to Get Started?</Title>
                      <Paragraph className="fs-6 mb-4">
                        Let&apos;s discuss your project and bring your vision to life with our professional {service.title.toLowerCase()} services.
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
                          href="mailto:info@cumi.dev"
                        >
                          Get Quote
                        </Button>
                      </Space>
                    </div>
                  </Card>
                </Col>
              </Row>
            </motion.div>
          </div>
        </Content>
      </div>
      <AppFooter logoPath="/" />
      <AppFootnote />
    </>
  );
}
