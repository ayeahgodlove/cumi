"use client";
import { GithubOutlined, GlobalOutlined, CalendarOutlined, UserOutlined, LinkOutlined, CodeOutlined, RocketOutlined } from "@ant-design/icons";
import { AppFooter } from "@components/footer/footer";
import { AppFootnote } from "@components/footnote/footnote";
import { AppNav } from "@components/nav/nav.component";
import ImageFallback from "@components/shared/image-fallback";
import Share from "@components/shared/share";
import PageContent from "@components/shared/page-content/index";
import { BASE_URL_UPLOADS_MEDIA } from "@constants/api-url";
import { projectAPI } from "@store/api/project_api";
import { userAPI } from "@store/api/user_api";
import { bannerAPI } from "@store/api/banner_api";
import { format } from "@utils/format";
import { Layout, Spin, Card, Row, Col, Typography, Button, Space, Divider, Avatar, Badge } from "antd";
import Link from "next/link";
import { useTranslation } from "@contexts/translation.context";

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

interface ProjectDetailPageComponentProps {
  slug: string;
}

export default function ProjectDetailPageComponent({ slug }: ProjectDetailPageComponentProps) {
  const { t } = useTranslation();
  const {
    data: project,
    isLoading,
    isFetching,
  } = projectAPI.useGetSingleProjectBySlugQuery(slug);

  const { data: user } = userAPI.useGetSingleUserQuery(
    project ? project?.userId : ""
  );

  const {
    data: banners,
    isLoading: isLoadingBanner,
    isFetching: isFetchingBanner,
  } = bannerAPI.useFetchAllBannersQuery(1);

  const loading = isLoading || isFetching || !project || isLoadingBanner || isFetchingBanner;
  return (
    <>
      <div className="container-fluid" style={{ width: "100%" }}>
        {/* navigation bar */}
        <AppNav logoPath="/" />
      </div>
        
      {loading ? (
        <div style={{ minHeight: "65vh", display: "flex", justifyContent: "center", alignItems: "center", padding: '20px' }}>
          <Card style={{ padding: '40px', borderRadius: '16px', textAlign: 'center', maxWidth: '400px' }}>
            <Spin size="large" />
            <div style={{ marginTop: '16px', fontSize: '16px', color: '#666' }}>{t('project_detail.loading')}</div>
          </Card>
        </div>
      ) : (
        <>
        {/* Page Banner */}
        <PageContent
          title={project?.title}
          banner={banners ? (banners.length > 0 ? banners[0].image : "") : ""}
          breadcrumb={[
            {
              title: t('project_detail.projects'),
              link: "/projects",
            },
            {
              title: t('project_detail.details'),
            },
          ]}
        />

        <Content style={{ margin:"4rem 0"}}>
          <section className="section pt-4">
            <div className="container">
              <Row justify="center">
                <Col xs={24} lg={20}>
                  {project && (
                    <Card
                      style={{
                        borderRadius: "16px",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                        border: "none",
                        overflow: "hidden",
                      }}
                      styles={{ body: { padding: 0 } }}
                    >
                      {/* Hero Image */}
                      <div style={{ position: "relative", overflow: "hidden" }}>
                        <ImageFallback
                          src={`${BASE_URL_UPLOADS_MEDIA}/${project.imageUrl}`}
                          height={500}
                          width={1200}
                          alt={project?.title}
                          style={{
                            width: "100%",
                            height: "500px",
                            objectFit: "cover",
                            transition: "transform 0.3s ease",
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.3) 100%)",
                          }}
                        />
                      </div>

                      {/* Content */}
                      <div style={{ padding: "2rem" }}>
                        {/* Project Meta */}
                        <div style={{ marginBottom: "1.5rem" }}>
                          <Space wrap size="middle">
                            {user && (
                              <Space>
                                <Avatar
                                  src={user?.profileImage}
                                  icon={<UserOutlined />}
                                  size="small"
                                />
                                <Text strong style={{ color: "#1890ff" }}>
                                  {user?.username}
                                </Text>
                              </Space>
                            )}
                            
                            <Space>
                              <CalendarOutlined style={{ color: "#52c41a" }} />
                              <Text type="secondary">
                                {format.date(project.createdAt)}
                              </Text>
                            </Space>
                          </Space>
                        </div>

                        {/* Title */}
                        <Title level={1} style={{ 
                          marginBottom: "1.5rem",
                          fontSize: "2.5rem",
                          fontWeight: "700",
                          lineHeight: "1.2",
                          color: "#1a1a1a"
                        }}>
                          {project?.title}
                        </Title>

                        {/* Action Buttons */}
                        <div style={{ marginBottom: "2rem" }}>
                          <Space size="large" wrap>
                            <Link
                              href={project?.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ textDecoration: "none" }}
                            >
                              <Button
                                type="primary"
                                size="large"
                                icon={<GithubOutlined />}
                                style={{
                                  borderRadius: "8px",
                                  height: "48px",
                                  paddingLeft: "24px",
                                  paddingRight: "24px",
                                  backgroundColor: "#24292e",
                                  borderColor: "#24292e",
                                }}
                              >
                                {t('project_detail.view_source')}
                              </Button>
                            </Link>
                            
                            <Link
                              href={project?.deployUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ textDecoration: "none" }}
                            >
                              <Button
                                type="primary"
                                size="large"
                                icon={<RocketOutlined />}
                                style={{
                                  borderRadius: "8px",
                                  height: "48px",
                                  paddingLeft: "24px",
                                  paddingRight: "24px",
                                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                  borderColor: "transparent",
                                }}
                              >
                                {t('project_detail.live_demo')}
                              </Button>
                            </Link>
                          </Space>
                        </div>

                        <Divider style={{ margin: "2rem 0" }} />

                        {/* Project Information Card */}
                        <Card
                          style={{
                            marginBottom: "2rem",
                            borderRadius: "12px",
                            background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                            border: "none",
                          }}
                          styles={{ body: { padding: "1.5rem" } }}
                        >
                          <Row gutter={[24, 16]}>
                            <Col xs={24} sm={12} md={8}>
                              <Space direction="vertical" size={4}>
                                <Space>
                                  <LinkOutlined style={{ color: "#1890ff", fontSize: "18px" }} />
                                  <Text strong>{t('project_detail.source_code')}</Text>
                                </Space>
                                <Link
                                  href={project?.githubUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{ 
                                    fontSize: "13px",
                                    wordBreak: "break-all",
                                  }}
                                >
                                  {project?.githubUrl.replace('https://', '')}
                                </Link>
                              </Space>
                            </Col>
                            
                            <Col xs={24} sm={12} md={8}>
                              <Space direction="vertical" size={4}>
                                <Space>
                                  <GlobalOutlined style={{ color: "#52c41a", fontSize: "18px" }} />
                                  <Text strong>{t('project_detail.live_url')}</Text>
                                </Space>
                                <Link
                                  href={project?.deployUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{ 
                                    fontSize: "13px",
                                    wordBreak: "break-all",
                                  }}
                                >
                                  {project?.deployUrl.replace('https://', '')}
                                </Link>
                              </Space>
                            </Col>
                            
                            <Col xs={24} sm={12} md={8}>
                              <Space direction="vertical" size={4}>
                                <Space>
                                  <CalendarOutlined style={{ color: "#faad14", fontSize: "18px" }} />
                                  <Text strong>{t('project_detail.created')}</Text>
                                </Space>
                                <Text style={{ fontSize: "13px" }}>
                                  {format.date(project.createdAt)}
                                </Text>
                              </Space>
                            </Col>
                          </Row>
                        </Card>

                        {/* Description Section */}
                        <div style={{ marginBottom: "2rem" }}>
                          <Title level={3} style={{ 
                            marginBottom: "1rem",
                            fontSize: "1.8rem",
                            fontWeight: "600",
                            color: "#1a1a1a"
                          }}>
                            {t('project_detail.about_project')}
                          </Title>
                          <div
                            style={{
                              fontSize: "1.1rem",
                              lineHeight: "1.8",
                              color: "#333",
                            }}
                            dangerouslySetInnerHTML={{
                              __html: project?.description as any,
                            }}
                          />
                        </div>

                        <Divider style={{ margin: "2rem 0" }} />

                        {/* Share Section - Modern Design */}
                        <Share
                          title={project?.title as any}
                          description={project?.description}
                          slug={project?.slug!}
                          type="projects"
                          showModern={true}
                        />
                      </div>
                    </Card>
                  )}
                </Col>
              </Row>
            </div>
          </section>
        </Content>
        
        <AppFooter logoPath="/" />
        <AppFootnote />
        </>
      )}
    </>
  );
}
