"use client";
import React from "react";
import { Authenticated } from "@refinedev/core";
import { NavigateToResource } from "@refinedev/nextjs-router";
import {
  Col,
  Row,
  Card,
  Statistic,
  Typography,
  Space,
  Progress,
  Table,
  Tag,
  Avatar,
  Button,
  Spin,
} from "antd";
import { TbUsersGroup } from "react-icons/tb";
import { GrArticle } from "react-icons/gr";
import { FcInvite } from "react-icons/fc";
import { SiGooglemessages } from "react-icons/si";
import {
  BookOutlined,
  CalendarOutlined,
  ProjectOutlined,
  TrophyOutlined,
  MessageOutlined,
  UserOutlined,
  RiseOutlined,
  FallOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import { useSession } from "next-auth/react";
import { useTranslation } from "@contexts/translation.context";
import { statsAPI } from "@store/api/stats_api";

const { Title, Text } = Typography;

export default function AdminDashboard() {
  const { data: session } = useSession();
  const { t } = useTranslation();

  // Fetch real stats data with auto-refresh for admin dashboard
  const statsQuery = statsAPI.useGetDashboardStatsQuery(undefined, {
    pollingInterval: 30000, // Auto-refresh every 30 seconds
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const {
    data: statsData,
    isLoading: isLoadingStats,
    isFetching: isFetchingStats,
    error: statsError,
    refetch: refetchStats,
  } = statsQuery;

  // Use real stats data or fallback to 0
  const stats = statsData?.overview || {
    totalUsers: 0,
    totalPosts: 0,
    totalEvents: 0,
    totalMessages: 0,
    totalCourses: 0,
    totalProjects: 0,
    totalProfessionals: 0,
    totalOpportunities: 0,
    totalServices: 0,
    totalBanners: 0,
    totalMedia: 0,
    totalSubscribers: 0,
  };

  const loading = isLoadingStats || isFetchingStats;

  const mainStats = [
    {
      title: t("dashboard.total_users"),
      value: stats.totalUsers,
      icon: <TbUsersGroup size={24} />,
      color: "#1890ff",
      trend: "+12%",
      trendUp: true,
    },
    {
      title: t("dashboard.total_posts"),
      value: stats.totalPosts,
      icon: <GrArticle size={24} fontWeight={"bold"} />,
      color: "#52c41a",
      trend: "+8%",
      trendUp: true,
    },
    {
      title: t("dashboard.total_events"),
      value: stats.totalEvents,
      icon: <FcInvite size={24} fontWeight={"bold"} />,
      color: "#faad14",
      trend: "+15%",
      trendUp: true,
    },
    {
      title: t("dashboard.total_messages"),
      value: stats.totalMessages,
      icon: <SiGooglemessages size={24} fontWeight={"bold"} />,
      color: "#722ed1",
      trend: "+5%",
      trendUp: true,
    },
    {
      title: t("dashboard.total_subscribers"),
      value: stats.totalSubscribers,
      icon: <MessageOutlined style={{ fontSize: 24 }} />,
      color: "#13c2c2",
      trend: "+20%",
      trendUp: true,
    },
  ];

  const secondaryStats = [
    {
      title: t("dashboard.courses"),
      value: stats.totalCourses,
      icon: <BookOutlined />,
      color: "#13c2c2",
    },
    {
      title: t("dashboard.projects"),
      value: stats.totalProjects,
      icon: <ProjectOutlined />,
      color: "#eb2f96",
    },
    {
      title: t("dashboard.professionals"),
      value: stats.totalProfessionals,
      icon: <UserOutlined />,
      color: "#52c41a",
    },
  ];

  // Get recent activities from API data
  const recentActivities = statsData?.recentActivities || [];

  const activityColumns = [
    {
      title: "User",
      dataIndex: "user",
      key: "user",
      render: (text: string) => (
        <Space>
          <Avatar size="small" style={{ backgroundColor: "#1890ff" }}>
            {text.charAt(0).toUpperCase()}
          </Avatar>
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
    },
    {
      title: "Item",
      dataIndex: "item",
      key: "item",
      render: (text: string, record: any) => (
        <Text ellipsis={{ tooltip: text }} style={{ maxWidth: 200 }}>
          {text}
        </Text>
      ),
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag
          color={
            status === "success"
              ? "green"
              : status === "processing"
              ? "blue"
              : "red"
          }
        >
          {status}
        </Tag>
      ),
    },
  ];

  // Show loading state
  if (loading) {
    return (
      <div
        style={{
          minHeight: "65vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        <Spin size="large" tip={t("common.loading")} />
      </div>
    );
  }

  // Show error state
  if (statsError) {
    return (
      <div
        style={{
          minHeight: "65vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        <Card>
          <Text type="danger">
            {t("common.error")}: Failed to load dashboard stats
          </Text>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <Col span={24}>
        <PageBreadCrumbs items={["Dashboard"]} />

        {/* Welcome Section */}
        <Card style={{ marginBottom: 24 }}>
          <Row align="middle" justify="space-between">
            <Col>
              <Title level={3} style={{ margin: 0 }}>
                {t("dashboard.welcome")}, {session?.user?.name || "Administrator"}! 👋
              </Title>
              <Text type="secondary">{t("dashboard.admin_subtitle")}</Text>
            </Col>
            <Col>
              <Space>
                <Text type="secondary">
                  Last updated: {new Date().toLocaleTimeString()}
                </Text>
                <Button
                  type="text"
                  icon={<ReloadOutlined />}
                  onClick={() => refetchStats()}
                  loading={isFetchingStats}
                  title="Refresh Stats"
                />
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Main Statistics */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          {mainStats.map((stat, index) => (
            <Col sm={8} md={6} span={24} key={index}>
              <Card>
                <Statistic
                  title={stat.title}
                  value={stat.value}
                  prefix={stat.icon}
                  valueStyle={{ color: stat.color }}
                  suffix={
                    <Space>
                      {stat.trendUp ? (
                        <RiseOutlined style={{ color: "#52c41a" }} />
                      ) : (
                        <FallOutlined style={{ color: "#ff4d4f" }} />
                      )}
                      <Text
                        style={{
                          color: stat.trendUp ? "#52c41a" : "#ff4d4f",
                          fontSize: 12,
                        }}
                      >
                        {stat.trend}
                      </Text>
                    </Space>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>

        {/* Secondary Statistics */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          {secondaryStats.map((stat, index) => (
            <Col sm={6} md={6} span={24} key={index}>
              <Card size="small">
                <Statistic
                  title={stat.title}
                  value={stat.value}
                  prefix={
                    <span style={{ color: stat.color }}>{stat.icon}</span>
                  }
                  valueStyle={{ fontSize: 20 }}
                />
              </Card>
            </Col>
          ))}
        </Row>

        {/* Charts and Analytics */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} md={12}>
            <Card title={t("dashboard.platform_growth")} size="small">
              <Space direction="vertical" style={{ width: "100%" }}>
                <div>
                  <Text strong>User Registration</Text>
                  <Progress
                    percent={Math.min(100, (stats.totalUsers / 1000) * 100)}
                    strokeColor="#1890ff"
                  />
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    {stats.totalUsers} users registered
                  </Text>
                </div>
                <div>
                  <Text strong>Content Creation</Text>
                  <Progress
                    percent={Math.min(100, (stats.totalPosts / 100) * 100)}
                    strokeColor="#52c41a"
                  />
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    {stats.totalPosts} posts created
                  </Text>
                </div>
                <div>
                  <Text strong>Event Participation</Text>
                  <Progress
                    percent={Math.min(100, (stats.totalEvents / 50) * 100)}
                    strokeColor="#faad14"
                  />
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    {stats.totalEvents} events hosted
                  </Text>
                </div>
                <div>
                  <Text strong>Course Completion</Text>
                  <Progress
                    percent={Math.min(100, (stats.totalCourses / 30) * 100)}
                    strokeColor="#722ed1"
                  />
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    {stats.totalCourses} courses available
                  </Text>
                </div>
              </Space>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title={t("dashboard.recent_activity")} size="small">
              {recentActivities.length > 0 ? (
                <Table
                  dataSource={recentActivities}
                  columns={activityColumns}
                  pagination={false}
                  size="small"
                  scroll={{ x: 400 }}
                />
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    padding: "20px",
                    color: "#999",
                  }}
                >
                  <Text type="secondary">
                    {t("dashboard.no_recent_activities")}
                  </Text>
                </div>
              )}
            </Card>
          </Col>
        </Row>

        {/* Quick Actions */}
        <Card title={t("dashboard.quick_actions")}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Card hoverable size="small" style={{ textAlign: "center" }}>
                <Space direction="vertical">
                  <TrophyOutlined style={{ fontSize: 24, color: "#1890ff" }} />
                  <Text strong>{t("dashboard.manage_courses")}</Text>
                </Space>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card hoverable size="small" style={{ textAlign: "center" }}>
                <Space direction="vertical">
                  <CalendarOutlined
                    style={{ fontSize: 24, color: "#52c41a" }}
                  />
                  <Text strong>{t("dashboard.schedule_events")}</Text>
                </Space>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card hoverable size="small" style={{ textAlign: "center" }}>
                <Space direction="vertical">
                  <MessageOutlined style={{ fontSize: 24, color: "#faad14" }} />
                  <Text strong>{t("dashboard.view_messages")}</Text>
                </Space>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card hoverable size="small" style={{ textAlign: "center" }}>
                <Space direction="vertical">
                  <UserOutlined style={{ fontSize: 24, color: "#722ed1" }} />
                  <Text strong>{t("dashboard.user_management")}</Text>
                </Space>
              </Card>
            </Col>
          </Row>
        </Card>
      </Col>

      <Authenticated key="home-page">
        <NavigateToResource />
      </Authenticated>
    </div>
  );
}
