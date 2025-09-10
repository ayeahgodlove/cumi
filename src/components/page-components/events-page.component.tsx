"use client";

import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Space,
  Button,
  Tag,
  Input,
  Select,
  Modal,
  Form,
  message,
  Empty,
  Spin,
} from "antd";
import {
  CalendarOutlined,
  EnvironmentOutlined,
  EyeOutlined,
  SearchOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { useSession } from "next-auth/react";
import { AppNav } from "@components/nav/nav.component";
import { AppFooter } from "@components/footer/footer";
import { AppFootnote } from "@components/footnote/footnote";
import BannerComponent from "@components/banner/banner.component";
import { eventAPI } from "@store/api/event_api";
import { motion } from "framer-motion";
import { IEvent } from "@domain/models/event.model";
import { useTranslation } from "@contexts/translation.context";
import { useRouter } from "next/navigation";

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;

export default function EventsPageComponent() {
  const { data: session } = useSession();
  const { t } = useTranslation();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [registrationModalVisible, setRegistrationModalVisible] =
    useState(false);
  const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null);
  const [registrationForm] = Form.useForm();

  const {
    data: events,
    error,
    isLoading,
    isFetching,
  } = eventAPI.useFetchAllEventsQuery({
    searchTitle: searchTerm,
    sortBy: "date",
  });

  const filteredEvents =
    events?.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase());
      // Note: IEvent doesn't have category property, so we'll skip category filtering for now
      return matchesSearch;
    }) || [];

  const handleRegisterEvent = (event: IEvent) => {
    setSelectedEvent(event);
    setRegistrationModalVisible(true);
  };

  const handleRegistrationSubmit = async (values: any) => {
    try {
      if (!selectedEvent || !session?.user?.id) {
        message.error("Please log in to register for events");
        return;
      }

      const registrationData = {
        eventId: selectedEvent.id,
        userId: session.user.id,
        name: values.name,
        email: values.email,
        phone: values.phone,
        company: values.company,
        dietaryRequirements: values.dietaryRequirements,
        additionalNotes: values.additionalNotes,
      };

      const response = await fetch("/api/event-registrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registrationData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Registration failed");
      }

      message.success("Successfully registered for the event!");
      setRegistrationModalVisible(false);
      registrationForm.resetFields();

      // Note: RTK Query will automatically refetch data when needed
    } catch (error) {
      console.error("Registration error:", error);
      message.error(
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again."
      );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading || isFetching) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "50px",
          backgroundColor: "white",
          minHeight: "100vh",
        }}
      >
        <Spin size="large" />
        <Text>Loading events...</Text>
      </div>
    );
  }

  return (
    <>
      <div
        className="container-fluid"
        style={{ width: "100%", backgroundColor: "white" }}
      >
        <AppNav logoPath="/" />
      </div>

      {/* Banner */}
      <BannerComponent
        breadcrumbs={[{ label: t('nav.events'), uri: "events" }]}
        pageTitle={t('nav.events')}
      />

      <div
        className="container pb-5"
        style={{ marginTop: 24, backgroundColor: "white" }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Card
            style={{
              backgroundColor: "white",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              borderRadius: "12px",
              overflow: "hidden",
              marginBottom: 24,
            }}
          >
            <Row justify="space-between" align="middle">
              <Col>
                <Title level={2} style={{ margin: 0 }}>
                  {t('events.title')}
                </Title>
                <Text type="secondary">
                  {t('events.subtitle')}
                </Text>
              </Col>
            </Row>
          </Card>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          <Card
            style={{
              backgroundColor: "white",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              borderRadius: "12px",
              overflow: "hidden",
              marginBottom: 24,
            }}
          >
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} sm={12} md={6}>
                <Search
                  placeholder={t('events.search_placeholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  prefix={<SearchOutlined />}
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Select
                  placeholder={t('events.category_placeholder')}
                  value={filterCategory}
                  onChange={setFilterCategory}
                  style={{ width: "100%" }}
                >
                  <Option value="all">{t('events.all_categories')}</Option>
                  <Option value="Web Development">{t('events.web_dev')}</Option>
                  <Option value="Artificial Intelligence">{t('events.ai_ml')}</Option>
                  <Option value="Data Science">{t('events.data_science')}</Option>
                  <Option value="Mobile Development">{t('events.mobile_dev')}</Option>
                </Select>
              </Col>
              <Col xs={24} sm={12} md={4}>
                <Button
                  icon={<FilterOutlined />}
                  onClick={() => {
                    setSearchTerm("");
                    setFilterCategory("all");
                  }}
                >
                  {t('events.clear_filters')}
                </Button>
              </Col>
            </Row>
          </Card>
        </motion.div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <Card>
            <Empty
              description="No events found matching your criteria"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </Card>
        ) : (
          <Row gutter={[16, 16]}>
            {filteredEvents.map((event, index) => (
              <Col xs={24} md={12} lg={8} key={event.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: index * 0.1,
                    ease: "easeOut"
                  }}
                  whileHover={{ 
                    y: -5,
                    transition: { duration: 0.2 }
                  }}
                  style={{ height: '100%' }}
                >
                  <Card
                    hoverable
                    style={{
                      backgroundColor: "white",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      borderRadius: "12px",
                      overflow: "hidden",
                    }}
                    cover={
                      <div style={{ position: "relative" }}>
                        <img
                          alt={event.title}
                          src={event.imageUrl || "/img/design-3.jpg"}
                          style={{
                            width: "100%",
                            height: 200,
                            objectFit: "cover",
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            top: 8,
                            left: 8,
                            background: "rgba(0,0,0,0.7)",
                            color: "white",
                            padding: "4px 8px",
                            borderRadius: 4,
                            fontSize: 12,
                          }}
                        >
                          📅 Event
                        </div>
                        <div
                          style={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            background: "rgba(0,0,0,0.7)",
                            color: "white",
                            padding: "4px 8px",
                            borderRadius: 4,
                            fontSize: 12,
                          }}
                        >
                          Event
                        </div>
                      </div>
                    }
                    actions={[
                      <Button
                        key="register"
                        type="primary"
                        icon={<CalendarOutlined />}
                        onClick={() => handleRegisterEvent(event)}
                      >
                        Register
                      </Button>,
                      <Button
                        key="view"
                        icon={<EyeOutlined />}
                        onClick={() => {
                          router.push(`/events/${event.slug}`);
                        }}
                      >
                        View Details
                      </Button>,
                    ]}
                  >
                    <Card.Meta
                      title={
                        <Space>
                          <Text strong>{event.title}</Text>
                          <Tag color="blue">Event</Tag>
                        </Space>
                      }
                      description={
                        <Space direction="vertical" size="small">
                          <Paragraph ellipsis={{ rows: 2 }}>
                            {event.description}
                          </Paragraph>
                          <Space>
                            <CalendarOutlined style={{ color: "#1890ff" }} />
                            <Text type="secondary">
                              {formatDate(event.eventDate.toString())}
                            </Text>
                          </Space>
                          <Space>
                            <EnvironmentOutlined style={{ color: "#faad14" }} />
                            <Text type="secondary">{event.location}</Text>
                          </Space>
                        </Space>
                      }
                    />
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        )}
      </div>

      {/* Registration Modal */}
      <Modal
        title={`Register for ${selectedEvent?.title}`}
        open={registrationModalVisible}
        onCancel={() => setRegistrationModalVisible(false)}
        footer={null}
        width={600}
      >
        {selectedEvent && (
          <div>
            <Card size="small" style={{ marginBottom: 24 }}>
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <img
                    src={selectedEvent.imageUrl || "/img/design-3.jpg"}
                    alt={selectedEvent.title}
                    style={{
                      width: "100%",
                      height: 150,
                      objectFit: "cover",
                      borderRadius: 8,
                    }}
                  />
                </Col>
                <Col span={24}>
                  <Space direction="vertical" size="small">
                    <Title level={4} style={{ margin: 0 }}>
                      {selectedEvent.title}
                    </Title>
                    <Space>
                      <CalendarOutlined />
                      <Text>
                        {formatDate(selectedEvent.eventDate.toString())}
                      </Text>
                    </Space>
                    <Space>
                      <EnvironmentOutlined />
                      <Text>{selectedEvent.location}</Text>
                    </Space>
                  </Space>
                </Col>
              </Row>
            </Card>

            <Form
              form={registrationForm}
              layout="vertical"
              onFinish={handleRegistrationSubmit}
            >
              <Form.Item
                name="name"
                label="Full Name"
                rules={[
                  { required: true, message: "Please enter your full name" },
                ]}
              >
                <Input placeholder="Enter your full name" />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email Address"
                rules={[
                  { required: true, message: "Please enter your email" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input placeholder="Enter your email address" />
              </Form.Item>

              <Form.Item
                name="phone"
                label="Phone Number"
                rules={[
                  { required: true, message: "Please enter your phone number" },
                ]}
              >
                <Input placeholder="Enter your phone number" />
              </Form.Item>

              <Form.Item name="company" label="Company/Organization">
                <Input placeholder="Enter your company or organization" />
              </Form.Item>

              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit">
                    Complete Registration
                  </Button>
                  <Button onClick={() => setRegistrationModalVisible(false)}>
                    Cancel
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>

      <AppFooter logoPath="/" />
      <AppFootnote />
    </>
  );
}