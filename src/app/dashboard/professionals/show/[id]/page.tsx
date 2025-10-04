"use client";

import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import { Show } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography, Space, Tag, Avatar, Card, Row, Col, Divider } from "antd";
import { UserOutlined, MailOutlined, PhoneOutlined, EnvironmentOutlined, LinkOutlined, GithubOutlined, TwitterOutlined } from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

export default function ProfessionalShow() {
  const { queryResult } = useShow({});
  const { data, isLoading } = queryResult;
  const record = data?.data;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!record) {
    return <div>Professional not found</div>;
  }

  return (
    <>
      <PageBreadCrumbs items={["Professionals", "Show"]} />
      <Show>
        <Card>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <div style={{ textAlign: 'center' }}>
                <Avatar
                  size={120}
                  src={record.avatar || null}
                  icon={<UserOutlined />}
                  style={{ marginBottom: 16 }}
                />
                <Title level={3} style={{ marginBottom: 8 }}>
                  {record.name}
                </Title>
                <Text type="secondary" style={{ fontSize: 16 }}>
                  {record.title}
                </Text>
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
                  <Title level={4}>Professional Information</Title>
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12}>
                      <Space>
                        <EnvironmentOutlined />
                        <Text strong>Company:</Text>
                        <Text>{record.company}</Text>
                      </Space>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Space>
                        <EnvironmentOutlined />
                        <Text strong>Location:</Text>
                        <Text>{record.location}</Text>
                      </Space>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Space>
                        <MailOutlined />
                        <Text strong>Email:</Text>
                        <Text>{record.email}</Text>
                      </Space>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Space>
                        <PhoneOutlined />
                        <Text strong>Phone:</Text>
                        <Text>{record.phone || 'Not provided'}</Text>
                      </Space>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Space>
                        <Text strong>Experience:</Text>
                        <Text>{record.experience || 'Not specified'}</Text>
                      </Space>
                    </Col>
                  </Row>
                </div>

                {record.bio && (
                  <div>
                    <Title level={4}>Bio</Title>
                    <Paragraph>{record.bio}</Paragraph>
                  </div>
                )}

                {record.skills && (
                  <div>
                    <Title level={4}>Skills</Title>
                    <div>
                      {record.skills.split(',').map((skill: string, index: number) => (
                        <Tag key={index} color="blue" style={{ margin: '4px' }}>
                          {skill.trim()}
                        </Tag>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <Title level={4}>Social Links</Title>
                  <Space direction="vertical" size="small">
                    {record.linkedinUrl && (
                      <Space>
                        <LinkOutlined />
                        <Text strong>LinkedIn:</Text>
                        <a href={record.linkedinUrl} target="_blank" rel="noopener noreferrer">
                          {record.linkedinUrl}
                        </a>
                      </Space>
                    )}
                    {record.githubUrl && (
                      <Space>
                        <GithubOutlined />
                        <Text strong>GitHub:</Text>
                        <a href={record.githubUrl} target="_blank" rel="noopener noreferrer">
                          {record.githubUrl}
                        </a>
                      </Space>
                    )}
                    {record.twitterUrl && (
                      <Space>
                        <TwitterOutlined />
                        <Text strong>Twitter:</Text>
                        <a href={record.twitterUrl} target="_blank" rel="noopener noreferrer">
                          {record.twitterUrl}
                        </a>
                      </Space>
                    )}
                    {!record.linkedinUrl && !record.githubUrl && !record.twitterUrl && (
                      <Text type="secondary">No social links provided</Text>
                    )}
                  </Space>
                </div>
              </Space>
            </Col>
          </Row>
        </Card>
      </Show>
    </>
  );
}
