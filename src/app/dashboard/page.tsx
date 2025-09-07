"use client";
import React, { useState, useEffect } from "react";
import { Authenticated } from "@refinedev/core";
import { NavigateToResource } from "@refinedev/nextjs-router";
import FeatureCard from "@components/dashboard/feature-card.component";
import { Col, Row, Card, Statistic, Typography, Space, Progress, Table, Tag, Avatar, Button } from "antd";
import { 
  TbUsersGroup 
} from "react-icons/tb";
import { 
  GrArticle 
} from "react-icons/gr";
import { 
  FcInvite 
} from "react-icons/fc";
import { 
  SiGooglemessages 
} from "react-icons/si";
import { 
  BookOutlined,
  CalendarOutlined,
  ProjectOutlined,
  TeamOutlined,
  TrophyOutlined,
  MessageOutlined,
  UserOutlined,
  RiseOutlined,
  FallOutlined
} from "@ant-design/icons";
import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import { useSession } from "next-auth/react";
import Link from "next/link";

const { Title, Text } = Typography;

export default function IndexPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPosts: 0,
    totalEvents: 0,
    totalMessages: 0,
    totalCourses: 0,
    totalProjects: 0,
    totalTeams: 0,
    totalProfessionals: 0
  });
  const [loading, setLoading] = useState(true);

  // Check user role
  const userRole = session?.user?.role || "user";

  useEffect(() => {
    // Simulate API calls to fetch real statistics
    const fetchStats = async () => {
      try {
        // In a real app, you would make API calls here
        // For now, we'll simulate with realistic data
        setStats({
          totalUsers: 1247,
          totalPosts: 89,
          totalEvents: 23,
          totalMessages: 156,
          totalCourses: 45,
          totalProjects: 67,
          totalTeams: 12,
          totalProfessionals: 34
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const mainStats = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: <TbUsersGroup size={24} />,
      color: '#1890ff',
      trend: '+12%',
      trendUp: true
    },
    {
      title: "Total Posts",
      value: stats.totalPosts,
      icon: <GrArticle size={24} fontWeight={"bold"} />,
      color: '#52c41a',
      trend: '+8%',
      trendUp: true
    },
    {
      title: "Total Events",
      value: stats.totalEvents,
      icon: <FcInvite size={24} fontWeight={"bold"} />,
      color: '#faad14',
      trend: '+15%',
      trendUp: true
    },
    {
      title: "Total Messages",
      value: stats.totalMessages,
      icon: <SiGooglemessages size={24} fontWeight={"bold"} />,
      color: '#722ed1',
      trend: '+5%',
      trendUp: true
    }
  ];

  const secondaryStats = [
    {
      title: "Courses",
      value: stats.totalCourses,
      icon: <BookOutlined />,
      color: '#13c2c2'
    },
    {
      title: "Projects",
      value: stats.totalProjects,
      icon: <ProjectOutlined />,
      color: '#eb2f96'
    },
    {
      title: "Teams",
      value: stats.totalTeams,
      icon: <TeamOutlined />,
      color: '#fa8c16'
    },
    {
      title: "Professionals",
      value: stats.totalProfessionals,
      icon: <UserOutlined />,
      color: '#52c41a'
    }
  ];

  const recentActivities = [
    {
      key: '1',
      user: 'John Doe',
      action: 'Created new course',
      item: 'React Advanced Patterns',
      time: '2 hours ago',
      status: 'success'
    },
    {
      key: '2',
      user: 'Jane Smith',
      action: 'Published blog post',
      item: 'Web Development Trends 2024',
      time: '4 hours ago',
      status: 'success'
    },
    {
      key: '3',
      user: 'Mike Johnson',
      action: 'Registered for event',
      item: 'Tech Conference 2024',
      time: '6 hours ago',
      status: 'processing'
    },
    {
      key: '4',
      user: 'Sarah Wilson',
      action: 'Updated profile',
      item: 'Professional Information',
      time: '8 hours ago',
      status: 'success'
    }
  ];

  const activityColumns = [
    {
      title: 'User',
      dataIndex: 'user',
      key: 'user',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
    },
    {
      title: 'Item',
      dataIndex: 'item',
      key: 'item',
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'success' ? 'green' : 'blue'}>
          {status === 'success' ? 'Completed' : 'Processing'}
        </Tag>
      ),
    },
  ];

  // Render different content based on user role
  if (userRole === "user") {
    return <UserDashboardContent />;
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
                Welcome back, {session?.user?.name || 'Admin'}! 👋
              </Title>
              <Text type="secondary">
                Here's what's happening with your platform today
              </Text>
            </Col>
            <Col>
              <Space>
                <Text type="secondary">Last updated: {new Date().toLocaleTimeString()}</Text>
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
                        <RiseOutlined style={{ color: '#52c41a' }} />
                      ) : (
                        <FallOutlined style={{ color: '#ff4d4f' }} />
                      )}
                      <Text style={{ color: stat.trendUp ? '#52c41a' : '#ff4d4f', fontSize: 12 }}>
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
                  prefix={<span style={{ color: stat.color }}>{stat.icon}</span>}
                  valueStyle={{ fontSize: 20 }}
                />
              </Card>
            </Col>
          ))}
        </Row>

        {/* Charts and Analytics */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} md={12}>
            <Card title="Platform Growth" size="small">
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <Text strong>User Registration</Text>
                  <Progress percent={75} strokeColor="#1890ff" />
                </div>
                <div>
                  <Text strong>Content Creation</Text>
                  <Progress percent={60} strokeColor="#52c41a" />
                </div>
                <div>
                  <Text strong>Event Participation</Text>
                  <Progress percent={85} strokeColor="#faad14" />
                </div>
                <div>
                  <Text strong>Course Completion</Text>
                  <Progress percent={45} strokeColor="#722ed1" />
                </div>
              </Space>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title="Recent Activity" size="small">
              <Table
                dataSource={recentActivities}
                columns={activityColumns}
                pagination={false}
                size="small"
              />
            </Card>
          </Col>
        </Row>

        {/* Quick Actions */}
        <Card title="Quick Actions">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Card hoverable size="small" style={{ textAlign: 'center' }}>
                <Space direction="vertical">
                  <TrophyOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                  <Text strong>Manage Courses</Text>
                </Space>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card hoverable size="small" style={{ textAlign: 'center' }}>
                <Space direction="vertical">
                  <CalendarOutlined style={{ fontSize: 24, color: '#52c41a' }} />
                  <Text strong>Schedule Events</Text>
                </Space>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card hoverable size="small" style={{ textAlign: 'center' }}>
                <Space direction="vertical">
                  <MessageOutlined style={{ fontSize: 24, color: '#faad14' }} />
                  <Text strong>View Messages</Text>
                </Space>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card hoverable size="small" style={{ textAlign: 'center' }}>
                <Space direction="vertical">
                  <UserOutlined style={{ fontSize: 24, color: '#722ed1' }} />
                  <Text strong>User Management</Text>
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

// User Dashboard Component
function UserDashboardContent() {
  const { data: session } = useSession();

  const userStats = [
    {
      title: "Enrolled Courses",
      value: 3,
      icon: <BookOutlined style={{ fontSize: 24, color: '#1890ff' }} />,
      color: '#1890ff'
    },
    {
      title: "Completed Lessons",
      value: 12,
      icon: <TrophyOutlined style={{ fontSize: 24, color: '#52c41a' }} />,
      color: '#52c41a'
    },
    {
      title: "Upcoming Events",
      value: 2,
      icon: <CalendarOutlined style={{ fontSize: 24, color: '#faad14' }} />,
      color: '#faad14'
    },
    {
      title: "Messages",
      value: 5,
      icon: <MessageOutlined style={{ fontSize: 24, color: '#722ed1' }} />,
      color: '#722ed1'
    }
  ];

  const quickActions = [
    {
      title: "Browse Courses",
      description: "Explore available courses",
      icon: <BookOutlined />,
      link: "/courses",
      color: '#1890ff'
    },
    {
      title: "View Events",
      description: "Check upcoming events",
      icon: <CalendarOutlined />,
      link: "/events",
      color: '#52c41a'
    },
    {
      title: "My Profile",
      description: "Update your profile",
      icon: <UserOutlined />,
      link: "/dashboard/settings",
      color: '#faad14'
    },
    {
      title: "Contact Support",
      description: "Get help and support",
      icon: <MessageOutlined />,
      link: "/contact_us",
      color: '#722ed1'
    }
  ];

  return (
    <div>
      <Col span={24}>
        <PageBreadCrumbs items={["Dashboard"]} />
        
        {/* Welcome Section */}
        <Card style={{ marginBottom: 24 }}>
          <Row align="middle" gutter={[16, 16]}>
            <Col>
              <Avatar 
                size={64} 
                src={session?.user?.image} 
                icon={<UserOutlined />}
                style={{ backgroundColor: '#1890ff' }}
              />
            </Col>
            <Col flex="auto">
              <Title level={3} style={{ margin: 0 }}>
                Welcome back, {session?.user?.name || 'User'}! 👋
              </Title>
              <Text type="secondary">
                Here's your learning progress and upcoming activities
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
        <Card title="Quick Actions" style={{ marginBottom: 24 }}>
          <Row gutter={[16, 16]}>
            {quickActions.map((action, index) => (
              <Col xs={24} sm={12} md={6} key={index}>
                <Card 
                  hoverable
                  style={{ 
                    textAlign: 'center',
                    border: `2px solid ${action.color}20`,
                    borderRadius: 8
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
                        style={{ backgroundColor: action.color, borderColor: action.color }}
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
        <Card title="Recent Activity">
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div style={{ padding: 16, background: '#f5f5f5', borderRadius: 8 }}>
              <Space>
                <BookOutlined style={{ color: '#1890ff' }} />
                <Text>Completed lesson: "Introduction to React"</Text>
                <Text type="secondary">2 hours ago</Text>
              </Space>
            </div>
            <div style={{ padding: 16, background: '#f5f5f5', borderRadius: 8 }}>
              <Space>
                <CalendarOutlined style={{ color: '#52c41a' }} />
                <Text>Registered for "Web Development Workshop"</Text>
                <Text type="secondary">1 day ago</Text>
              </Space>
            </div>
            <div style={{ padding: 16, background: '#f5f5f5', borderRadius: 8 }}>
              <Space>
                <TrophyOutlined style={{ color: '#faad14' }} />
                <Text>Earned certificate: "JavaScript Fundamentals"</Text>
                <Text type="secondary">3 days ago</Text>
              </Space>
            </div>
          </Space>
        </Card>
      </Col>
    </div>
  );
}
