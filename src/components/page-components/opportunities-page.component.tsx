"use client";

import BannerComponent from "@components/banner/banner.component";
import { AppFooter } from "@components/footer/footer";
import { AppFootnote } from "@components/footnote/footnote";
import { AppNav } from "@components/nav/nav.component";
import SpinnerList from "@components/shared/spinner-list";
import {
  Col,
  Empty,
  Layout,
  Alert,
  Card,
  Tag,
  Button,
  Row,
  Typography,
  Space,
  Spin,
  Input,
} from "antd";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { IOpportunity } from "@domain/models/opportunity.model";
import {
  CalendarOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  UserOutlined,
  BookOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { opportunityAPI } from "@store/api/opportunity_api";
import { useTranslation } from "@contexts/translation.context";

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;
const { Search } = Input;

export default function OpportunitiesPageComponent() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const {
    data: opportunities,
    error,
    isLoading,
    isFetching,
  } = opportunityAPI.useFetchAllOpportunitiesQuery();

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filteredOpportunities = (opportunities || [])
    .filter((opp) => {
      const matchesFilter = filter === "all" || opp.opp_type === filter;
      const matchesSearch = 
        opp.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        opp.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        opp.companyOrInstitution.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });

  const getOpportunityTypeColor = (type: string) => {
    switch (type) {
      case "scholarship":
        return "green";
      case "job":
        return "blue";
      case "internship":
        return "orange";
      case "fellowship":
        return "purple";
      case "grant":
        return "cyan";
      default:
        return "default";
    }
  };

  const getOpportunityTypeIcon = (type: string) => {
    switch (type) {
      case "scholarship":
        return <BookOutlined />;
      case "job":
        return <UserOutlined />;
      case "internship":
        return <UserOutlined />;
      case "fellowship":
        return <UserOutlined />;
      case "grant":
        return <DollarOutlined />;
      default:
        return <UserOutlined />;
    }
  };

  const formatDeadline = (deadline: string | Date) => {
    const date = new Date(deadline);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
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
    <Layout className="min-h-screen" style={{ backgroundColor: "white" }}>
      <AppNav logoPath="/" />
      <Content style={{ backgroundColor: "white" }}>
        <BannerComponent
          pageTitle={t('nav.opportunities')}
          breadcrumbs={[{ label: t('nav.opportunities'), uri: "opportunities" }]}
        />

        <div className="container py-5" style={{ backgroundColor: "white" }}>
          {/* Filter Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Row justify="center" className="mb-4">
              <Col xs={24} lg={18}>
                <Card
                  className="cumi-card"
                  style={{
                    backgroundColor: "white",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    borderRadius: "12px",
                    overflow: "hidden",
                  }}
                >
                  <div className="text-center">
                    <Title level={4} className="mb-3">
                      {t('opportunities.filter_title')}
                    </Title>
                    
                    {/* Search Input */}
                    <div className="mb-4">
                      <Search
                        placeholder="Search opportunities..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        prefix={<SearchOutlined />}
                        style={{ maxWidth: "400px" }}
                        allowClear
                      />
                    </div>
                    
                    <Space wrap>
                      <Button
                        type={filter === "all" ? "primary" : "default"}
                        onClick={() => setFilter("all")}
                      >
                        {t('opportunities.all_opportunities')}
                      </Button>
                      <Button
                        type={filter === "job" ? "primary" : "default"}
                        onClick={() => setFilter("job")}
                      >
                        {t('opportunities.jobs')}
                      </Button>
                      <Button
                        type={filter === "scholarship" ? "primary" : "default"}
                        onClick={() => setFilter("scholarship")}
                      >
                        {t('opportunities.scholarships')}
                      </Button>
                      <Button
                        type={filter === "internship" ? "primary" : "default"}
                        onClick={() => setFilter("internship")}
                      >
                        {t('opportunities.internships')}
                      </Button>
                      <Button
                        type={filter === "fellowship" ? "primary" : "default"}
                        onClick={() => setFilter("fellowship")}
                      >
                        {t('opportunities.fellowships')}
                      </Button>
                      <Button
                        type={filter === "grant" ? "primary" : "default"}
                        onClick={() => setFilter("grant")}
                      >
                        {t('opportunities.grants')}
                      </Button>
                    </Space>
                  </div>
                </Card>
              </Col>
            </Row>
          </motion.div>

          {/* Opportunities List */}
          {isLoading || isFetching ? (
            <div
              style={{
                textAlign: "center",
                padding: "50px",
                backgroundColor: "white",
                minHeight: "50vh",
              }}
            >
              <Spin size="large" />
              <Text>Loading opportunities...</Text>
            </div>
          ) : error ? (
            <Row justify="center">
              <Col xs={24} lg={18}>
                <Alert
                  message="Error"
                  description={
                    error ? "Failed to load opportunities" : "An error occurred"
                  }
                  type="error"
                  showIcon
                />
              </Col>
            </Row>
          ) : filteredOpportunities.length > 0 ? (
            <Row justify="center" className="align-items-start">
              <Col xs={24} lg={18}>
                <div className="row">
                  {filteredOpportunities.map((opportunity, index) => (
                    <motion.div
                      key={opportunity.id}
                      className="col-sm-6 col-lg-6 mb-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.5,
                        delay: index * 0.1,
                        ease: "easeOut",
                      }}
                      whileHover={{
                        y: -5,
                        transition: { duration: 0.2 },
                      }}
                      style={{ height: "100%" }}
                    >
                      <Card
                        className="cumi-card h-100"
                        hoverable
                        style={{
                          backgroundColor: "white",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                          borderRadius: "12px",
                          overflow: "hidden",
                        }}
                        actions={[
                          <Link
                            key="view"
                            href={`/opportunities/${opportunity.slug}`}
                          >
                            View Details
                          </Link>,
                          <a
                            key="apply"
                            href={opportunity.applicationLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Apply Now
                          </a>,
                        ]}
                      >
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <Tag
                            color={getOpportunityTypeColor(
                              opportunity.opp_type
                            )}
                            icon={getOpportunityTypeIcon(opportunity.opp_type)}
                            className="mb-2"
                          >
                            {opportunity.opp_type.charAt(0).toUpperCase() +
                              opportunity.opp_type.slice(1)}
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
                              <Text>
                                Deadline: {formatDeadline(opportunity.deadline)}
                              </Text>
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

                        <Paragraph ellipsis={{ rows: 3 }} className="mb-3">
                          {opportunity.description}
                        </Paragraph>

                        {opportunity.skills &&
                          opportunity.skills.length > 0 && (
                            <div className="mb-3">
                              <Text strong className="me-2">
                                Skills:
                              </Text>
                              <Space wrap>
                                {opportunity.skills
                                  .slice(0, 3)
                                  .map((skill, index) => (
                                    <Tag key={index}>{skill}</Tag>
                                  ))}
                                {opportunity.skills.length > 3 && (
                                  <Tag>
                                    +{opportunity.skills.length - 3} more
                                  </Tag>
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
      <AppFooter logoPath="/" />
      <AppFootnote />
    </Layout>
  );
}
