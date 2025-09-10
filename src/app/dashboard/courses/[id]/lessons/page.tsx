"use client";

import React from "react";
import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import { 
  Card, 
  Row, 
  Col, 
  Button, 
  Space, 
  Typography, 
  Table,
  Tag,
  message,
  Popconfirm,
  Tooltip,
  Badge,
  Divider
} from "antd";
import { 
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlayCircleOutlined,
  QuestionCircleOutlined,
  BookOutlined,
  ArrowLeftOutlined,
  OrderedListOutlined
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useList, useOne, useDelete } from "@refinedev/core";
import { ILesson } from "@domain/models/lesson";
import { IQuiz } from "@domain/models/quiz";
import { ICourse } from "@domain/models/course";

const { Title, Text } = Typography;

interface CourseLessonsPageProps {
  params: {
    id: string;
  };
}

export default function CourseLessonsPage({ params }: CourseLessonsPageProps) {
  const router = useRouter();

  const courseId = params.id;

  // Fetch course data
  const { data: courseData } = useOne<ICourse>({
    resource: "courses",
    id: courseId,
  });

  // Fetch lessons for this course
  const { data: lessonsData, refetch: refetchLessons } = useList<ILesson>({
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
    filters: [
      {
        field: "lessonId",
        operator: "in",
        value: lessonsData?.data?.map(lesson => lesson.id) || [],
      },
    ],
  });

  const course = courseData?.data;
  const lessons = lessonsData?.data || [];
  const quizes = quizesData?.data || [];

  // Delete lesson mutation
  const { mutate: deleteLesson } = useDelete();

  const handleCreateLesson = () => {
    router.push(`/dashboard/lessons/create?courseId=${courseId}`);
  };

  const handleEditLesson = (lesson: ILesson) => {
    router.push(`/dashboard/lessons/edit/${lesson.id}`);
  };

  const handleDeleteLesson = (lessonId: string) => {
    deleteLesson({
      resource: "lessons",
      id: lessonId,
    }, {
      onSuccess: () => {
        message.success("Lesson deleted successfully");
        refetchLessons();
      },
      onError: () => {
        message.error("Failed to delete lesson");
      },
    });
  };


  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (title: string, record: ILesson) => (
        <Space direction="vertical" size={4}>
          <Text strong>{title}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Duration: {record.duration} minutes
          </Text>
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "isPublished",
      key: "isPublished",
      width: 100,
      render: (isPublished: boolean) => (
        <Tag color={isPublished ? "green" : "orange"}>
          {isPublished ? "Published" : "Draft"}
        </Tag>
      ),
    },
    {
      title: "Quizzes",
      key: "quizzes",
      width: 100,
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
      title: "Actions",
      key: "actions",
      width: 200,
      render: (record: ILesson) => (
        <Space>
          <Tooltip title="View Lesson">
            <Button 
              type="text" 
              icon={<EyeOutlined />}
              onClick={() => router.push(`/dashboard/lessons/show/${record.id}`)}
            />
          </Tooltip>
          <Tooltip title="Edit Lesson">
            <Button 
              type="text" 
              icon={<EditOutlined />}
              onClick={() => handleEditLesson(record)}
            />
          </Tooltip>
          <Tooltip title="Manage Quizzes">
            <Button 
              type="text" 
              icon={<QuestionCircleOutlined />}
              onClick={() => router.push(`/dashboard/lessons/${record.id}/quizzes`)}
            />
          </Tooltip>
          <Popconfirm
            title="Are you sure you want to delete this lesson?"
            onConfirm={() => handleDeleteLesson(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete Lesson">
              <Button 
                type="text" 
                danger 
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <PageBreadCrumbs items={["Dashboard", "LMS", "Course Lessons"]} />
      
      <div style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}>
        {/* Header Section */}
        <Card style={{ marginBottom: 24, borderRadius: 12 }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Space>
                <Button 
                  icon={<ArrowLeftOutlined />}
                  onClick={() => router.push("/dashboard/lms")}
                >
                  Back to LMS
                </Button>
                <Divider type="vertical" />
                <Title level={3} style={{ margin: 0 }}>
                  <BookOutlined style={{ marginRight: 8, color: "#1890ff" }} />
                  {course?.title || "Course Lessons"}
                </Title>
              </Space>
              <div style={{ marginTop: 8 }}>
                <Text type="secondary">
                  Manage lessons and quizzes for this course
                </Text>
              </div>
            </Col>
            <Col>
              <Space>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={handleCreateLesson}
                >
                  Add Lesson
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Course Info */}
        {course && (
          <Card style={{ marginBottom: 24, borderRadius: 12 }}>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={16}>
                <Title level={4}>{course.title}</Title>
                <Text type="secondary">{course.description}</Text>
              </Col>
              <Col xs={24} md={8}>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 24, fontWeight: "bold", color: "#1890ff" }}>
                        {lessons.length}
                      </div>
                      <Text type="secondary">Lessons</Text>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 24, fontWeight: "bold", color: "#722ed1" }}>
                        {quizes.length}
                      </div>
                      <Text type="secondary">Quizzes</Text>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>
        )}

        {/* Lessons Table */}
        <Card 
          title={
            <span>
              <OrderedListOutlined style={{ marginRight: 8, color: "#1890ff" }} />
              Course Lessons ({lessons.length})
            </span>
          }
          style={{ borderRadius: 12 }}
        >
          <Table
            columns={columns}
            dataSource={lessons}
            rowKey="id"
            pagination={false}
            size="middle"
          />
        </Card>

      </div>
    </>
  );
}
