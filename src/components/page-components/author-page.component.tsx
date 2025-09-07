"use client";

import { AppNav } from "@components/nav/nav.component";
import { userAPI } from "@store/api/user_api";
import { Layout, Spin, Card, Avatar, Typography, Row, Col, Divider, Tag, Button } from "antd";
import { AppFooter } from "@components/footer/footer";
import { AppFootnote } from "@components/footnote/footnote";
import { UserOutlined, MailOutlined, EnvironmentOutlined, CalendarOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

interface AuthorPageComponentProps {
  username: string;
}

export default function AuthorPageComponent({ username }: AuthorPageComponentProps) {
  const {
    data: user,
    isLoading,
    isFetching,
  } = userAPI.useGetUserByUsernameQuery(username);

  if (!user || isLoading || isFetching) {
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

  return (
    <>
      <div className="container-fluid mt-3" style={{ width: "100%" }}>
        {/* navigation bar */}
        <AppNav logoPath="/" />

        <Content style={{ minHeight: "65vh" }}>
          <div className="container py-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Hero Section */}
              <div className="cumi-hero cumi-section rounded-4 mb-5">
                <div className="container text-center">
                  <Row justify="center" align="middle">
                    <Col xs={24} md={12}>
                      <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <Avatar
                          size={120}
                          icon={<UserOutlined />}
                          className="mb-4"
                          style={{
                            background: 'var(--cumi-gradient-primary)',
                            border: '4px solid rgba(255,255,255,0.2)'
                          }}
                        />
                      </motion.div>
                      <Title level={1} className="text-white mb-2">
                        {user.fullName || user.username}
                      </Title>
                      <Paragraph className="text-white-50 fs-5 mb-4">
                        Author & Content Creator
                      </Paragraph>
                      <div className="d-flex justify-content-center gap-3">
                        <Button 
                          type="primary" 
                          size="large"
                          className="cumi-button-primary"
                          icon={<MailOutlined />}
                        >
                          Contact
                        </Button>
                        <Button 
                          size="large"
                          className="cumi-gradient-border text-black"
                        >
                          Follow
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>

              {/* Author Details */}
              <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                  <Card className="cumi-card mb-4">
                    <Title level={3} className="cumi-gradient-text mb-4">
                      About {user.fullName || user.username}
                    </Title>
                    <Paragraph className="fs-6 text-muted">
                      {`Welcome to ${user.fullName || user.username}'s profile. This author brings valuable insights and expertise to our community through their engaging content and thoughtful perspectives.`}
                    </Paragraph>
                    
                    <Divider />
                    
                    <Title level={4} className="mb-3">Contact Information</Title>
                    <Row gutter={[16, 16]}>
                      <Col xs={24} sm={12}>
                        <div className="d-flex align-items-center mb-3">
                          <MailOutlined className="me-3 text-primary" style={{ fontSize: '18px' }} />
                          <div>
                            <Text strong>Email</Text>
                            <br />
                            <Text type="secondary">{user.email}</Text>
                          </div>
                        </div>
                      </Col>
                      <Col xs={24} sm={12}>
                        <div className="d-flex align-items-center mb-3">
                          <EnvironmentOutlined className="me-3 text-primary" style={{ fontSize: '18px' }} />
                          <div>
                            <Text strong>Location</Text>
                            <br />
                            <Text type="secondary">{user.address || 'Not specified'}</Text>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Card>

                  {/* Author Stats */}
                  <Card className="cumi-card">
                    <Title level={4} className="mb-4">Author Statistics</Title>
                    <Row gutter={[16, 16]}>
                      <Col xs={8} sm={6}>
                        <div className="text-center">
                          <div className="fs-2 fw-bold cumi-gradient-text">12</div>
                          <Text type="secondary">Articles</Text>
                        </div>
                      </Col>
                      <Col xs={8} sm={6}>
                        <div className="text-center">
                          <div className="fs-2 fw-bold cumi-gradient-text">1.2K</div>
                          <Text type="secondary">Views</Text>
                        </div>
                      </Col>
                      <Col xs={8} sm={6}>
                        <div className="text-center">
                          <div className="fs-2 fw-bold cumi-gradient-text">45</div>
                          <Text type="secondary">Comments</Text>
                        </div>
                      </Col>
                      <Col xs={8} sm={6}>
                        <div className="text-center">
                          <div className="fs-2 fw-bold cumi-gradient-text">8</div>
                          <Text type="secondary">Projects</Text>
                        </div>
                      </Col>
                    </Row>
                  </Card>
                </Col>

                <Col xs={24} lg={8}>
                  {/* Recent Activity */}
                  <Card className="cumi-card mb-4">
                    <Title level={4} className="mb-4">Recent Activity</Title>
                    <div className="d-flex align-items-center mb-3">
                      <div className="me-3">
                        <CalendarOutlined className="text-primary" />
                      </div>
                      <div>
                        <Text strong>Latest Article</Text>
                        <br />
                        <Text type="secondary" className="small">2 days ago</Text>
                      </div>
                    </div>
                    <div className="d-flex align-items-center mb-3">
                      <div className="me-3">
                        <CalendarOutlined className="text-primary" />
                      </div>
                      <div>
                        <Text strong>Project Update</Text>
                        <br />
                        <Text type="secondary" className="small">1 week ago</Text>
                      </div>
                    </div>
                    <div className="d-flex align-items-center">
                      <div className="me-3">
                        <CalendarOutlined className="text-primary" />
                      </div>
                      <div>
                        <Text strong>New Course</Text>
                        <br />
                        <Text type="secondary" className="small">2 weeks ago</Text>
                      </div>
                    </div>
                  </Card>

                  {/* Expertise Tags */}
                  <Card className="cumi-card">
                    <Title level={4} className="mb-4">Areas of Expertise</Title>
                    <div className="d-flex flex-wrap gap-2">
                      <Tag color="green">Web Development</Tag>
                      <Tag color="blue">React</Tag>
                      <Tag color="cyan">Next.js</Tag>
                      <Tag color="purple">TypeScript</Tag>
                      <Tag color="orange">UI/UX Design</Tag>
                      <Tag color="red">Mobile Apps</Tag>
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
