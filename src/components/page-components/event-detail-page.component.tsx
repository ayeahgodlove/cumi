"use client";

import BannerComponent from "@components/banner/banner.component";
import { AppFooter } from "@components/footer/footer";
import { AppFootnote } from "@components/footnote/footnote";
import { AppNav } from "@components/nav/nav.component";
import SpinnerList from "@components/shared/spinner-list";
import { eventAPI } from "@store/api/event_api";
import { Row, Col, Layout, Empty, Spin, Card, Typography, Button, Tag, Space, Divider, App } from "antd";
import { motion } from "framer-motion";
import EventRegistrationModal from "@components/shared/event-registration-modal.component";
import { 
  CalendarOutlined, 
  EnvironmentOutlined, 
  DollarOutlined, 
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  MessageOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  GlobalOutlined,
  TagOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from "@ant-design/icons";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { BASE_URL_UPLOADS_MEDIA } from "@constants/api-url";

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

interface EventDetailPageComponentProps {
  eventSlug: string;
}

export default function EventDetailPageComponent({ eventSlug }: EventDetailPageComponentProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationModalVisible, setRegistrationModalVisible] = useState(false);
  const { data: session } = useSession();
  const { message } = App.useApp();
  
  const {
    data: event,
    error,
    isLoading,
    isFetching,
  } = eventAPI.useGetSingleEventBySlugQuery(eventSlug);

  const handleRegister = () => {
    if (!event) return;
    
    // Check if user is logged in
    if (!session?.user?.id) {
      message.error('Please log in to register for events');
      return;
    }
    
    setRegistrationModalVisible(true);
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
      <div className="container-fluid" style={{ width: "100%" }}>
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
                      {event.category && (
                        <Tag color="purple">{event.category?.charAt(0).toUpperCase() + event.category?.slice(1)}</Tag>
                      )}
                      <Tag color={event.isFree ? 'green' : 'blue'}>
                        {event.isFree ? 'Free' : `Paid Event`}
                      </Tag>
                      <Tag color="cyan">{event.language?.charAt(0).toUpperCase() + event.language?.slice(1)}</Tag>
                      {event.status === 'published' && <Tag color="green">Published</Tag>}
                      {event.status === 'draft' && <Tag color="orange">Draft</Tag>}
                      {event.status === 'cancelled' && <Tag color="red">Cancelled</Tag>}
                      {event.status === 'completed' && <Tag color="blue">Completed</Tag>}
                    </Space>
                  </div>

                  {event.imageUrl && (
                    <div className="mb-4">
                      <img
                        src={`${BASE_URL_UPLOADS_MEDIA}/${event.imageUrl}`}
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

                  {/* Event Details Grid */}
                  <Row gutter={[16, 16]} className="mb-4">
                    <Col xs={24} md={12}>
                      <Card size="small" style={{ background: '#f8f9fa' }}>
                        <Space direction="vertical" size="small" style={{ width: '100%' }}>
                          <Text strong><CalendarOutlined /> Event Date</Text>
                          <Text>{new Date(event.eventDate).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}</Text>
                          <Text type="secondary">
                            {new Date(event.eventDate).toLocaleTimeString('en-US', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </Text>
                        </Space>
                      </Card>
                    </Col>
                    <Col xs={24} md={12}>
                      <Card size="small" style={{ background: '#f8f9fa' }}>
                        <Space direction="vertical" size="small" style={{ width: '100%' }}>
                          <Text strong><EnvironmentOutlined /> Location</Text>
                          <Text>{event.location || 'TBA'}</Text>
                          {event.city && <Text type="secondary">{event.city}</Text>}
                          {event.region && <Text type="secondary">{event.region}</Text>}
                        </Space>
                      </Card>
                    </Col>
                  </Row>

                  {/* Event Requirements */}
                  {event.requirements && (
                    <div className="mb-4">
                      <Title level={4}><InfoCircleOutlined /> Requirements</Title>
                      <Card size="small" style={{ background: '#fff7e6' }}>
                        <Paragraph>{event.requirements}</Paragraph>
                      </Card>
                    </div>
                  )}

                  {/* Target Audience */}
                  {event.targetAudience && (
                    <div className="mb-4">
                      <Title level={4}><UserOutlined /> Target Audience</Title>
                      <Card size="small" style={{ background: '#e6f7ff' }}>
                        <Tag color="blue">{event.targetAudience}</Tag>
                      </Card>
                    </div>
                  )}

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
                    {/* Pricing */}
                    <div>
                      <Text strong>
                        <DollarOutlined className="me-2" />
                        Entry Fee
                      </Text>
                      <div className="mt-1">
                        <Text style={{ fontSize: '18px', fontWeight: 'bold' }}>
                          {event.isFree ? (
                            <span style={{ color: '#52c41a' }}>Free</span>
                          ) : (
                            <span style={{ color: '#1890ff' }}>
                              {event.entryFee} XAF
                            </span>
                          )}
                        </Text>
                      </div>
                    </div>

                    {/* Event Date */}
                    <div>
                      <Text strong>
                        <CalendarOutlined className="me-2" />
                        Event Date
                      </Text>
                      <div className="mt-1">
                        <Text>{new Date(event.eventDate).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</Text>
                        <div>
                          <Text type="secondary">
                            {new Date(event.eventDate).toLocaleTimeString('en-US', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </Text>
                        </div>
                      </div>
                    </div>

                    {/* End Date */}
                    {event.eventEndDate && (
                      <div>
                        <Text strong>
                          <ClockCircleOutlined className="me-2" />
                          End Date
                        </Text>
                        <div className="mt-1">
                          <Text>{new Date(event.eventEndDate).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}</Text>
                          <div>
                            <Text type="secondary">
                              {new Date(event.eventEndDate).toLocaleTimeString('en-US', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </Text>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Location */}
                    <div>
                      <Text strong>
                        <EnvironmentOutlined className="me-2" />
                        Location
                      </Text>
                      <div className="mt-1">
                        <Text>{event.location || 'TBA'}</Text>
                        {event.city && (
                          <div>
                            <Text type="secondary">{event.city}</Text>
                          </div>
                        )}
                        {event.region && (
                          <div>
                            <Text type="secondary">{event.region}</Text>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Category */}
                    {event.category && (
                      <div>
                        <Text strong>
                          <TagOutlined className="me-2" />
                          Category
                        </Text>
                        <div className="mt-1">
                          <Tag color="purple">{event.category?.charAt(0).toUpperCase() + event.category?.slice(1)}</Tag>
                        </div>
                      </div>
                    )}

                    {/* Language */}
                    <div>
                      <Text strong>
                        <GlobalOutlined className="me-2" />
                        Language
                      </Text>
                      <div className="mt-1">
                        <Text>{event.language?.charAt(0).toUpperCase() + event.language?.slice(1)}</Text>
                      </div>
                    </div>

                    {/* Attendance */}
                    <div>
                      <Text strong>
                        <TeamOutlined className="me-2" />
                        Attendance
                      </Text>
                      <div className="mt-1">
                        <Text>{event.currentAttendees || 0} registered</Text>
                        {event.maxAttendees && (
                          <div>
                            <Text type="secondary">Max: {event.maxAttendees}</Text>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Registration Required */}
                    {event.registrationRequired && (
                      <div>
                        <Text strong>
                          <CheckCircleOutlined className="me-2" />
                          Registration
                        </Text>
                        <div className="mt-1">
                          <Tag color="green">Required</Tag>
                          {event.registrationDeadline && (
                            <div className="mt-1">
                              <Text type="secondary">
                                Deadline: {new Date(event.registrationDeadline).toLocaleDateString()}
                              </Text>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Status */}
                    <div>
                      <Text strong>
                        <InfoCircleOutlined className="me-2" />
                        Status
                      </Text>
                      <div className="mt-1">
                        <Tag 
                          color={
                            event.status === 'published' ? 'green' :
                            event.status === 'draft' ? 'orange' :
                            event.status === 'cancelled' ? 'red' :
                            event.status === 'completed' ? 'blue' : 'default'
                          }
                        >
                          {event.status?.charAt(0).toUpperCase() + event.status?.slice(1)}
                        </Tag>
                      </div>
                    </div>
                  </Space>

                  <Divider />

                  {/* Contact Information */}
                  {(event.contactPhone || event.contactEmail || event.whatsappNumber) && (
                    <div className="mb-4">
                      <Title level={4}>Contact Information</Title>
                      <Space direction="vertical" size="small" style={{ width: "100%" }}>
                        {event.contactPhone && (
                          <div>
                            <Text strong>
                              <PhoneOutlined className="me-2" />
                              Phone
                            </Text>
                            <div className="mt-1">
                              <Text>{event.contactPhone}</Text>
                            </div>
                          </div>
                        )}
                        
                        {event.contactEmail && (
                          <div>
                            <Text strong>
                              <MailOutlined className="me-2" />
                              Email
                            </Text>
                            <div className="mt-1">
                              <Text>{event.contactEmail}</Text>
                            </div>
                          </div>
                        )}
                        
                        {event.whatsappNumber && (
                          <div>
                            <Text strong>
                              <MessageOutlined className="me-2" />
                              WhatsApp
                            </Text>
                            <div className="mt-1">
                              <Text>{event.whatsappNumber}</Text>
                            </div>
                          </div>
                        )}
                      </Space>
                      <Divider />
                    </div>
                  )}

                  <Button
                    type="primary"
                    size="large"
                    block
                    loading={isRegistering}
                    onClick={handleRegister}
                    disabled={event.status === 'cancelled' || event.status === 'completed'}
                  >
                    {event.status === 'cancelled' ? 'Event Cancelled' : 
                     event.status === 'completed' ? 'Event Completed' : 
                     'Register for Event'}
                  </Button>

                </Card>
              </motion.div>
            </Col>
          </Row>
        </Content>
      </div>

      {/* Registration Modal */}
      <EventRegistrationModal
        visible={registrationModalVisible}
        onCancel={() => setRegistrationModalVisible(false)}
        event={event}
        onSuccess={() => {
          // Optionally refresh data or show success message
        }}
      />

      <AppFooter logoPath="/" />
      <AppFootnote />
    </>
  );
}