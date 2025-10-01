"use client";

import BannerComponent from "@components/banner/banner.component";
import { AppFooter } from "@components/footer/footer";
import { AppFootnote } from "@components/footnote/footnote";
import { AppNav } from "@components/nav/nav.component";
import {
  Col,
  Layout,
  Alert,
  Card,
  Tag,
  Button,
  Row,
  Typography,
  Space,
  Divider,
  Spin,
} from "antd";
import { motion } from "framer-motion";
import { IOpportunity } from "@domain/models/opportunity.model";
import {
  CalendarOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  UserOutlined,
  BookOutlined,
  MailOutlined,
  LinkOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { opportunityAPI } from "@store/api/opportunity_api";
import { useTranslation } from "@contexts/translation.context";

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

interface OpportunityDetailPageComponentProps {
  opportunitySlug: string;
}

export default function OpportunityDetailPageComponent({ opportunitySlug }: OpportunityDetailPageComponentProps) {
  const { t } = useTranslation();

  const {
    data: opportunity,
    error,
    isLoading,
    isFetching,
  } = opportunityAPI.useGetSingleOpportunityBySlugQuery(opportunitySlug);

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

  if (isLoading || isFetching) {
    return (
      <Layout className="min-h-screen" style={{ backgroundColor: "white" }}>
        <AppNav logoPath="/" />
        <Content
          className="d-flex align-items-center justify-content-center"
          style={{ backgroundColor: "white" }}
        >
          <div className="text-center">
            <Spin size="large" />
            <p className="mt-3">{t("opportunity_detail.loading")}</p>
          </div>
        </Content>
      </Layout>
    );
  }

  if (error || !opportunity) {
    return (
      <Layout className="min-h-screen" style={{ backgroundColor: "white" }}>
        <AppNav logoPath="/" />
        <Content style={{ backgroundColor: "white" }}>
          <BannerComponent
            pageTitle={t("opportunity_detail.not_found")}
            breadcrumbs={[
              { label: "Opportunities", uri: "opportunities" },
              { label: "Not Found", uri: "" },
            ]}
          />
          <div className="container py-5" style={{ backgroundColor: "white" }}>
            <Row justify="center">
              <Col xs={24} lg={18}>
                <Alert
                  message={t("opportunity_detail.error")}
                  description={
                    error
                      ? t("opportunity_detail.failed_load")
                      : t("opportunity_detail.not_found_desc")
                  }
                  type="error"
                  showIcon
                />
              </Col>
            </Row>
          </div>
        </Content>
        <AppFooter logoPath="/" />
      </Layout>
    );
  }

  return (
    <Layout className="min-h-screen" style={{ backgroundColor: "white" }}>
      <AppNav logoPath="/" />
      <Content style={{ backgroundColor: "white" }}>
        <BannerComponent
          pageTitle={opportunity.title}
          breadcrumbs={[
            { label: "Opportunities", uri: "opportunities" },
            { label: opportunity.title, uri: "" },
          ]}
        />

        <div className="container py-5" style={{ backgroundColor: "white" }}>
          <Row justify="center">
            <Col xs={24} lg={18}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card
                  className="cumi-card mb-4"
                  style={{
                    backgroundColor: "white",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    borderRadius: "12px",
                    overflow: "hidden",
                  }}
                >
                  <div className="d-flex justify-content-between align-items-start mb-4">
                    <Tag
                      color={getOpportunityTypeColor(opportunity.opp_type)}
                      icon={getOpportunityTypeIcon(opportunity.opp_type)}
                      className="mb-2"
                    >
                      {opportunity.opp_type.charAt(0).toUpperCase() +
                        opportunity.opp_type.slice(1)}
                    </Tag>
                    {isDeadlineNear(opportunity.deadline) && (
                      <Tag color="red" icon={<ClockCircleOutlined />}>
                        {t("opportunity_detail.deadline_soon")}
                      </Tag>
                    )}
                  </div>

                  <Title level={2} className="mb-3">
                    {opportunity.title}
                  </Title>

                  <Paragraph className="fs-5 text-muted mb-4">
                    {opportunity.companyOrInstitution}
                  </Paragraph>

                  <Row gutter={[16, 16]} className="mb-4">
                    <Col xs={24} sm={12} md={6}>
                      <div className="d-flex align-items-center">
                        <EnvironmentOutlined className="me-2 text-primary" />
                        <div>
                          <Text strong>{t("opportunity_detail.location")}</Text>
                          <br />
                          <Text>{opportunity.location}</Text>
                        </div>
                      </div>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                      <div className="d-flex align-items-center">
                        <CalendarOutlined className="me-2 text-primary" />
                        <div>
                          <Text strong>{t("opportunity_detail.deadline")}</Text>
                          <br />
                          <Text>{formatDeadline(opportunity.deadline)}</Text>
                        </div>
                      </div>
                    </Col>
                    {(opportunity.amount || opportunity.salaryRange) && (
                      <Col xs={24} sm={12} md={6}>
                        <div className="d-flex align-items-center">
                          <DollarOutlined className="me-2 text-primary" />
                          <div>
                            <Text strong>
                              {opportunity.opp_type === "scholarship"
                                ? t("opportunity_detail.amount")
                                : t("opportunity_detail.salary")}
                            </Text>
                            <br />
                            <Text>
                              {opportunity.amount || opportunity.salaryRange}
                            </Text>
                          </div>
                        </div>
                      </Col>
                    )}
                    {opportunity.duration && (
                      <Col xs={24} sm={12} md={6}>
                        <div className="d-flex align-items-center">
                          <ClockCircleOutlined className="me-2 text-primary" />
                          <div>
                            <Text strong>{t("opportunity_detail.duration")}</Text>
                            <br />
                            <Text>{opportunity.duration}</Text>
                          </div>
                        </div>
                      </Col>
                    )}
                  </Row>

                  <Divider />

                  <div className="mb-4">
                    <Title level={4}>{t("opportunity_detail.description")}</Title>
                    <Paragraph className="fs-6">
                      {opportunity.description}
                    </Paragraph>
                  </div>

                  <div className="mb-4">
                    <Title level={4}>{t("opportunity_detail.requirements")}</Title>
                    <Paragraph className="fs-6">
                      {opportunity.requirements}
                    </Paragraph>
                  </div>

                  {/* Scholarship-specific fields */}
                  {opportunity.opp_type === "scholarship" && (
                    <>
                      {opportunity.academicLevel && (
                        <div className="mb-4">
                          <Title level={4}>Academic Level</Title>
                          <Text className="fs-6">
                            {opportunity.academicLevel}
                          </Text>
                        </div>
                      )}
                      {opportunity.fieldOfStudy && (
                        <div className="mb-4">
                          <Title level={4}>Field of Study</Title>
                          <Text className="fs-6">
                            {opportunity.fieldOfStudy}
                          </Text>
                        </div>
                      )}
                      {opportunity.nationality && (
                        <div className="mb-4">
                          <Title level={4}>{t("opportunity_detail.nationality_req")}</Title>
                          <Text className="fs-6">
                            {opportunity.nationality}
                          </Text>
                        </div>
                      )}
                      {opportunity.ageLimit && (
                        <div className="mb-4">
                          <Title level={4}>Age Limit</Title>
                          <Text className="fs-6">
                            {opportunity.ageLimit} years
                          </Text>
                        </div>
                      )}
                    </>
                  )}

                  {/* Job-specific fields */}
                  {opportunity.opp_type === "job" && (
                    <>
                      {opportunity.employmentType && (
                        <div className="mb-4">
                          <Title level={4}>{t("opportunity_detail.employment_type")}</Title>
                          <Text className="fs-6">
                            {opportunity.employmentType}
                          </Text>
                        </div>
                      )}
                      {opportunity.experienceLevel && (
                        <div className="mb-4">
                          <Title level={4}>Experience Level</Title>
                          <Text className="fs-6">
                            {opportunity.experienceLevel}
                          </Text>
                        </div>
                      )}
                      {opportunity.department && (
                        <div className="mb-4">
                          <Title level={4}>Department</Title>
                          <Text className="fs-6">{opportunity.department}</Text>
                        </div>
                      )}
                      {opportunity.isRemote !== undefined && (
                        <div className="mb-4">
                          <Title level={4}>Remote Work</Title>
                          <Text className="fs-6">
                            {opportunity.isRemote ? "Yes" : "No"}
                          </Text>
                        </div>
                      )}
                    </>
                  )}

                  {opportunity.skills && opportunity.skills.length > 0 && (
                    <div className="mb-4">
                      <Title level={4}>Required Skills</Title>
                      <Space wrap>
                        {opportunity.skills.map((skill, index) => (
                          <Tag key={index} color="blue">
                            {skill}
                          </Tag>
                        ))}
                      </Space>
                    </div>
                  )}

                  <Divider />

                  <div className="text-center">
                    <Space size="large">
                      <Button
                        type="primary"
                        size="large"
                        icon={<LinkOutlined />}
                        href={opportunity.applicationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {t("opportunity_detail.apply_now")}
                      </Button>
                      <Button
                        size="large"
                        icon={<MailOutlined />}
                        href={`mailto:${opportunity.contactEmail}`}
                      >
                        Contact
                      </Button>
                    </Space>
                  </div>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </div>
      </Content>
      <AppFooter logoPath="/" />
      <AppFootnote />
    </Layout>
  );
}
