"use client";

import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import { Show, useShow } from "@refinedev/antd";
import { Typography, Row, Col, Card, Tag, Space, Divider } from "antd";
import { MailOutlined, CalendarOutlined, UserOutlined } from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

export default function SubscribeShow() {
  const { queryResult } = useShow();
  const { data, isLoading } = queryResult;
  const record = data?.data;

  return (
    <>
      <PageBreadCrumbs items={["Subscribers", "Show"]} />
      <Show isLoading={isLoading}>
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <Card title="Subscriber Details" className="mb-4">
              <Title level={3} className="mb-3">{record?.name || 'Anonymous'}</Title>
              
              <Divider />
              
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <div className="d-flex align-items-center mb-3">
                    <MailOutlined className="me-2 text-primary" />
                    <Text strong>Email:</Text>
                    <Text className="ms-2">{record?.email}</Text>
                  </div>
                </Col>
                <Col xs={24} sm={12}>
                  <div className="d-flex align-items-center mb-3">
                    <CalendarOutlined className="me-2 text-primary" />
                    <Text strong>Subscribed:</Text>
                    <Text className="ms-2">{new Date(record?.subscribedAt).toLocaleDateString()}</Text>
                  </div>
                </Col>
                <Col xs={24} sm={12}>
                  <div className="d-flex align-items-center mb-3">
                    <UserOutlined className="me-2 text-primary" />
                    <Text strong>Status:</Text>
                    <Tag color={record?.isActive ? "green" : "red"} className="ms-2">
                      {record?.isActive ? "Active" : "Inactive"}
                    </Tag>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
          
          <Col xs={24} lg={8}>
            <Card title="Subscription Info">
              <Space direction="vertical" size="middle" className="w-100">
                <div className="d-flex justify-content-between">
                  <Text strong>Created:</Text>
                  <Text>{new Date(record?.createdAt).toLocaleDateString()}</Text>
                </div>
                <div className="d-flex justify-content-between">
                  <Text strong>Last Updated:</Text>
                  <Text>{new Date(record?.updatedAt).toLocaleDateString()}</Text>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>
      </Show>
    </>
  );
}
