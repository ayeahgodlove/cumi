"use client";

import BannerComponent from "@components/banner/banner.component";
import { AppFooter } from "@components/footer/footer";
import { AppFootnote } from "@components/footnote/footnote";
import { AppNav } from "@components/nav/nav.component";
import SpinnerList from "@components/shared/spinner-list";
import { eventAPI } from "@store/api/event_api";
import { Row, Col, Layout, Empty, Spin, Card, Typography, Button, Tag, Space, Divider } from "antd";
import { motion } from "framer-motion";
import { CalendarOutlined, EnvironmentOutlined, DollarOutlined, UserOutlined } from "@ant-design/icons";
import { useState } from "react";
import { message } from "antd";

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

interface EventDetailPageComponentProps {
  eventSlug: string;
}

export default function EventDetailPageComponent({ eventSlug }: EventDetailPageComponentProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  
  const {
    data: event,
    error,
    isLoading,
    isFetching,
  } = eventAPI.useGetSingleEventBySlugQuery(eventSlug);

  const handleRegister = async () => {
    if (!event) return;
    
    setIsRegistering(true);
    try {
      const response = await fetch('/api/event-registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: event.id,
          // Add user info if available
        }),
      });

      if (response.ok) {
        message.success('Successfully registered for the event!');
      } else {
        const errorData = await response.json();
        message.error(errorData.message || 'Registration failed');
      }
    } catch (error) {
      message.error('Registration failed. Please try again.');
    } finally {
      setIsRegistering(false);
    }
  };

  if (isLoading || isFetching) {
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

  if (error || !event) {
    return (
      <div
        style={{
          minHeight: "65vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Empty description="Event not found" />
      </div>
    );
  }

  return (
    <>
      <div className="container-fluid mt-3" style={{ width: "100%" }}>
        <AppNav logoPath="/" />
      </div>

      <BannerComponent
        breadcrumbs={[
          { label: "Events", uri: "events" },
          { label: event.title, uri: "#" },
        ]}
        pageTitle="Event Details"
      />

      <div className="container mb-5">
        <Content>
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={16}>
              <motion.div
                className="box"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card>
                  <div className="mb-4">
                    <Title level={1}>{event.title}</Title>
                    <Space wrap>
                      <Tag color="blue">Event</Tag>
                      <Tag color="green">Online Event</Tag>
                    </Space>
                  </div>

                  {event.imageUrl && (
                    <div className="mb-4">
                      <img
                        src={`/uploads/events/${event.imageUrl}`}
                        alt={event.title}
                        style={{
                          width: "100%",
                          height: "400px",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                    </div>
                  )}

                  <div className="mb-4">
                    <Title level={3}>About This Event</Title>
                    <Paragraph className="fs-5">{event.description}</Paragraph>
                  </div>

                </Card>
              </motion.div>
            </Col>

            <Col xs={24} lg={8}>
              <motion.div
                className="box"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card>
                  <Title level={3}>Event Information</Title>
                  
                  <Space direction="vertical" size="large" style={{ width: "100%" }}>
                    <div>
                      <Text strong>
                        <CalendarOutlined className="me-2" />
                        Date & Time
                      </Text>
                      <div className="mt-1">
                        <Text>
                          {new Date(event.eventDate).toLocaleDateString()}
                        </Text>
                      </div>
                    </div>

                    <div>
                      <Text strong>
                        <EnvironmentOutlined className="me-2" />
                        Location
                      </Text>
                      <div className="mt-1">
                        <Text>{event.location || "TBA"}</Text>
                      </div>
                    </div>

                    <div>
                      <Text strong>
                        <DollarOutlined className="me-2" />
                        Price
                      </Text>
                      <div className="mt-1">
                        <Text>
                          Free
                        </Text>
                      </div>
                    </div>

                    <div>
                      <Text strong>
                        <UserOutlined className="me-2" />
                        Capacity
                      </Text>
                      <div className="mt-1">
                        <Text>
                          Unlimited
                        </Text>
                      </div>
                    </div>
                  </Space>

                  <Divider />

                  <Button
                    type="primary"
                    size="large"
                    block
                    loading={isRegistering}
                    onClick={handleRegister}
                    disabled={false}
                  >
                    Register for Event
                  </Button>

                </Card>
              </motion.div>
            </Col>
          </Row>
        </Content>
      </div>

      <AppFooter logoPath="/" />
      <AppFootnote />
    </>
  );
}