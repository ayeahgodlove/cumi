"use client";

import React, { useState, useRef } from "react";
import {
  Col,
  Row,
  Card,
  Statistic,
  Typography,
  Space,
  Table,
  Tag,
  Button,
  Spin,
  Tabs,
  message,
} from "antd";
import {
  BookOutlined,
  CalendarOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UserOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { useSession } from "next-auth/react";
import { useTranslation } from "@contexts/translation.context";
import { statsAPI } from "@store/api/stats_api";
import { useTable } from "@refinedev/antd";
import { BaseRecord } from "@refinedev/core";
import { format } from "@utils/format";
import CourseCreateModal from "@components/modals/CourseCreateModal";
import PostCreateModal from "@components/modals/PostCreateModal";
import EventCreateModal from "@components/modals/EventCreateModal";

const { Title, Text } = Typography;

export default function StudentDashboard() {
  const { data: session, status } = useSession();
  const { t } = useTranslation();
  
  // Modal states
  const [courseModalVisible, setCourseModalVisible] = useState(false);
  const [postModalVisible, setPostModalVisible] = useState(false);
  const [eventModalVisible, setEventModalVisible] = useState(false);
  
  // Table refs for focus management
  const coursesTableRef = useRef<any>(null);
  const postsTableRef = useRef<any>(null);
  const eventsTableRef = useRef<any>(null);

  // Fetch stats data
  const statsQuery = statsAPI.useGetDashboardStatsQuery(undefined, {
    skip: !session?.user,
    refetchOnMountOrArgChange: true,
  });

  const stats = statsQuery.data?.overview || {
    totalUsers: 0,
    totalPosts: 0,
    totalEvents: 0,
    totalCourses: 0,
    totalProjects: 0,
    totalOpportunities: 0,
    totalServices: 0,
    totalProfessionals: 0,
    totalBanners: 0,
    totalContactMessages: 0,
    totalSubscribers: 0,
    totalComments: 0,
    totalPostLikes: 0,
    totalCommentLikes: 0,
    totalUserLikes: 0,
    totalUserComments: 0,
  };

  // Table configurations
  const { tableProps: coursesTableProps, tableQueryResult: coursesQueryResult } = useTable({
    resource: "courses",
    syncWithLocation: true,
  });

  const { tableProps: postsTableProps, tableQueryResult: postsQueryResult } = useTable({
    resource: "posts",
    syncWithLocation: true,
  });

  const { tableProps: eventsTableProps, tableQueryResult: eventsQueryResult } = useTable({
    resource: "events",
    syncWithLocation: true,
  });

  // Handle successful creation
  const handleCreationSuccess = (type: 'course' | 'post' | 'event') => {
    message.success(`${type.charAt(0).toUpperCase() + type.slice(1)} created successfully!`);
    
    // Refetch the appropriate table data
    switch (type) {
      case 'course':
        coursesQueryResult.refetch();
        // Focus on courses table
        setTimeout(() => {
          coursesTableRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
        break;
      case 'post':
        postsQueryResult.refetch();
        // Focus on posts table
        setTimeout(() => {
          postsTableRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
        break;
      case 'event':
        eventsQueryResult.refetch();
        // Focus on events table
        setTimeout(() => {
          eventsTableRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
        break;
    }
    
    // Refetch stats
    statsQuery.refetch();
  };

  // Show loading while session is loading
  if (status === "loading") {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh" 
      }}>
        <Spin size="large" />
      </div>
    );
  }

  // Only render student dashboard for student users
  if (!session?.user || session.user.role !== "student") {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh" 
      }}>
        <Spin size="large" />
      </div>
    );
  }

  // Student-specific stats
  const studentStats = [
    {
      title: "Courses Enrolled",
      value: 0, // This would need to be fetched from course progress
      icon: <BookOutlined />,
      color: "#1890ff",
    },
    {
      title: "Courses Completed",
      value: 0, // This would need to be fetched from course progress
      icon: <TrophyOutlined />,
      color: "#52c41a",
    },
    {
      title: "My Comments",
      value: stats.totalUserComments,
      icon: <UserOutlined />,
      color: "#722ed1",
    },
    {
      title: "Events Attended",
      value: 0, // This would need to be fetched from event attendance
      icon: <CalendarOutlined />,
      color: "#13c2c2",
    },
  ];

  // Table columns
  const courseColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (value: any, record: any, index: number) =>
        format.twoChar((index + 1).toString()),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (value: any, record: any) => (
        <span>
          {record.isFree ? (
            <Tag color="green">Free</Tag>
          ) : (
            `${value || 0} ${record.currency || 'XAF'}`
          )}
        </span>
      ),
    },
    {
      title: "Progress",
      dataIndex: "progress",
      key: "progress",
      render: (value: number) => (
        <div>
          <div style={{ marginBottom: 4 }}>{value || 0}%</div>
          <div style={{ width: '100%', backgroundColor: '#f0f0f0', borderRadius: 4 }}>
            <div 
              style={{ 
                width: `${value || 0}%`, 
                height: 8, 
                backgroundColor: '#1890ff', 
                borderRadius: 4 
              }} 
            />
          </div>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (value: string) => {
        const colorMap = {
          enrolled: 'blue',
          completed: 'green',
          in_progress: 'orange',
          not_enrolled: 'gray'
        };
        return <Tag color={colorMap[value as keyof typeof colorMap] || 'default'}>{value}</Tag>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record: BaseRecord) => (
        <Space>
          <Button icon={<EyeOutlined />} size="small" />
          <Button type="primary" size="small">Continue</Button>
        </Space>
      ),
    },
  ];

  const postColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (value: any, record: any, index: number) =>
        format.twoChar((index + 1).toString()),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (value: string) => {
        const colorMap = {
          draft: 'orange',
          published: 'green',
          archived: 'gray'
        };
        return <Tag color={colorMap[value as keyof typeof colorMap] || 'default'}>{value}</Tag>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record: BaseRecord) => (
        <Space>
          <Button icon={<EyeOutlined />} size="small" />
          <Button icon={<EditOutlined />} size="small" />
          <Button icon={<DeleteOutlined />} size="small" danger />
        </Space>
      ),
    },
  ];

  const eventColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (value: any, record: any, index: number) =>
        format.twoChar((index + 1).toString()),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Event Date",
      dataIndex: "eventDate",
      key: "eventDate",
      render: (value: string) => format.date(value),
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (value: string) => {
        const colorMap = {
          draft: 'orange',
          published: 'green',
          cancelled: 'red',
          completed: 'blue'
        };
        return <Tag color={colorMap[value as keyof typeof colorMap] || 'default'}>{value}</Tag>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record: BaseRecord) => (
        <Space>
          <Button icon={<EyeOutlined />} size="small" />
          <Button type="primary" size="small">Register</Button>
        </Space>
      ),
    },
  ];

  const tabItems = [
    {
      key: "courses",
      label: "My Courses",
      children: (
        <div ref={coursesTableRef}>
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={4}>Course Progress</Title>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => setCourseModalVisible(true)}
            >
              Create Course
            </Button>
          </div>
          <Table
            {...coursesTableProps}
            columns={courseColumns}
            rowKey="id"
            pagination={{
              ...coursesTableProps.pagination,
              showSizeChanger: true,
              showQuickJumper: true,
            }}
          />
        </div>
      ),
    },
    {
      key: "posts",
      label: "Learning Posts",
      children: (
        <div ref={postsTableRef}>
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={4}>Educational Content</Title>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => setPostModalVisible(true)}
            >
              Create Post
            </Button>
          </div>
          <Table
            {...postsTableProps}
            columns={postColumns}
            rowKey="id"
            pagination={{
              ...postsTableProps.pagination,
              showSizeChanger: true,
              showQuickJumper: true,
            }}
          />
        </div>
      ),
    },
    {
      key: "events",
      label: "Learning Events",
      children: (
        <div ref={eventsTableRef}>
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={4}>Educational Events</Title>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => setEventModalVisible(true)}
            >
              Create Event
            </Button>
          </div>
          <Table
            {...eventsTableProps}
            columns={eventColumns}
            rowKey="id"
            pagination={{
              ...eventsTableProps.pagination,
              showSizeChanger: true,
              showQuickJumper: true,
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Title level={2}>Student Dashboard</Title>
      
      {/* Student Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Title level={4}>Learning Progress</Title>
        </Col>
        {studentStats.map((stat, index) => (
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

      {/* Content Management Tabs */}
      <Card>
        <Tabs defaultActiveKey="courses" items={tabItems} />
      </Card>

      {/* Modals */}
      <CourseCreateModal
        visible={courseModalVisible}
        onCancel={() => setCourseModalVisible(false)}
        onSuccess={() => handleCreationSuccess('course')}
      />
      
      <PostCreateModal
        visible={postModalVisible}
        onCancel={() => setPostModalVisible(false)}
        onSuccess={() => handleCreationSuccess('post')}
      />
      
      <EventCreateModal
        visible={eventModalVisible}
        onCancel={() => setEventModalVisible(false)}
        onSuccess={() => handleCreationSuccess('event')}
      />
    </div>
  );
}