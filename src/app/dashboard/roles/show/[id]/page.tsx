"use client";

import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import { Show, useShow } from "@refinedev/antd";
import { Typography, Space, Tag, Card, Row, Col, Divider } from "antd";
import { SafetyOutlined, InfoCircleOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

export default function RoleShow() {
  const { queryResult } = useShow({});
  const { data, isLoading } = queryResult;
  const record = data?.data;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!record) {
    return <div>Role not found</div>;
  }

  return (
    <>
      <PageBreadCrumbs items={["Roles", "Show"]} />
      <Show>
        <Card>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <div style={{ textAlign: 'center' }}>
                <SafetyOutlined style={{ fontSize: 64, color: '#1890ff', marginBottom: 16 }} />
                <Title level={3} style={{ marginBottom: 8 }}>
                  {record.name}
                </Title>
                <div style={{ marginTop: 16 }}>
                  <Tag color={record.isActive ? "green" : "red"} style={{ fontSize: 14 }}>
                    {record.isActive ? "Active" : "Inactive"}
                  </Tag>
                </div>
              </div>
            </Col>

            <Col xs={24} md={16}>
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div>
                  <Title level={4}>Role Information</Title>
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12}>
                      <Space>
                        <InfoCircleOutlined />
                        <Text strong>Priority Level:</Text>
                        <Text>{record.priority}</Text>
                      </Space>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Space>
                        {record.isActive ? <CheckCircleOutlined style={{ color: 'green' }} /> : <CloseCircleOutlined style={{ color: 'red' }} />}
                        <Text strong>Status:</Text>
                        <Text>{record.isActive ? 'Active' : 'Inactive'}</Text>
                      </Space>
                    </Col>
                  </Row>
                </div>

                <div>
                  <Title level={4}>Description</Title>
                  <Paragraph>{record.description}</Paragraph>
                </div>

                {record.permissions && (
                  <div>
                    <Title level={4}>Permissions</Title>
                    <div>
                      {record.permissions.split(',').map((permission: string, index: number) => (
                        <Tag key={index} color="blue" style={{ margin: '4px' }}>
                          {permission.trim()}
                        </Tag>
                      ))}
                    </div>
                  </div>
                )}

                <Divider />

                <div>
                  <Title level={4}>Role Details</Title>
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12}>
                      <Text strong>Created:</Text>
                      <br />
                      <Text type="secondary">
                        {record.createdAt ? new Date(record.createdAt).toLocaleDateString() : 'Not available'}
                      </Text>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Text strong>Last Updated:</Text>
                      <br />
                      <Text type="secondary">
                        {record.updatedAt ? new Date(record.updatedAt).toLocaleDateString() : 'Not available'}
                      </Text>
                    </Col>
                  </Row>
                </div>
              </Space>
            </Col>
          </Row>
        </Card>
      </Show>
    </>
  );
}
