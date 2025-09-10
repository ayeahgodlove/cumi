"use client";

import React from "react";
import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import {
  Card,
  Row,
  Col,
  Typography,
  Tag,
  Space,
  Button,
  Table,
  Avatar,
  Progress,
  Statistic,
  Tooltip,
  Empty,
  Spin,
} from "antd";
import {
  BookOutlined,
  UserOutlined,
  PlayCircleOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { Authenticated, useList } from "@refinedev/core";
import { ICourse } from "@domain/models/course";
import { IEnrollment } from "@domain/models/enrollment";
import { ILesson } from "@domain/models/lesson";
import { IQuiz } from "@domain/models/quiz";
import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { NavigateToResource } from "@refinedev/nextjs-router";
const { Title, Text } = Typography;

export default function StudentDashboard() {
  const router = useRouter();
  const { data: session } = useSession();

  // Get current user from session
  const currentUser = session?.user;

  console.log("Student Dashboard - Current User:", currentUser);

  // Fetch student's enrollments
  const {
    data: enrollmentsData,
    isLoading: isLoadingEnrollments,
    error: enrollmentsError,
  } = useList<IEnrollment>({
    resource: "enrollments",
    filters: currentUser?.id
      ? [
          {
            field: "userId",
            operator: "eq",
            value: currentUser.id,
          },
        ]
      : [],
    queryOptions: {
      enabled: !!currentUser?.id,
      retry: 1,
      retryDelay: 1000,
    },
  });

  const enrollments = enrollmentsData?.data || [];
  console.log("Student Dashboard - Enrollments:", enrollments);

  // Fetch courses for enrolled courses
  const courseIds = enrollments.map((e) => e.courseId);
  const { data: coursesData, isLoading: isLoadingCourses } = useList<ICourse>({
    resource: "courses",
    filters:
      courseIds.length > 0
        ? [
            {
              field: "id",
              operator: "in",
              value: courseIds,
            },
          ]
        : [],
    queryOptions: {
      enabled: courseIds.length > 0,
      retry: 1,
      retryDelay: 1000,
    },
  });

  const courses = coursesData?.data || [];

  // Fetch lessons for enrolled courses
  const { data: lessonsData } = useList<ILesson>({
    resource: "lessons",
    filters:
      courseIds.length > 0
        ? [
            {
              field: "courseId",
              operator: "in",
              value: courseIds,
            },
          ]
        : [],
    queryOptions: {
      enabled: courseIds.length > 0,
      retry: 1,
      retryDelay: 1000,
    },
  });

  const lessons = lessonsData?.data || [];

  // Fetch quizzes for enrolled courses
  const lessonIds = lessons.map((l) => l.id);
  const { data: quizesData } = useList<IQuiz>({
    resource: "quizes",
    filters:
      lessonIds.length > 0
        ? [
            {
              field: "lessonId",
              operator: "in",
              value: lessonIds,
            },
          ]
        : [],
    queryOptions: {
      enabled: lessonIds.length > 0,
      retry: 1,
      retryDelay: 1000,
    },
  });

  const quizes = quizesData?.data || [];

  // Show error state if there are API errors
  if (enrollmentsError) {
    console.error("Student Dashboard - Enrollments Error:", enrollmentsError);
    return (
      <div style={{ padding: "24px" }}>
        <PageBreadCrumbs items={["Dashboard", "Student"]} />
        <Card>
          <div style={{ textAlign: "center", padding: "40px" }}>
            <div style={{ fontSize: "24px", marginBottom: "16px" }}>⚠️</div>
            <div>Unable to load your courses. Please try again later.</div>
            <Button
              type="primary"
              style={{ marginTop: "16px" }}
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Memoize expensive calculations
  const statistics = useMemo(() => {
    const activeEnrollments = enrollments.filter((e) => {
      try {
        const enrollmentDate = new Date(e.enrollmentDate);
        const completionDate = new Date(e.completionDate);
        const now = new Date();
        return now >= enrollmentDate && now < completionDate;
      } catch {
        return false;
      }
    }).length;

    const completedEnrollments = enrollments.filter((e) => {
      try {
        const completionDate = new Date(e.completionDate);
        const now = new Date();
        return now >= completionDate;
      } catch {
        return false;
      }
    }).length;

    return {
      activeEnrollments,
      completedEnrollments,
      totalLessons: lessons.length,
      totalQuizzes: quizes.length,
    };
  }, [enrollments, lessons.length, quizes.length]);

  // Memoize table columns
  const enrollmentColumns = useMemo(
    () => [
      {
        title: "Course",
        dataIndex: "courseId",
        key: "courseId",
        render: (courseId: string) => {
          const course = courses.find((c) => c.id === courseId);
          return (
            <Space>
              <Avatar icon={<BookOutlined />} />
              <div>
                <Text strong>{course?.title || "Unknown Course"}</Text>
                <br />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {course?.description?.substring(0, 50) || "No description"}...
                </Text>
              </div>
            </Space>
          );
        },
      },
      {
        title: "Enrollment Date",
        dataIndex: "enrollmentDate",
        key: "enrollmentDate",
        render: (date: string) => {
          try {
            return new Date(date).toLocaleDateString();
          } catch {
            return "Invalid Date";
          }
        },
      },
      {
        title: "Completion Date",
        dataIndex: "completionDate",
        key: "completionDate",
        render: (date: string) => {
          try {
            return new Date(date).toLocaleDateString();
          } catch {
            return "Invalid Date";
          }
        },
      },
      {
        title: "Progress",
        key: "progress",
        render: (record: IEnrollment) => {
          try {
            const enrollmentDate = new Date(record.enrollmentDate);
            const completionDate = new Date(record.completionDate);
            const now = new Date();

            let progress = 0;
            let status = "Pending";
            let color = "orange";

            if (now >= completionDate) {
              progress = 100;
              status = "Completed";
              color = "green";
            } else if (now >= enrollmentDate) {
              const totalDays =
                completionDate.getTime() - enrollmentDate.getTime();
              const elapsedDays = now.getTime() - enrollmentDate.getTime();
              progress = Math.min((elapsedDays / totalDays) * 100, 95);
              status = "In Progress";
              color = "blue";
            }

            return (
              <Space direction="vertical" style={{ width: "100%" }}>
                <Progress
                  percent={Math.round(progress)}
                  size="small"
                  strokeColor={color === "green" ? "#52c41a" : "#1890ff"}
                />
                <Tag color={color}>{status}</Tag>
              </Space>
            );
          } catch {
            return <Tag color="red">Error</Tag>;
          }
        },
      },
      {
        title: "Actions",
        key: "actions",
        render: (record: IEnrollment) => (
          <Space>
            <Tooltip title="View Course">
              <Button
                type="text"
                icon={<EyeOutlined />}
                onClick={() =>
                  router.push(`/dashboard/student/courses/${record.courseId}`)
                }
              />
            </Tooltip>
            <Tooltip title="Start Learning">
              <Button
                type="primary"
                icon={<PlayCircleOutlined />}
                onClick={() =>
                  router.push(
                    `/dashboard/student/courses/${record.courseId}/learn`
                  )
                }
              />
            </Tooltip>
          </Space>
        ),
      },
    ],
    [courses, router]
  );

  console.log("Student Dashboard - Rendering with:", {
    enrollments: enrollments.length,
    courses: courses.length,
    isLoadingEnrollments,
  });

  return (
    <div style={{ minHeight: "100vh" }}>
      <PageBreadCrumbs items={["Dashboard", "Student"]} />

      <div style={{ padding: "24px" }}>
        {/* Header Section */}
        <Card style={{ marginBottom: 24, borderRadius: 12 }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Space>
                <Title level={2} style={{ margin: 0 }}>
                  <UserOutlined style={{ marginRight: 8, color: "#52c41a" }} />
                  Student Dashboard
                  {isLoadingEnrollments && (
                    <Spin size="small" style={{ marginLeft: 8 }} />
                  )}
                </Title>
              </Space>
              <div style={{ marginTop: 8 }}>
                <Text type="secondary">
                  Welcome back,{" "}
                  {currentUser?.name || currentUser?.email || "Student"}! Track
                  your learning progress and access your courses.
                </Text>
              </div>
            </Col>
            <Col>
              <Space>
                <Button
                  icon={<BookOutlined />}
                  onClick={() => router.push("/dashboard/student/courses")}
                >
                  Browse Courses
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        <Row gutter={[16, 16]}>
          {/* Statistics */}
          <Col xs={24}>
            <Card
              title="Learning Statistics"
              style={{ borderRadius: 12, marginBottom: 16 }}
            >
              <Row gutter={[16, 16]}>
                <Col xs={12} sm={6}>
                  <Statistic
                    title="Enrolled Courses"
                    value={enrollments.length}
                    prefix={<BookOutlined style={{ color: "#1890ff" }} />}
                    valueStyle={{ color: "#1890ff" }}
                  />
                </Col>
                <Col xs={12} sm={6}>
                  <Statistic
                    title="Active Courses"
                    value={statistics.activeEnrollments}
                    prefix={<PlayCircleOutlined style={{ color: "#52c41a" }} />}
                    valueStyle={{ color: "#52c41a" }}
                  />
                </Col>
                <Col xs={12} sm={6}>
                  <Statistic
                    title="Completed Courses"
                    value={statistics.completedEnrollments}
                    prefix={<TrophyOutlined style={{ color: "#faad14" }} />}
                    valueStyle={{ color: "#faad14" }}
                  />
                </Col>
                <Col xs={12} sm={6}>
                  <Statistic
                    title="Total Lessons"
                    value={statistics.totalLessons}
                    prefix={
                      <ClockCircleOutlined style={{ color: "#722ed1" }} />
                    }
                    valueStyle={{ color: "#722ed1" }}
                  />
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Quick Access */}
          <Col xs={24} lg={8}>
            <Card
              title="Quick Access"
              style={{ borderRadius: 12, marginBottom: 16 }}
            >
              <Space
                direction="vertical"
                style={{ width: "100%" }}
                size="middle"
              >
                <Button
                  type="primary"
                  icon={<BookOutlined />}
                  onClick={() => router.push("/dashboard/student/courses")}
                  block
                >
                  Browse All Courses
                </Button>
                <Button
                  icon={<PlayCircleOutlined />}
                  onClick={() => router.push("/dashboard/student/progress")}
                  block
                >
                  View Progress
                </Button>
                <Button
                  icon={<TrophyOutlined />}
                  onClick={() => router.push("/dashboard/student/achievements")}
                  block
                >
                  My Achievements
                </Button>
              </Space>
            </Card>
          </Col>

          {/* Recent Activity */}
          <Col xs={24} lg={16}>
            <Card
              title="Recent Activity"
              style={{ borderRadius: 12, marginBottom: 16 }}
            >
              <Space
                direction="vertical"
                style={{ width: "100%" }}
                size="middle"
              >
                {isLoadingEnrollments ? (
                  <div style={{ textAlign: "center", padding: "20px" }}>
                    <Spin />
                    <div style={{ marginTop: "8px" }}>
                      Loading enrollments...
                    </div>
                  </div>
                ) : enrollments.length === 0 ? (
                  <Empty
                    description="No enrollments yet"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  >
                    <Button
                      type="primary"
                      icon={<BookOutlined />}
                      onClick={() => router.push("/dashboard/student/courses")}
                    >
                      Browse Courses
                    </Button>
                  </Empty>
                ) : (
                  <div>
                    <Text strong>Recent Enrollments:</Text>
                    <div style={{ marginTop: 12 }}>
                      {enrollments.slice(0, 3).map((enrollment) => {
                        const course = courses.find(
                          (c) => c.id === enrollment.courseId
                        );
                        return (
                          <Card
                            key={enrollment.id}
                            size="small"
                            style={{ marginBottom: 8, borderRadius: 8 }}
                          >
                            <Row align="middle" justify="space-between">
                              <Col>
                                <Text strong>
                                  {course?.title || "Unknown Course"}
                                </Text>
                                <br />
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                  Enrolled:{" "}
                                  {(() => {
                                    try {
                                      return new Date(
                                        enrollment.enrollmentDate
                                      ).toLocaleDateString();
                                    } catch {
                                      return "Invalid Date";
                                    }
                                  })()}
                                </Text>
                              </Col>
                              <Col>
                                <Button
                                  type="primary"
                                  size="small"
                                  icon={<PlayCircleOutlined />}
                                  onClick={() =>
                                    router.push(
                                      `/dashboard/student/courses/${enrollment.courseId}/learn`
                                    )
                                  }
                                >
                                  Continue
                                </Button>
                              </Col>
                            </Row>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                )}
              </Space>
            </Card>
          </Col>
        </Row>

        {/* My Courses */}
        <Card
          title={
            <span>
              <BookOutlined style={{ marginRight: 8, color: "#1890ff" }} />
              My Courses ({enrollments.length})
            </span>
          }
          style={{ marginTop: 16, borderRadius: 12 }}
        >
          {isLoadingEnrollments ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <Spin size="large" />
              <div style={{ marginTop: "16px" }}>Loading your courses...</div>
            </div>
          ) : enrollments.length === 0 ? (
            <Empty
              description="You haven't enrolled in any courses yet"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <Button
                type="primary"
                icon={<BookOutlined />}
                onClick={() => router.push("/dashboard/student/courses")}
              >
                Browse Available Courses
              </Button>
            </Empty>
          ) : (
            <Table
              columns={enrollmentColumns}
              dataSource={enrollments}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              size="middle"
              loading={isLoadingCourses}
            />
          )}
        </Card>
      </div>

      {/* <Authenticated key="student-dashboard">
        <NavigateToResource />
      </Authenticated> */}
    </div>
  );
}
