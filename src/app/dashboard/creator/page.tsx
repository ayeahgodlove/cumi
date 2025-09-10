"use client";

import React from "react";
import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import { BASE_URL_UPLOADS_MEDIA } from "@constants/api-url";
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
  Divider,
  Statistic,
  Badge,
  Tooltip,
  Empty,
} from "antd";
import {
  BookOutlined,
  UserOutlined,
  EditOutlined,
  PlusOutlined,
  FileTextOutlined,
  CalendarOutlined,
  TrophyOutlined,
  EyeOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
  QuestionCircleOutlined,
  TeamOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { Authenticated, useList } from "@refinedev/core";
import { ICourse } from "@domain/models/course";
import { IPost } from "@domain/models/post.model";
import { IEvent } from "@domain/models/event.model";
import { IEnrollment } from "@domain/models/enrollment";
import { ILesson } from "@domain/models/lesson";
import { IQuiz } from "@domain/models/quiz";
import { NavigateToResource } from "@refinedev/nextjs-router/app";
import { useSession } from "next-auth/react";
import { useMemo } from "react";

const { Title, Text } = Typography;

export default function CreatorDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();

  // Get current user from session
  const currentUser = session?.user;

  // Fetch creator's content - ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
  const { data: coursesData, isLoading: isLoadingCourses } = useList<ICourse>({
    resource: "courses",
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
      enabled: !!currentUser?.id, // Only fetch if user ID exists
      retry: false, // Disable retries to prevent hanging
      staleTime: 30000, // Cache for 30 seconds
    },
  });

  const { data: postsData, isLoading: isLoadingPosts } = useList<IPost>({
    resource: "posts",
    filters: currentUser?.id
      ? [
          {
            field: "authorId",
            operator: "eq",
            value: currentUser.id,
          },
        ]
      : [],
    queryOptions: {
      enabled: !!currentUser?.id, // Only fetch if user ID exists
      retry: false, // Disable retries to prevent hanging
      staleTime: 30000, // Cache for 30 seconds
    },
  });

  const { data: eventsData, isLoading: isLoadingEvents } = useList<IEvent>({
    resource: "events",
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
      enabled: !!currentUser?.id, // Only fetch if user ID exists
      retry: false, // Disable retries to prevent hanging
      staleTime: 30000, // Cache for 30 seconds
    },
  });

  const courses = coursesData?.data || [];
  const posts = postsData?.data || [];
  const events = eventsData?.data || [];

  // Fetch enrollments for creator's courses
  const courseIds = courses.map((c) => c.id);
  const { data: enrollmentsData } = useList<IEnrollment>({
    resource: "enrollments",
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
      enabled: courseIds.length > 0, // Only fetch if there are course IDs
      retry: false,
      staleTime: 30000,
    },
  });

  const enrollments = enrollmentsData?.data || [];

  // Fetch lessons for creator's courses
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
      enabled: courseIds.length > 0, // Only fetch if there are course IDs
      retry: false,
      staleTime: 30000,
    },
  });

  const lessons = lessonsData?.data || [];

  // Fetch quizzes for creator's lessons
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
      enabled: lessonIds.length > 0, // Only fetch if there are lesson IDs
      retry: false,
      staleTime: 30000,
    },
  });

  const quizes = quizesData?.data || [];

  // Show loading state while session is loading
  if (status === "loading") {
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
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "24px", marginBottom: "16px" }}>🔄</div>
          <div>Loading your dashboard...</div>
        </div>
      </div>
    );
  }

  // Show error state if no session
  if (!session) {
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
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "24px", marginBottom: "16px" }}>⚠️</div>
          <div>Please log in to access your dashboard.</div>
        </div>
      </div>
    );
  }

  // Memoize expensive calculations to prevent unnecessary re-renders
  const statistics = useMemo(() => {
    const totalEnrollments = enrollments.length;
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

    const upcomingEvents = events.filter((e) => {
      try {
        const eventDate = new Date(e.eventDate);
        const now = new Date();
        return eventDate >= now;
      } catch {
        return false;
      }
    }).length;

    return {
      totalEnrollments,
      activeEnrollments,
      completedEnrollments,
      upcomingEvents,
    };
  }, [enrollments, events]);

  const recentData = useMemo(
    () => ({
      recentPosts: posts.slice(0, 3),
      recentCourses: courses.slice(0, 3),
      recentEvents: events.slice(0, 3),
    }),
    [posts, courses, events]
  );

  // Memoize table columns to prevent unnecessary re-renders
  const courseColumns = useMemo(
    () => [
      {
        title: "Course",
        dataIndex: "title",
        key: "title",
        render: (title: string, record: ICourse) => (
          <Space>
            <Avatar
              src={
                record.imageUrl
                  ? `${BASE_URL_UPLOADS_MEDIA}/${record.imageUrl}`
                  : undefined
              }
              icon={<BookOutlined />}
            />
            <div>
              <Text strong>{title}</Text>
              <br />
              <Text type="secondary" style={{ fontSize: 12 }}>
                {record.description?.substring(0, 50) || "No description"}...
              </Text>
            </div>
          </Space>
        ),
      },
      {
        title: "Enrollments",
        key: "enrollments",
        render: (record: ICourse) => {
          const courseEnrollments = enrollments.filter(
            (e) => e.courseId === record.id
          );
          return (
            <Badge
              count={courseEnrollments.length}
              style={{ backgroundColor: "#1890ff" }}
            />
          );
        },
      },
      {
        title: "Lessons",
        key: "lessons",
        render: (record: ICourse) => {
          const courseLessons = lessons.filter((l) => l.courseId === record.id);
          return (
            <Badge
              count={courseLessons.length}
              style={{ backgroundColor: "#52c41a" }}
            />
          );
        },
      },
      {
        title: "Status",
        dataIndex: "isPublished",
        key: "isPublished",
        render: (isPublished: boolean) => (
          <Tag color={isPublished ? "green" : "orange"}>
            {isPublished ? "Published" : "Draft"}
          </Tag>
        ),
      },
      {
        title: "Actions",
        key: "actions",
        render: (record: ICourse) => (
          <Space>
            <Tooltip title="View Course">
              <Button
                type="text"
                icon={<EyeOutlined />}
                onClick={() =>
                  router.push(`/dashboard/courses/show/${record.id}`)
                }
              />
            </Tooltip>
            <Tooltip title="Edit Course">
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() =>
                  router.push(`/dashboard/courses/edit/${record.id}`)
                }
              />
            </Tooltip>
            <Tooltip title="Manage Lessons">
              <Button
                type="text"
                icon={<PlayCircleOutlined />}
                onClick={() =>
                  router.push(`/dashboard/courses/${record.id}/lessons`)
                }
              />
            </Tooltip>
          </Space>
        ),
      },
    ],
    [enrollments, lessons, router]
  );

  const postColumns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (title: string, record: IPost) => (
        <Space>
          <Avatar
            src={
              record.imageUrl
                ? `${BASE_URL_UPLOADS_MEDIA}/${record.imageUrl}`
                : undefined
            }
            icon={<FileTextOutlined />}
          />
          <div>
            <Text strong>{title}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.description?.substring(0, 50)}...
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "isPublished",
      key: "isPublished",
      render: (isPublished: boolean) => (
        <Tag color={isPublished ? "green" : "orange"}>
          {isPublished ? "Published" : "Draft"}
        </Tag>
      ),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: IPost) => (
        <Space>
          <Tooltip title="View Post">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => router.push(`/posts/${record.slug}`)}
            />
          </Tooltip>
          <Tooltip title="Edit Post">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() =>
                router.push(`/dashboard/blog-posts/edit/${record.id}`)
              }
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const eventColumns = [
    {
      title: "Event",
      dataIndex: "title",
      key: "title",
      render: (title: string, record: IEvent) => (
        <Space>
          <Avatar
            src={
              record.imageUrl
                ? `${BASE_URL_UPLOADS_MEDIA}/${record.imageUrl}`
                : undefined
            }
            icon={<CalendarOutlined />}
          />
          <div>
            <Text strong>{title}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.description?.substring(0, 50)}...
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Date",
      dataIndex: "eventDate",
      key: "eventDate",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Status",
      key: "status",
      render: (record: IEvent) => {
        const eventDate = new Date(record.eventDate);
        const now = new Date();
        const isUpcoming = eventDate >= now;
        return (
          <Tag color={isUpcoming ? "blue" : "gray"}>
            {isUpcoming ? "Upcoming" : "Past"}
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: IEvent) => (
        <Space>
          <Tooltip title="View Event">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => router.push(`/events/${record.slug}`)}
            />
          </Tooltip>
          <Tooltip title="Edit Event">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => router.push(`/dashboard/events/edit/${record.id}`)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <>
      <PageBreadCrumbs items={["Dashboard", "Creator"]} />

      <div style={{ padding: "24px", minHeight: "100vh" }}>
        {/* Header Section */}
        <Card
          style={{ marginBottom: 24, borderRadius: 12, background: "#f4f4f4" }}
        >
          <Row justify="space-between" align="middle">
            <Col>
              <Space>
                <Title level={2} style={{ margin: 0 }}>
                  <EditOutlined style={{ marginRight: 8, color: "#722ed1" }} />
                  Content Creator Dashboard
                  {(isLoadingCourses || isLoadingPosts || isLoadingEvents) && (
                    <span
                      style={{
                        marginLeft: 8,
                        fontSize: "14px",
                        color: "#1890ff",
                      }}
                    >
                      🔄 Loading...
                    </span>
                  )}
                </Title>
              </Space>
              <div style={{ marginTop: 8 }}>
                <Text type="secondary">
                  Welcome back, {currentUser?.name || "Creator"}! Manage your
                  content and track your audience engagement.
                </Text>
              </div>
            </Col>
            <Col>
              <Space>
                <Button
                  icon={<PlusOutlined />}
                  onClick={() => router.push("/dashboard/courses/create")}
                >
                  Create Course
                </Button>
                <Button
                  icon={<FileTextOutlined />}
                  onClick={() => router.push("/dashboard/blog-posts/create")}
                >
                  Write Post
                </Button>
                <Button
                  icon={<CalendarOutlined />}
                  onClick={() => router.push("/dashboard/events/create")}
                >
                  Create Event
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        <Row gutter={[16, 16]}>
          {/* Statistics */}
          <Col xs={24}>
            <Card
              title="Content Statistics"
              style={{
                borderRadius: 12,
                marginBottom: 16,
                background: "#f4f4f4",
              }}
            >
              <Row gutter={[16, 16]}>
                <Col xs={12} sm={6}>
                  <Statistic
                    title="Total Courses"
                    value={courses.length}
                    prefix={<BookOutlined style={{ color: "#1890ff" }} />}
                    valueStyle={{ color: "#1890ff" }}
                  />
                </Col>
                <Col xs={12} sm={6}>
                  <Statistic
                    title="Total Posts"
                    value={posts.length}
                    prefix={<FileTextOutlined style={{ color: "#52c41a" }} />}
                    valueStyle={{ color: "#52c41a" }}
                  />
                </Col>
                <Col xs={12} sm={6}>
                  <Statistic
                    title="Total Events"
                    value={events.length}
                    prefix={<CalendarOutlined style={{ color: "#faad14" }} />}
                    valueStyle={{ color: "#faad14" }}
                  />
                </Col>
                <Col xs={12} sm={6}>
                  <Statistic
                    title="Total Enrollments"
                    value={statistics.totalEnrollments}
                    prefix={<TeamOutlined style={{ color: "#722ed1" }} />}
                    valueStyle={{ color: "#722ed1" }}
                  />
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Quick Actions */}
          <Col xs={24} lg={8}>
            <Card
              title="Quick Actions"
              style={{
                borderRadius: 12,
                marginBottom: 16,
                background: "#f4f4f4",
              }}
            >
              <Space
                direction="vertical"
                style={{ width: "100%" }}
                size="middle"
              >
                <Button
                  type="primary"
                  icon={<BookOutlined />}
                  onClick={() => router.push("/dashboard/courses/create")}
                  block
                >
                  Create New Course
                </Button>
                <Button
                  icon={<FileTextOutlined />}
                  onClick={() => router.push("/dashboard/blog-posts/create")}
                  block
                >
                  Write New Post
                </Button>
                <Button
                  icon={<CalendarOutlined />}
                  onClick={() => router.push("/dashboard/events/create")}
                  block
                >
                  Create New Event
                </Button>
                <Button
                  icon={<PlayCircleOutlined />}
                  onClick={() => router.push("/dashboard/lessons/create")}
                  block
                >
                  Add Lesson
                </Button>
                <Button
                  icon={<QuestionCircleOutlined />}
                  onClick={() => router.push("/dashboard/quizes/create")}
                  block
                >
                  Create Quiz
                </Button>
              </Space>
            </Card>
          </Col>

          {/* Recent Activity */}
          <Col xs={24} lg={16}>
            <Card
              title="Recent Activity"
              style={{
                borderRadius: 12,
                marginBottom: 16,
                background: "#f4f4f4",
              }}
            >
              <Space
                direction="vertical"
                style={{ width: "100%" }}
                size="middle"
              >
                <div>
                  <Text strong>Recent Content:</Text>
                  <div style={{ marginTop: 12 }}>
                    {recentData.recentPosts.length > 0 && (
                      <div style={{ marginBottom: 12 }}>
                        <Text type="secondary">Latest Posts:</Text>
                        {recentData.recentPosts.map((post) => (
                          <Card
                            key={post.id}
                            size="small"
                            style={{ marginBottom: 8, borderRadius: 8 }}
                          >
                            <Row align="middle" justify="space-between">
                              <Col>
                                <Text strong>{post.title}</Text>
                                <br />
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                  {new Date(
                                    post.publishedAt
                                  ).toLocaleDateString()}
                                </Text>
                              </Col>
                              <Col>
                                <Button
                                  type="primary"
                                  size="small"
                                  icon={<EyeOutlined />}
                                  onClick={() =>
                                    router.push(`/posts/${post.slug}`)
                                  }
                                >
                                  View
                                </Button>
                              </Col>
                            </Row>
                          </Card>
                        ))}
                      </div>
                    )}

                    {recentData.recentCourses.length > 0 && (
                      <div style={{ marginBottom: 12 }}>
                        <Text type="secondary">Latest Courses:</Text>
                        {recentData.recentCourses.map((course) => (
                          <Card
                            key={course.id}
                            size="small"
                            style={{ marginBottom: 8, borderRadius: 8 }}
                          >
                            <Row align="middle" justify="space-between">
                              <Col>
                                <Text strong>{course.title}</Text>
                                <br />
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                  {
                                    enrollments.filter(
                                      (e) => e.courseId === course.id
                                    ).length
                                  }{" "}
                                  enrollments
                                </Text>
                              </Col>
                              <Col>
                                <Button
                                  type="primary"
                                  size="small"
                                  icon={<EyeOutlined />}
                                  onClick={() =>
                                    router.push(
                                      `/dashboard/courses/show/${course.id}`
                                    )
                                  }
                                >
                                  Manage
                                </Button>
                              </Col>
                            </Row>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>

        {/* My Courses */}
        <Card
          title={
            <span>
              <BookOutlined
                style={{
                  marginRight: 8,
                  color: "#1890ff",
                }}
              />
              My Courses ({courses.length})
            </span>
          }
          style={{
            marginTop: 16,
            borderRadius: 12,
            marginBottom: 16,
            background: "#f4f4f4",
          }}
        >
          {courses.length === 0 ? (
            <Empty
              description="You haven't created any courses yet"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <Button
                type="primary"
                icon={<BookOutlined />}
                onClick={() => router.push("/dashboard/courses/create")}
              >
                Create Your First Course
              </Button>
            </Empty>
          ) : (
            <Table
              columns={courseColumns}
              dataSource={courses}
              rowKey="id"
              pagination={{ pageSize: 5 }}
              size="middle"
            />
          )}
        </Card>

        {/* My Posts */}
        <Card
          title={
            <span>
              <FileTextOutlined style={{ marginRight: 8, color: "#52c41a" }} />
              My Posts ({posts.length})
            </span>
          }
          style={{ marginBottom: 16, borderRadius: 12, background: "#f4f4f4" }}
        >
          {posts.length === 0 ? (
            <Empty
              description="You haven't written any posts yet"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <Button
                type="primary"
                icon={<FileTextOutlined />}
                onClick={() => router.push("/dashboard/blog-posts/create")}
              >
                Write Your First Post
              </Button>
            </Empty>
          ) : (
            <Table
              columns={postColumns}
              dataSource={posts}
              rowKey="id"
              pagination={{ pageSize: 5 }}
              size="middle"
            />
          )}
        </Card>

        {/* My Events */}
        <Card
          title={
            <span>
              <CalendarOutlined style={{ marginRight: 8, color: "#faad14" }} />
              My Events ({events.length})
            </span>
          }
          style={{ borderRadius: 12, background: "#f4f4f4" }}
        >
          {events.length === 0 ? (
            <Empty
              description="You haven't created any events yet"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <Button
                type="primary"
                icon={<CalendarOutlined />}
                onClick={() => router.push("/dashboard/events/create")}
              >
                Create Your First Event
              </Button>
            </Empty>
          ) : (
            <Table
              columns={eventColumns}
              dataSource={events}
              rowKey="id"
              pagination={{ pageSize: 5 }}
              size="middle"
            />
          )}
        </Card>
      </div>
      {/* <Authenticated key="creator-dashboard">
        <NavigateToResource />
      </Authenticated> */}
    </>
  );
}
