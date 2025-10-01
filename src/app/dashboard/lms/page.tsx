"use client";

import React, { useState } from "react";
import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Button, 
  Space, 
  Typography, 
  Divider,
  Badge,
  Progress,
  Avatar,
  List,
  Tag,
  Tooltip
} from "antd";
import { 
  BookOutlined, 
  PlayCircleOutlined, 
  QuestionCircleOutlined, 
  UserOutlined,
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  BarChartOutlined,
  TrophyOutlined,
  ClockCircleOutlined
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useList } from "@refinedev/core";
import { ICourse } from "@domain/models/course";
import { ICourseEnrollment as IEnrollment } from "@domain/models/course-enrollment.model";
import { ILesson } from "@domain/models/lesson";
import { IQuiz } from "@domain/models/quiz";

const { Title, Text } = Typography;

export default function LMSDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch data for statistics
  const { data: coursesData } = useList<ICourse>({
    resource: "courses",
  });

  const { data: enrollmentsData } = useList<IEnrollment>({
    resource: "enrollments",
  });

  const { data: lessonsData } = useList<ILesson>({
    resource: "lessons",
  });

  const { data: quizesData } = useList<IQuiz>({
    resource: "quizes",
  });

  const courses = coursesData?.data || [];
  const enrollments = enrollmentsData?.data || [];
  const lessons = lessonsData?.data || [];
  const quizes = quizesData?.data || [];

  // Calculate statistics
  const totalCourses = courses.length;
  const totalEnrollments = enrollments.length;
  const totalLessons = lessons.length;
  const totalQuizes = quizes.length;
  const activeEnrollments = enrollments.filter(e => {
    const enrollmentDate = new Date(e.enrollmentDate);
    const now = new Date();
    return now >= enrollmentDate && (!e.completedAt || now < new Date(e.completedAt));
  }).length;

  const completedEnrollments = enrollments.filter(e => {
    if (!e.completedAt) return false;
    const completedAt = new Date(e.completedAt);
    const now = new Date();
    return now >= completedAt;
  }).length;

  const completionRate = totalEnrollments > 0 ? (completedEnrollments / totalEnrollments) * 100 : 0;

  // Get recent courses with enrollment counts
  const coursesWithStats = courses.map(course => {
    const courseEnrollments = enrollments.filter(e => e.courseId === course.id);
    return {
      ...course,
      enrollmentCount: courseEnrollments.length,
      completionCount: courseEnrollments.filter(e => {
        if (!e.completedAt) return false;
        const completedAt = new Date(e.completedAt);
        const now = new Date();
        return now >= completedAt;
      }).length,
      completionRate: courseEnrollments.length > 0 ? 
        (courseEnrollments.filter(e => {
          if (!e.completedAt) return false;
          const completedAt = new Date(e.completedAt);
          const now = new Date();
          return now >= completedAt;
        }).length / courseEnrollments.length) * 100 : 0
    };
  }).sort((a, b) => b.enrollmentCount - a.enrollmentCount);

  const quickActions = [
    {
      title: "Create Course",
      description: "Add a new course to your LMS",
      icon: <BookOutlined style={{ fontSize: 24, color: "#1890ff" }} />,
      action: () => router.push("/dashboard/courses/create"),
      color: "#1890ff"
    },
    {
      title: "Manage Enrollments",
      description: "View and manage student enrollments",
      icon: <UserOutlined style={{ fontSize: 24, color: "#722ed1" }} />,
      action: () => router.push("/dashboard/enrollments"),
      color: "#722ed1"
    }
  ];

  return (
    <>
      <PageBreadCrumbs items={["Dashboard", "LMS"]} />
      
      <div style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}>
        {/* Header Section */}
        <Card style={{ marginBottom: 24, borderRadius: 12 }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={2} style={{ margin: 0, color: "#1890ff" }}>
                <BookOutlined style={{ marginRight: 12 }} />
                Learning Management System
              </Title>
              <Text type="secondary">
                Manage your courses, lessons, quizzes, and student enrollments
              </Text>
            </Col>
            <Col>
              <Space>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={() => router.push("/dashboard/courses/create")}
                  size="large"
                >
                  New Course
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Statistics Cards */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} lg={6}>
            <Card style={{ borderRadius: 12, textAlign: "center" }}>
              <Statistic
                title="Total Courses"
                value={totalCourses}
                prefix={<BookOutlined style={{ color: "#1890ff" }} />}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card style={{ borderRadius: 12, textAlign: "center" }}>
              <Statistic
                title="Active Enrollments"
                value={activeEnrollments}
                prefix={<UserOutlined style={{ color: "#52c41a" }} />}
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card style={{ borderRadius: 12, textAlign: "center" }}>
              <Statistic
                title="Total Lessons"
                value={totalLessons}
                prefix={<PlayCircleOutlined style={{ color: "#fa8c16" }} />}
                valueStyle={{ color: "#fa8c16" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card style={{ borderRadius: 12, textAlign: "center" }}>
              <Statistic
                title="Total Quizzes"
                value={totalQuizes}
                prefix={<QuestionCircleOutlined style={{ color: "#722ed1" }} />}
                valueStyle={{ color: "#722ed1" }}
              />
            </Card>
          </Col>
        </Row>

        {/* Completion Rate Progress */}
        <Card style={{ marginBottom: 24, borderRadius: 12 }}>
          <Title level={4}>
            <TrophyOutlined style={{ marginRight: 8, color: "#faad14" }} />
            Course Completion Rate
          </Title>
          <Progress 
            percent={Math.round(completionRate)} 
            strokeColor={{
              '0%': '#108ee9',
              '100%': '#87d068',
            }}
            style={{ marginBottom: 16 }}
          />
          <Row justify="space-between">
            <Col>
              <Text strong>Completed: {completedEnrollments}</Text>
            </Col>
            <Col>
              <Text strong>Total: {totalEnrollments}</Text>
            </Col>
          </Row>
        </Card>

        <Row gutter={[16, 16]}>
          {/* Quick Actions */}
          <Col xs={24} lg={8}>
            <Card 
              title={
                <span>
                  <PlusOutlined style={{ marginRight: 8, color: "#1890ff" }} />
                  Quick Actions
                </span>
              }
              style={{ borderRadius: 12, height: "100%" }}
            >
              <Space direction="vertical" style={{ width: "100%" }} size="middle">
                {quickActions.map((action, index) => (
                  <Card
                    key={index}
                    hoverable
                    onClick={action.action}
                    style={{ 
                      borderRadius: 8,
                      border: `2px solid ${action.color}20`,
                      background: `${action.color}05`
                    }}
                  >
                    <Row align="middle" gutter={12}>
                      <Col>
                        {action.icon}
                      </Col>
                      <Col flex={1}>
                        <Text strong style={{ color: action.color }}>
                          {action.title}
                        </Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {action.description}
                        </Text>
                      </Col>
                    </Row>
                  </Card>
                ))}
              </Space>
            </Card>
          </Col>

          {/* Course Management */}
          <Col xs={24} lg={16}>
            <Card 
              title={
                <span>
                  <BookOutlined style={{ marginRight: 8, color: "#1890ff" }} />
                  Course Management
                </span>
              }
              style={{ borderRadius: 12 }}
              extra={
                <Button 
                  type="link" 
                  onClick={() => router.push("/dashboard/courses")}
                >
                  View All
                </Button>
              }
            >
              <List
                dataSource={coursesWithStats.slice(0, 5)}
                renderItem={(course) => (
                  <List.Item
                    actions={[
                      <Tooltip key="view" title="View Course">
                        <Button 
                          type="text" 
                          icon={<EyeOutlined />}
                          onClick={() => router.push(`/dashboard/courses/show/${course.id}`)}
                        />
                      </Tooltip>,
                      <Tooltip key="edit" title="Edit Course">
                        <Button 
                          type="text" 
                          icon={<EditOutlined />}
                          onClick={() => router.push(`/dashboard/courses/edit/${course.id}`)}
                        />
                      </Tooltip>,
                      <Tooltip key="manage" title="Manage Lessons">
                        <Button 
                          type="text" 
                          icon={<PlayCircleOutlined />}
                          onClick={() => router.push(`/dashboard/courses/${course.id}/lessons`)}
                        />
                      </Tooltip>
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar 
                          size={48} 
                          icon={<BookOutlined />}
                          style={{ backgroundColor: "#1890ff" }}
                        />
                      }
                      title={
                        <Space>
                          <Text strong>{course.title}</Text>
                          <Badge 
                            count={course.enrollmentCount} 
                            style={{ backgroundColor: "#52c41a" }}
                          />
                        </Space>
                      }
                      description={
                        <Space direction="vertical" size={4}>
                          <Text type="secondary" ellipsis>
                            {course.description}
                          </Text>
                          <Space>
                            <Tag color="blue">
                              <UserOutlined /> {course.enrollmentCount} enrolled
                            </Tag>
                            <Tag color="green">
                              <TrophyOutlined /> {Math.round(course.completionRate)}% completed
                            </Tag>
                            <Tag color="orange">
                              <PlayCircleOutlined /> {lessons.filter(l => l.courseId === course.id).length} lessons
                            </Tag>
                          </Space>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>

        {/* Recent Activity */}
        <Card 
          title={
            <span>
              <ClockCircleOutlined style={{ marginRight: 8, color: "#fa8c16" }} />
              Recent Activity
            </span>
          }
          style={{ marginTop: 16, borderRadius: 12 }}
        >
          <List
            dataSource={enrollments.slice(0, 10)}
            renderItem={(enrollment) => {
              const course = courses.find(c => c.id === enrollment.courseId);
              const enrollmentDate = new Date(enrollment.enrollmentDate);
              const completedAt = enrollment.completedAt ? new Date(enrollment.completedAt) : null;
              const now = new Date();
              
              let status = "Pending";
              let color = "orange";
              
              if (completedAt && now >= completedAt) {
                status = "Completed";
                color = "green";
              } else if (now >= enrollmentDate) {
                status = "In Progress";
                color = "blue";
              }

              return (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} />}
                    title={
                      <Space>
                        <Text strong>{course?.title || "Unknown Course"}</Text>
                        <Tag color={color}>{status}</Tag>
                      </Space>
                    }
                    description={
                      <Text type="secondary">
                        Enrolled on {enrollmentDate.toLocaleDateString()}
                        {status === "Completed" && completedAt && (
                          <span> • Completed on {completedAt.toLocaleDateString()}</span>
                        )}
                      </Text>
                    }
                  />
                </List.Item>
              );
            }}
          />
        </Card>
      </div>
    </>
  );
}
