"use client";

import BannerComponent from "@components/banner/banner.component";
import { AppFooter } from "@components/footer/footer";
import { AppFootnote } from "@components/footnote/footnote";
import { AppNav } from "@components/nav/nav.component";
import SpinnerList from "@components/shared/spinner-list";
import { Col, Empty, Layout, Alert, Card, Tag, Button, Row, Typography, Space } from "antd";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { IOpportunity } from "@domain/models/opportunity.model";
import { CalendarOutlined, EnvironmentOutlined, DollarOutlined, UserOutlined, BookOutlined } from "@ant-design/icons";
import Link from "next/link";

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

export default function OpportunitiesPageComponent() {
  const [opportunities, setOpportunities] = useState<IOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/opportunities');
        if (!response.ok) {
          throw new Error('Failed to fetch opportunities');
        }
        const data = await response.json();
        setOpportunities(data.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  const filteredOpportunities = filter === 'all' 
    ? opportunities 
    : opportunities.filter(opp => opp.opp_type === filter);

  const getOpportunityTypeColor = (type: string) => {
    switch (type) {
      case 'scholarship': return 'green';
      case 'job': return 'blue';
      case 'internship': return 'orange';
      case 'fellowship': return 'purple';
      case 'grant': return 'cyan';
      default: return 'default';
    }
  };

  const getOpportunityTypeIcon = (type: string) => {
    switch (type) {
      case 'scholarship': return <BookOutlined />;
      case 'job': return <UserOutlined />;
      case 'internship': return <UserOutlined />;
      case 'fellowship': return <UserOutlined />;
      case 'grant': return <DollarOutlined />;
      default: return <UserOutlined />;
    }
  };

  const formatDeadline = (deadline: string | Date) => {
    const date = new Date(deadline);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isDeadlineNear = (deadline: string | Date) => {
    const date = new Date(deadline);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  };

  return (
    <Layout className="min-h-screen">
      <AppNav logoPath="/" />
      <Content>
        <BannerComponent 
          pageTitle="Opportunities" 
          breadcrumbs={[{ label: "Opportunities", uri: "opportunities" }]}
        />
        
        <div className="container py-5">
          {/* Filter Section */}
          <Row justify="center" className="mb-4">
            <Col xs={24} lg={18}>
              <Card className="cumi-card">
                <div className="text-center">
                  <Title level={4} className="mb-3">Filter Opportunities</Title>
                  <Space wrap>
                    <Button 
                      type={filter === 'all' ? 'primary' : 'default'}
                      onClick={() => setFilter('all')}
                    >
                      All Opportunities
                    </Button>
                    <Button 
                      type={filter === 'job' ? 'primary' : 'default'}
                      onClick={() => setFilter('job')}
                    >
                      Jobs
                    </Button>
                    <Button 
                      type={filter === 'scholarship' ? 'primary' : 'default'}
                      onClick={() => setFilter('scholarship')}
                    >
                      Scholarships
                    </Button>
                    <Button 
                      type={filter === 'internship' ? 'primary' : 'default'}
                      onClick={() => setFilter('internship')}
                    >
                      Internships
                    </Button>
                    <Button 
                      type={filter === 'fellowship' ? 'primary' : 'default'}
                      onClick={() => setFilter('fellowship')}
                    >
                      Fellowships
                    </Button>
                    <Button 
                      type={filter === 'grant' ? 'primary' : 'default'}
                      onClick={() => setFilter('grant')}
                    >
                      Grants
                    </Button>
                  </Space>
                </div>
              </Card>
            </Col>
          </Row>

          {/* Opportunities List */}
          {loading ? (
            <SpinnerList />
          ) : error ? (
            <Row justify="center">
              <Col xs={24} lg={18}>
                <Alert
                  message="Error"
                  description={error}
                  type="error"
                  showIcon
                />
              </Col>
            </Row>
          ) : filteredOpportunities.length > 0 ? (
            <Row justify="center" className="align-items-start">
              <Col xs={24} lg={18}>
                <div className="row">
                  {filteredOpportunities.map((opportunity) => (
                    <motion.div
                      key={opportunity.id}
                      className="col-sm-6 col-lg-6 mb-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Card 
                        className="cumi-card h-100"
                        hoverable
                        actions={[
                          <Link key="view" href={`/opportunities/${opportunity.id}`}>
                            View Details
                          </Link>,
                          <a key="apply" href={opportunity.applicationLink} target="_blank" rel="noopener noreferrer">
                            Apply Now
                          </a>
                        ]}
                      >
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <Tag 
                            color={getOpportunityTypeColor(opportunity.opp_type)}
                            icon={getOpportunityTypeIcon(opportunity.opp_type)}
                            className="mb-2"
                          >
                            {opportunity.opp_type.charAt(0).toUpperCase() + opportunity.opp_type.slice(1)}
                          </Tag>
                          {isDeadlineNear(opportunity.deadline) && (
                            <Tag color="red">Deadline Soon</Tag>
                          )}
                        </div>

                        <Title level={4} className="mb-2">
                          <Link href={`/opportunities/${opportunity.id}`}>
                            {opportunity.title}
                          </Link>
                        </Title>

                        <Paragraph className="text-muted mb-3">
                          {opportunity.companyOrInstitution}
                        </Paragraph>

                        <div className="mb-3">
                          <Space direction="vertical" size="small">
                            <div>
                              <EnvironmentOutlined className="me-2" />
                              <Text>{opportunity.location}</Text>
                            </div>
                            <div>
                              <CalendarOutlined className="me-2" />
                              <Text>Deadline: {formatDeadline(opportunity.deadline)}</Text>
                            </div>
                            {opportunity.amount && (
                              <div>
                                <DollarOutlined className="me-2" />
                                <Text strong>{opportunity.amount}</Text>
                              </div>
                            )}
                            {opportunity.salaryRange && (
                              <div>
                                <DollarOutlined className="me-2" />
                                <Text strong>{opportunity.salaryRange}</Text>
                              </div>
                            )}
                          </Space>
                        </div>

                        <Paragraph 
                          ellipsis={{ rows: 3 }}
                          className="mb-3"
                        >
                          {opportunity.description}
                        </Paragraph>

                        {opportunity.skills && opportunity.skills.length > 0 && (
                          <div className="mb-3">
                            <Text strong className="me-2">Skills:</Text>
                            <Space wrap>
                              {opportunity.skills.slice(0, 3).map((skill, index) => (
                                <Tag key={index} size="small">{skill}</Tag>
                              ))}
                              {opportunity.skills.length > 3 && (
                                <Tag size="small">+{opportunity.skills.length - 3} more</Tag>
                              )}
                            </Space>
                          </div>
                        )}
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </Col>
            </Row>
          ) : (
            <Row justify="center">
              <Col xs={24} lg={18}>
                <Empty
                  description="No opportunities found"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              </Col>
            </Row>
          )}
        </div>
      </Content>
      <AppFootnote />
      <AppFooter />
    </Layout>
  );
}
