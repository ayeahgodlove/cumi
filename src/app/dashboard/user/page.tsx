"use client";

import React from "react";
import { Authenticated } from "@refinedev/core";
import { NavigateToResource } from "@refinedev/nextjs-router";
import {
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Space,
  Button,
  Avatar,
} from "antd";
import {
  UserOutlined,
  BookOutlined,
  CalendarOutlined,
  TrophyOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import { useSession } from "next-auth/react";
import Link from "next/link";

const { Title, Text } = Typography;

export default function UserDashboard() {
  const { data: session, status } = useSession();

  // Show loading state while session is loading
  if (status === "loading") {
    return (
      <div style={{ 
        minHeight: "65vh", 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center",
        backgroundColor: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', marginBottom: '16px' }}>🔄</div>
          <div>Loading your dashboard...</div>
        </div>
      </div>
    );
  }

  // Show error state if no session
  if (!session) {
    return (
      <div style={{ 
        minHeight: "65vh", 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center",
        backgroundColor: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', marginBottom: '16px' }}>⚠️</div>
          <div>Please log in to access your dashboard.</div>
        </div>
      </div>
    );
  }

  const userStats = [
    {
      title: "Enrolled Courses",
      value: 3,
      icon: <BookOutlined style={{ fontSize: 24, color: "#1890ff" }} />,
      color: "#1890ff",
    },
    {
      title: "Completed Lessons",
      value: 12,
      icon: <TrophyOutlined style={{ fontSize: 24, color: "#52c41a" }} />,
      color: "#52c41a",
    },
    {
      title: "Upcoming Events",
      value: 2,
      icon: <CalendarOutlined style={{ fontSize: 24, color: "#faad14" }} />,
      color: "#faad14",
    },
    {
      title: "Messages",
      value: 5,
      icon: <MessageOutlined style={{ fontSize: 24, color: "#722ed1" }} />,
      color: "#722ed1",
    },
  ];

  const quickActions = [
    {
      title: "Browse Courses",
      description: "Explore available courses",
      icon: <BookOutlined />,
      link: "/courses",
      color: "#1890ff",
    },
    {
      title: "View Events",
      description: "Check upcoming events",
      icon: <CalendarOutlined />,
      link: "/events",
      color: "#52c41a",
    },
    {
      title: "My Profile",
      description: "Update your profile",
      icon: <UserOutlined />,
      link: "/dashboard/settings",
      color: "#faad14",
    },
    {
      title: "Contact Support",
      description: "Get help and support",
      icon: <MessageOutlined />,
      link: "/contact_us",
      color: "#722ed1",
    },
  ];

  return (
    <div>
      <Col span={24}>
        <PageBreadCrumbs items={["Dashboard"]} />

        {/* Welcome Section */}
        <Card style={{ marginBottom: 24 }} className="bg-white">
          <Row align="middle" gutter={[16, 16]}>
            <Col>
              <Avatar
                size={64}
                src={session?.user?.image}
                icon={<UserOutlined />}
                style={{ backgroundColor: "#1890ff" }}
              />
            </Col>
            <Col flex="auto">
              <Title level={3} style={{ margin: 0 }}>
                Welcome back, {session?.user?.name || "User"}! 👋
              </Title>
              <Text type="secondary">
                Here&apos;s your learning progress and upcoming activities
              </Text>
            </Col>
          </Row>
        </Card>

        {/* Statistics */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          {userStats.map((stat, index) => (
            <Col xs={24} sm={12} md={6} key={index}>
              <Card>
                <Statistic
                  title={stat.title}
                  value={stat.value}
                  prefix={stat.icon}
                  valueStyle={{ color: stat.color }}
                />
              </Card>
            </Col>
          ))}
        </Row>

        {/* Quick Actions */}
        <Card title="Quick Actions" style={{ marginBottom: 24, backgroundColor: 'white' }}>
          <Row gutter={[16, 16]}>
            {quickActions.map((action, index) => (
              <Col xs={24} sm={12} md={6} key={index}>
                <Card
                  hoverable
                  style={{
                    textAlign: "center",
                    border: `2px solid ${action.color}20`,
                    borderRadius: 8,
                    backgroundColor: 'white',
                  }}
                >
                  <Space direction="vertical" size="small">
                    <div style={{ fontSize: 32, color: action.color }}>
                      {action.icon}
                    </div>
                    <Title level={5} style={{ margin: 0 }}>
                      {action.title}
                    </Title>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {action.description}
                    </Text>
                    <Link href={action.link}>
                      <Button
                        type="primary"
                        size="small"
                        style={{
                          backgroundColor: action.color,
                          borderColor: action.color,
                        }}
                      >
                        Go
                      </Button>
                    </Link>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>

        {/* Recent Activity */}
        <Card title="Recent Activity" style={{ backgroundColor: 'white' }}>
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <div
              style={{ padding: 16, background: "#f5f5f5", borderRadius: 8 }}
            >
              <Space>
                <BookOutlined style={{ color: "#1890ff" }} />
                <Text>Completed lesson: &quot;Introduction to React&quot;</Text>
                <Text type="secondary">2 hours ago</Text>
              </Space>
            </div>
            <div
              style={{ padding: 16, background: "#f5f5f5", borderRadius: 8 }}
            >
              <Space>
                <CalendarOutlined style={{ color: "#52c41a" }} />
                <Text>Registered for &quot;Web Development Workshop&quot;</Text>
                <Text type="secondary">1 day ago</Text>
              </Space>
            </div>
            <div
              style={{ padding: 16, background: "#f5f5f5", borderRadius: 8 }}
            >
              <Space>
                <TrophyOutlined style={{ color: "#faad14" }} />
                <Text>Earned certificate: &quot;JavaScript Fundamentals&quot;</Text>
                <Text type="secondary">3 days ago</Text>
              </Space>
            </div>
          </Space>
        </Card>
      </Col>

      {/* Additional Content */}
      <Col span={24} style={{ marginTop: 24 }}>
        <Card title="Learning Resources" style={{ backgroundColor: 'white' }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8}>
              <Card hoverable style={{ textAlign: 'center' }}>
                <Space direction="vertical">
                  <BookOutlined style={{ fontSize: 32, color: '#1890ff' }} />
                  <Text strong>Free Courses</Text>
                  <Text type="secondary">Access our collection of free courses</Text>
                </Space>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card hoverable style={{ textAlign: 'center' }}>
                <Space direction="vertical">
                  <CalendarOutlined style={{ fontSize: 32, color: '#52c41a' }} />
                  <Text strong>Events</Text>
                  <Text type="secondary">Join our upcoming events and workshops</Text>
                </Space>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card hoverable style={{ textAlign: 'center' }}>
                <Space direction="vertical">
                  <MessageOutlined style={{ fontSize: 32, color: '#faad14' }} />
                  <Text strong>Community</Text>
                  <Text type="secondary">Connect with other learners</Text>
                </Space>
              </Card>
            </Col>
          </Row>
        </Card>
      </Col>

      <Authenticated key="user-dashboard">
        <NavigateToResource />
      </Authenticated>
    </div>
  );
}
