"use client";

import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import { Show } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography, Row, Col, Card, Tag, Avatar, Space, Divider } from "antd";
import { BASE_URL_UPLOADS_MEDIA } from "@constants/api-url";
import { MailOutlined, PhoneOutlined, EnvironmentOutlined, LinkedinOutlined, GithubOutlined, TwitterOutlined } from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

export default function TeamShow() {
  const { queryResult } = useShow();
  const { data, isLoading } = queryResult;
  const record = data?.data;

  return (
    <>
      <PageBreadCrumbs items={["Team", "Show"]} />
      <Show isLoading={isLoading}>
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={8}>
            <Card className="text-center">
              <Avatar
                size={120}
                src={record?.avatar ? `${BASE_URL_UPLOADS_MEDIA}/${record.avatar}` : "/img/avatar.png"}
                alt={record?.name}
                className="mb-3"
              />
              <Title level={3} className="mb-2">{record?.name}</Title>
              <Text type="secondary" className="mb-3 d-block">{record?.role}</Text>
              <Text strong className="mb-4 d-block">{record?.position}</Text>
              
              <Divider />
              
              <Space direction="vertical" size="middle" className="w-100">
                {record?.email && (
                  <div className="d-flex align-items-center justify-content-center">
                    <MailOutlined className="me-2 text-primary" />
                    <Text>{record.email}</Text>
                  </div>
                )}
                {record?.phone && (
                  <div className="d-flex align-items-center justify-content-center">
                    <PhoneOutlined className="me-2 text-primary" />
                    <Text>{record.phone}</Text>
                  </div>
                )}
                {record?.location && (
                  <div className="d-flex align-items-center justify-content-center">
                    <EnvironmentOutlined className="me-2 text-primary" />
                    <Text>{record.location}</Text>
                  </div>
                )}
              </Space>

              <Divider />

              <Space size="large">
                {record?.linkedin && (
                  <a href={record.linkedin} target="_blank" rel="noopener noreferrer">
                    <LinkedinOutlined style={{ fontSize: '24px', color: '#0077b5' }} />
                  </a>
                )}
                {record?.github && (
                  <a href={record.github} target="_blank" rel="noopener noreferrer">
                    <GithubOutlined style={{ fontSize: '24px', color: '#333' }} />
                  </a>
                )}
                {record?.twitter && (
                  <a href={record.twitter} target="_blank" rel="noopener noreferrer">
                    <TwitterOutlined style={{ fontSize: '24px', color: '#1da1f2' }} />
                  </a>
                )}
              </Space>
            </Card>
          </Col>
          
          <Col xs={24} lg={16}>
            <Card title="Team Member Details" className="mb-4">
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <Text strong>Experience:</Text>
                  <br />
                  <Text>{record?.experience}</Text>
                </Col>
                <Col xs={24} sm={12}>
                  <Text strong>Education:</Text>
                  <br />
                  <Text>{record?.education || 'Not specified'}</Text>
                </Col>
                <Col xs={24}>
                  <Text strong>Bio:</Text>
                  <br />
                  <Paragraph>{record?.bio}</Paragraph>
                </Col>
              </Row>
            </Card>

            <Card title="Skills">
              <Space wrap>
                {record?.skills?.map((skill: string, index: number) => (
                  <Tag key={index} color="blue" className="mb-2">
                    {skill}
                  </Tag>
                ))}
              </Space>
            </Card>
          </Col>
        </Row>
      </Show>
    </>
  );
}
