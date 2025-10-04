"use client";

import React, { useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Button,
  Space,
  Table,
  Tag,
  Spin,
  Descriptions,
  notification,
} from "antd";
import {
  ArrowLeftOutlined,
  EyeOutlined,
  TeamOutlined,
  UserOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import EnhancedBreadcrumb from "@components/shared/enhanced-breadcrumb/enhanced-breadcrumb.component";
import { useTranslation } from "@contexts/translation.context";
import { eventRegistrationAPI } from "@store/api/event-registration_api";
import { eventAPI } from "@store/api/event_api";

const { Title, Text } = Typography;

interface EventDetailsPageProps {
  params: {
    id: string;
  };
}

export default function EventDetailsPage({ params }: EventDetailsPageProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const { t } = useTranslation();
  const [api, contextHolder] = notification.useNotification();

  // RTK Query hooks
  const { data: eventResponse, isLoading: eventLoading, error: eventError } = eventAPI.useGetSingleEventQuery(params.id);
  const event = (eventResponse as any)?.data || eventResponse;
  const { data: eventRegistrations = [], isLoading: registrationsLoading } = eventRegistrationAPI.useGetEventRegistrationsByEventQuery(
    params.id,
    { pollingInterval: 45000 } // Poll every 45 seconds for new registrations
  );

  // Debug logging
  useEffect(() => {
    // Event data loaded
  }, [eventResponse, event, eventRegistrations]);

  const registrationColumns = [
    {
      title: t('common.name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('common.email'),
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: t('common.phone'),
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: t('common.status'),
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status?.toLowerCase() === 'confirmed' ? 'green' : status?.toLowerCase() === 'cancelled' ? 'red' : 'orange'}>
          {t(`common.${status?.toLowerCase()}`)}
        </Tag>
      ),
    },
    {
      title: t('creator.registration_date'),
      dataIndex: 'registrationDate',
      key: 'registrationDate',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  if (eventLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (!event || eventError) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Text>{t('creator.event_not_found')}</Text>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px" }}>
      {contextHolder}
      
      {/* Enhanced Breadcrumb */}
      <EnhancedBreadcrumb
        items={[
          { title: t('creator.event_management') },
          { title: event?.title || t('common.loading') }
        ]}
      />

      {/* Page Title */}
      <Title level={2} style={{ marginBottom: 24 }}>
        {t('creator.event_details')}
      </Title>

      {/* Event Statistics */}
      <Card
        style={{
          background: 'linear-gradient(135deg, #ffa751 0%, #ffe259 100%)',
          borderRadius: "16px",
          boxShadow: "0 8px 24px rgba(255, 167, 81, 0.3)",
          border: "none",
          marginBottom: 24,
        }}
      >
        <Title level={4} style={{ color: 'white', marginBottom: 20 }}>{t('creator.event_statistics')}</Title>
        <Row gutter={[16, 16]}>
          <Col xs={12} sm={8} md={8}>
            <Card
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                borderRadius: "12px",
                border: "none",
                textAlign: 'center',
              }}
            >
              <Statistic
                title={t('creator.total_registrations')}
                value={eventRegistrations?.length || 0}
                prefix={<TeamOutlined style={{ color: "#1890ff" }} />}
                valueStyle={{ fontSize: 24, fontWeight: 'bold', color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={8}>
            <Card
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                borderRadius: "12px",
                border: "none",
                textAlign: 'center',
              }}
            >
              <Statistic
                title={t('creator.current_attendees')}
                value={event.currentAttendees || 0}
                prefix={<UserOutlined style={{ color: "#52c41a" }} />}
                valueStyle={{ fontSize: 24, fontWeight: 'bold', color: "#52c41a" }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={8}>
            <Card
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                borderRadius: "12px",
                border: "none",
                textAlign: 'center',
              }}
            >
              <Statistic
                title={t('creator.registration_rate')}
                value={event.maxAttendees ? 
                  Math.round(((event.currentAttendees || 0) / event.maxAttendees) * 100) : 100
                }
                suffix="%"
                prefix={<UserOutlined style={{ color: "#fa8c16" }} />}
                valueStyle={{ fontSize: 24, fontWeight: 'bold', color: "#fa8c16" }}
              />
            </Card>
          </Col>
        </Row>
      </Card>

      {/* Event Details */}
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #ffa751 0%, #ffe259 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <CalendarOutlined style={{ fontSize: '20px', color: 'white' }} />
            </div>
            <span>{t('creator.event_information')}</span>
          </div>
        }
        style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          border: "1px solid #f0f0f0",
          marginBottom: 24,
        }}
        extra={
          <Space>
            <Button
              icon={<EyeOutlined />}
              onClick={() => {
                const slug = (event as any).slug || event.id;
                window.open(`/events/${slug}`, '_blank');
              }}
              style={{
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                fontWeight: 500,
              }}
            >
              {t('creator.preview_event')}
            </Button>
            <Button
              type="primary"
              icon={<EyeOutlined />}
              onClick={() => {
                const slug = (event as any).slug || event.id;
                router.push(`/events/${slug}`);
              }}
              style={{
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #ffa751 0%, #ffe259 100%)',
                border: 'none',
                boxShadow: '0 4px 12px rgba(255, 167, 81, 0.4)',
                fontWeight: 600,
              }}
            >
              {t('creator.view_full_event')}
            </Button>
          </Space>
        }
      >
        <Descriptions bordered column={2} size="small">
          <Descriptions.Item label={t('common.title')} span={2}>
            <Text strong style={{ fontSize: '15px' }}>{event.title}</Text>
          </Descriptions.Item>
          <Descriptions.Item label={t('common.status')}>
            <Tag 
              color={event.status?.toLowerCase() === 'published' ? 'green' : event.status?.toLowerCase() === 'cancelled' ? 'red' : 'orange'}
              style={{ fontSize: '13px', padding: '4px 12px', borderRadius: '6px' }}
            >
              {t(`common.${event.status?.toLowerCase()}`)}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label={t('creator.event_date')}>
            <Space>
              <CalendarOutlined style={{ color: '#1890ff' }} />
              {event.eventDate ? new Date(event.eventDate).toLocaleString() : t('creator.tbd')}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label={t('creator.location')}>
            <Space>
              <EnvironmentOutlined style={{ color: '#52c41a' }} />
              {event.location || t('creator.online')}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label={t('common.category')}>
            <Tag color="blue" style={{ borderRadius: '6px' }}>
              {event.category}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label={t('creator.entry_fee')}>
            {event.isFree ? (
              <Tag color="green" style={{ borderRadius: '6px', padding: '4px 12px' }}>{t('creator.free_event')}</Tag>
            ) : (
              `${event.entryFee || event.registrationFee || 0} ${event.currency || 'XAF'}`
            )}
          </Descriptions.Item>
          <Descriptions.Item label={t('creator.max_attendees')}>
            {event.maxAttendees || t('creator.unlimited')}
          </Descriptions.Item>
          <Descriptions.Item label={t('common.created_at')}>
            {(event as any).createdAt ? new Date((event as any).createdAt).toLocaleString() : '-'}
          </Descriptions.Item>
          <Descriptions.Item label={t('common.updated_at')}>
            {(event as any).updatedAt ? new Date((event as any).updatedAt).toLocaleString() : '-'}
          </Descriptions.Item>
          <Descriptions.Item label={t('common.description')} span={2}>
            {event.description}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Registrations Management */}
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #1890ff 0%, #36cfc9 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <TeamOutlined style={{ fontSize: '20px', color: 'white' }} />
            </div>
            <div>
              <div>{t('creator.event_registrations')}</div>
              {eventRegistrations.length > 0 && (
                <div style={{ fontSize: '13px', color: '#666', fontWeight: 'normal', marginTop: '4px' }}>
                  {eventRegistrations.length} {t('creator.registration')}{eventRegistrations.length !== 1 ? 's' : ''} • {' '}
                  <span style={{ color: '#52c41a' }}>{eventRegistrations.filter((r: any) => r.status?.toLowerCase() === 'confirmed').length} {t('common.confirmed').toLowerCase()}</span>
                </div>
              )}
            </div>
          </div>
        }
        style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          border: "1px solid #f0f0f0",
        }}
      >
        {eventRegistrations.length === 0 && !registrationsLoading ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px',
            background: 'linear-gradient(135deg, #f6f8fb 0%, #ffffff 100%)',
            borderRadius: '12px',
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              <TeamOutlined style={{ fontSize: '40px', color: '#1890ff' }} />
            </div>
            <div style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px', color: '#333' }}>
              {t('creator.no_registrations_for_event')}
            </div>
            <div style={{ fontSize: '14px', color: '#999' }}>
              {t('creator.registrations_will_appear_here')}
            </div>
          </div>
        ) : (
          <Table
            dataSource={eventRegistrations}
            columns={registrationColumns}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} registrations`,
              style: { marginTop: '16px' },
            }}
            size="middle"
            loading={registrationsLoading}
            scroll={{ x: 800 }}
            style={{
              borderRadius: '8px',
            }}
            rowClassName={(record, index) => 
              index % 2 === 0 ? '' : 'ant-table-row-alternate'
            }
          />
        )}
      </Card>
    </div>
  );
}

