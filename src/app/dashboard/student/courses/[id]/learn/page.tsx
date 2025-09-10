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
  List
} from "antd";
import { 
  BookOutlined, 
  UserOutlined, 
  PlayCircleOutlined, 
  QuestionCircleOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  EyeOutlined,
  ArrowLeftOutlined,
  OrderedListOutlined
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useList, useOne } from "@refinedev/core";
import { ICourse } from "@domain/models/course";
import { IEnrollment } from "@domain/models/enrollment";
import { ILesson } from "@domain/models/lesson";
import { IQuiz } from "@domain/models/quiz";

const { Title, Text } = Typography;

interface StudentCourseLearnProps {
  params: {
    id: string;
  };
}

export default function StudentCourseLearn({ params }: StudentCourseLearnProps) {
  const router = useRouter();
  const courseId = params.id;

  // Fetch course data
  const { data: courseData } = useOne<ICourse>({
    resource: "courses",
    id: courseId,
  });

  // Fetch lessons for this course
  const { data: lessonsData } = useList<ILesson>({
    resource: "lessons",
    filters: [
      {
        field: "courseId",
        operator: "eq",
        value: courseId,
      },
    ],
  });

  // Fetch quizzes for this course
  const { data: quizesData } = useList<IQuiz>({
    resource: "quizes",
    filters: lessonsData?.data ? [
      {
        field: "lessonId",
        operator: "in",
        value: lessonsData.data.map(lesson => lesson.id),
      },
    ] : [],
  });

  // Fetch student's enrollment for this course
  const { data: enrollmentData } = useList<IEnrollment>({
    resource: "enrollments",
    filters: [
      {
        field: "courseId",
        operator: "eq",
        value: courseId,
      },
    ],
  });

  const course = courseData?.data;
  const lessons = lessonsData?.data || [];
  const quizes = quizesData?.data || [];
  const enrollment = enrollmentData?.data?.[0];

  // Calculate progress
  const totalLessons = lessons.length;
  const completedLessons = 0; // This would need to be tracked in a separate table
  const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  const lessonColumns = [
    {
      title: "Lesson",
      dataIndex: "title",
      key: "title",
      render: (title: string, record: ILesson) => (
        <Space>
          <Avatar 
            src={record.imageUrl ? `${BASE_URL_UPLOADS_MEDIA}/${record.imageUrl}` : undefined}
            icon={<PlayCircleOutlined />} 
          />
          <div>
            <Text strong>{title}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Duration: {record.duration} minutes
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      render: (duration: number) => (
        <Tag color="blue">{duration} min</Tag>
      ),
    },
    {
      title: "Difficulty",
      dataIndex: "difficulty",
      key: "difficulty",
      render: (difficulty: string) => (
        <Tag color={difficulty === "Beginner" ? "green" : difficulty === "Intermediate" ? "orange" : "red"}>
          {difficulty}
        </Tag>
      ),
    },
    {
      title: "Quizzes",
      key: "quizzes",
      render: (record: ILesson) => {
        const lessonQuizes = quizes.filter(quiz => quiz.lessonId === record.id);
        return (
          <Badge 
            count={lessonQuizes.length} 
            style={{ backgroundColor: "#722ed1" }}
          />
        );
      },
    },
    {
      title: "Status",
      key: "status",
      render: (record: ILesson) => {
        const isCompleted = false; // This would need to be tracked
        return (
          <Tag color={isCompleted ? "green" : "default"}>
            {isCompleted ? "Completed" : "Not Started"}
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: ILesson) => (
        <Space>
          <Tooltip title="Start Lesson">
            <Button 
              type="primary" 
              icon={<PlayCircleOutlined />}
              onClick={() => router.push(`/dashboard/student/lessons/${record.id}`)}
            >
              Start
            </Button>
          </Tooltip>
          <Tooltip title="Take Quiz">
            <Button 
              icon={<QuestionCircleOutlined />}
              onClick={() => router.push(`/dashboard/student/lessons/${record.id}/quiz`)}
              disabled={quizes.filter(q => q.lessonId === record.id).length === 0}
            >
              Quiz
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  if (!course) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <PageBreadCrumbs items={["Dashboard", "Student", "Learn"]} />
      
      <div style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}>
        {/* Header Section */}
        <Card style={{ marginBottom: 24, borderRadius: 12 }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Space>
                <Button 
                  icon={<ArrowLeftOutlined />}
                  onClick={() => router.push("/dashboard/student")}
                >
                  Back to Dashboard
                </Button>
                <Divider type="vertical" />
                <Title level={2} style={{ margin: 0 }}>
                  <BookOutlined style={{ marginRight: 8, color: "#1890ff" }} />
                  {course.title}
                </Title>
              </Space>
              <div style={{ marginTop: 8 }}>
                <Text type="secondary">{course.description}</Text>
              </div>
            </Col>
            <Col>
              <Space>
                <Button 
                  icon={<EyeOutlined />}
                  onClick={() => router.push(`/courses/${course.slug}`)}
                >
                  View Course Page
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        <Row gutter={[16, 16]}>
          {/* Course Information */}
          <Col xs={24} lg={16}>
            <Card title="Course Information" style={{ borderRadius: 12, marginBottom: 16 }}>
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Title level={4}>{course.title}</Title>
                  <Text type="secondary">{course.description}</Text>
                  <div style={{ marginTop: 16 }}>
                    <Space wrap>
                      <Tag color="blue">Duration: {lessons.reduce((acc, lesson) => acc + lesson.duration, 0)} minutes</Tag>
                      <Tag color="green">{lessons.length} Lessons</Tag>
                      <Tag color="purple">{quizes.length} Quizzes</Tag>
                    </Space>
                  </div>
                </Col>
                <Col xs={24} md={12}>
                  {course.imageUrl && (
                    <img
                      src={`${BASE_URL_UPLOADS_MEDIA}/${course.imageUrl}`}
                      alt={course.title}
                      style={{ 
                        width: "100%", 
                        height: 200, 
                        objectFit: "cover", 
                        borderRadius: 8 
                      }}
                    />
                  )}
                </Col>
              </Row>
            </Card>

            {/* Course Progress */}
            <Card title="Course Progress" style={{ borderRadius: 12, marginBottom: 16 }}>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={8}>
                  <Statistic
                    title="Progress"
                    value={Math.round(progressPercentage)}
                    suffix="%"
                    prefix={<TrophyOutlined style={{ color: "#1890ff" }} />}
                    valueStyle={{ color: "#1890ff" }}
                  />
                </Col>
                <Col xs={24} sm={8}>
                  <Statistic
                    title="Completed Lessons"
                    value={completedLessons}
                    suffix={`/ ${totalLessons}`}
                    prefix={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
                    valueStyle={{ color: "#52c41a" }}
                  />
                </Col>
                <Col xs={24} sm={8}>
                  <Statistic
                    title="Time Spent"
                    value={0}
                    suffix="minutes"
                    prefix={<ClockCircleOutlined style={{ color: "#722ed1" }} />}
                    valueStyle={{ color: "#722ed1" }}
                  />
                </Col>
              </Row>
              <Progress 
                percent={Math.round(progressPercentage)} 
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }}
                style={{ marginTop: 16 }}
              />
            </Card>

            {/* Course Lessons */}
            <Card 
              title={
                <span>
                  <OrderedListOutlined style={{ marginRight: 8, color: "#1890ff" }} />
                  Course Lessons ({lessons.length})
                </span>
              }
              style={{ borderRadius: 12 }}
            >
              {lessons.length === 0 ? (
                <Empty 
                  description="No lessons available yet"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ) : (
                <Table
                  columns={lessonColumns}
                  dataSource={lessons}
                  rowKey="id"
                  pagination={false}
                  size="middle"
                />
              )}
            </Card>
          </Col>

          {/* Course Sidebar */}
          <Col xs={24} lg={8}>
            {/* Enrollment Info */}
            {enrollment && (
              <Card title="Enrollment Info" style={{ borderRadius: 12, marginBottom: 16 }}>
                <Space direction="vertical" style={{ width: "100%" }}>
                  <div>
                    <Text type="secondary">Enrolled:</Text>
                    <br />
                    <Text strong>{new Date(enrollment.enrollmentDate).toLocaleDateString()}</Text>
                  </div>
                  <div>
                    <Text type="secondary">Expected Completion:</Text>
                    <br />
                    <Text strong>{new Date(enrollment.completionDate).toLocaleDateString()}</Text>
                  </div>
                  <div>
                    <Text type="secondary">Status:</Text>
                    <br />
                    <Tag color="blue">Enrolled</Tag>
                  </div>
                </Space>
              </Card>
            )}

            {/* Course Stats */}
            <Card title="Course Statistics" style={{ borderRadius: 12, marginBottom: 16 }}>
              <Space direction="vertical" style={{ width: "100%" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 24, fontWeight: "bold", color: "#1890ff" }}>
                    {lessons.length}
                  </div>
                  <Text type="secondary">Lessons</Text>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 24, fontWeight: "bold", color: "#722ed1" }}>
                    {quizes.length}
                  </div>
                  <Text type="secondary">Quizzes</Text>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 24, fontWeight: "bold", color: "#52c41a" }}>
                    {lessons.reduce((acc, lesson) => acc + lesson.duration, 0)}
                  </div>
                  <Text type="secondary">Total Minutes</Text>
                </div>
              </Space>
            </Card>

            {/* Quick Actions */}
            <Card title="Quick Actions" style={{ borderRadius: 12 }}>
              <Space direction="vertical" style={{ width: "100%" }} size="middle">
                <Button 
                  type="primary" 
                  icon={<PlayCircleOutlined />}
                  onClick={() => {
                    if (lessons.length > 0) {
                      router.push(`/dashboard/student/lessons/${lessons[0].id}`);
                    }
                  }}
                  block
                  disabled={lessons.length === 0}
                >
                  Start First Lesson
                </Button>
                <Button 
                  icon={<QuestionCircleOutlined />}
                  onClick={() => router.push(`/dashboard/student/courses/${courseId}/quizzes`)}
                  block
                  disabled={quizes.length === 0}
                >
                  Take Quizzes
                </Button>
                <Button 
                  icon={<TrophyOutlined />}
                  onClick={() => router.push(`/dashboard/student/courses/${courseId}/certificate`)}
                  block
                  disabled={progressPercentage < 100}
                >
                  Get Certificate
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}
