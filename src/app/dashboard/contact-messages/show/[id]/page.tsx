"use client";

import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import { Show } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography, Row, Col, Card, Tag, Space, Divider, Button } from "antd";
import { MailOutlined, PhoneOutlined, CalendarOutlined, UserOutlined, MessageOutlined } from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

export default function ContactMessageShow() {
  const { queryResult } = useShow();
  const { data, isLoading } = queryResult;
  const record = data?.data;

  return (
    <>
      <PageBreadCrumbs items={["Contact Messages", "Show"]} />
      <Show isLoading={isLoading}>
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <Card title="Message Details" className="mb-4">
              <Title level={3} className="mb-3">{record?.subject}</Title>
              
              <Divider />
              
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <div className="d-flex align-items-center mb-3">
                    <UserOutlined className="me-2 text-primary" />
                    <Text strong>Name:</Text>
                    <Text className="ms-2">{record?.name}</Text>
                  </div>
                </Col>
                <Col xs={24} sm={12}>
                  <div className="d-flex align-items-center mb-3">
                    <MailOutlined className="me-2 text-primary" />
                    <Text strong>Email:</Text>
                    <Text className="ms-2">{record?.email}</Text>
                  </div>
                </Col>
                {record?.phone && (
                  <Col xs={24} sm={12}>
                    <div className="d-flex align-items-center mb-3">
                      <PhoneOutlined className="me-2 text-primary" />
                      <Text strong>Phone:</Text>
                      <Text className="ms-2">{record.phone}</Text>
                    </div>
                  </Col>
                )}
                <Col xs={24} sm={12}>
                  <div className="d-flex align-items-center mb-3">
                    <CalendarOutlined className="me-2 text-primary" />
                    <Text strong>Received:</Text>
                    <Text className="ms-2">{new Date(record?.createdAt).toLocaleDateString()}</Text>
                  </div>
                </Col>
              </Row>
            </Card>

            <Card title="Message Content">
              <div className="d-flex align-items-center mb-3">
                <MessageOutlined className="me-2 text-primary" />
                <Text strong>Message:</Text>
              </div>
              <Paragraph className="fs-6 bg-light p-3 rounded">
                {record?.message}
              </Paragraph>
            </Card>
          </Col>
          
          <Col xs={24} lg={8}>
            <Card title="Message Status" className="mb-4">
              <Space direction="vertical" size="middle" className="w-100">
                <div className="d-flex justify-content-between">
                  <Text strong>Status:</Text>
                  <Tag color={record?.isRead ? "green" : "orange"}>
                    {record?.isRead ? "Read" : "Unread"}
                  </Tag>
                </div>
                {record?.repliedAt && (
                  <div className="d-flex justify-content-between">
                    <Text strong>Replied:</Text>
                    <Text>{new Date(record.repliedAt).toLocaleDateString()}</Text>
                  </div>
                )}
              </Space>
            </Card>

            <Card title="Quick Actions">
              <Space direction="vertical" size="middle" className="w-100">
                <Button 
                  type="primary" 
                  block 
                  icon={<MailOutlined />}
                  href={`mailto:${record?.email}?subject=Re: ${record?.subject}`}
                >
                  Reply via Email
                </Button>
                {record?.phone && (
                  <Button 
                    block 
                    icon={<PhoneOutlined />}
                    href={`tel:${record.phone}`}
                  >
                    Call
                  </Button>
                )}
              </Space>
            </Card>
          </Col>
        </Row>
      </Show>
    </>
  );
}
