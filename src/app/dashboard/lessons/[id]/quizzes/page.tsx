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
  QuestionCircleOutlined,
  PlayCircleOutlined,
  ArrowLeftOutlined,
  OrderedListOutlined,
  CheckCircleOutlined
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useList, useOne, useDelete } from "@refinedev/core";
import { IQuiz } from "@domain/models/quiz";
import { ILesson } from "@domain/models/lesson";

const { Title, Text } = Typography;

interface LessonQuizzesPageProps {
  params: {
    id: string;
  };
}

export default function LessonQuizzesPage({ params }: LessonQuizzesPageProps) {
  const router = useRouter();
  const lessonId = params.id;

  // Fetch lesson data
  const { data: lessonData } = useOne<ILesson>({
    resource: "lessons",
    id: lessonId,
  });

  // Fetch quizzes for this lesson
  const { data: quizesData, refetch: refetchQuizes } = useList<IQuiz>({
    resource: "quizes",
    filters: [
      {
        field: "lessonId",
        operator: "eq",
        value: lessonId,
      },
    ],
  });

  const lesson = lessonData?.data;
  const quizes = quizesData?.data || [];

  // Delete quiz mutation
  const { mutate: deleteQuiz } = useDelete();

  const handleCreateQuiz = () => {
    router.push(`/dashboard/quizes/create?lessonId=${lessonId}`);
  };

  const handleEditQuiz = (quiz: IQuiz) => {
    router.push(`/dashboard/quizes/edit/${quiz.id}`);
  };

  const handleDeleteQuiz = (quizId: string) => {
    deleteQuiz({
      resource: "quizes",
      id: quizId,
    }, {
      onSuccess: () => {
        message.success("Quiz deleted successfully");
        refetchQuizes();
      },
      onError: () => {
        message.error("Failed to delete quiz");
      },
    });
  };


  const columns = [
    {
      title: "Question",
      dataIndex: "question",
      key: "question",
      render: (question: string, record: IQuiz) => (
        <Space direction="vertical" size={4}>
          <Text strong>{question}</Text>
        </Space>
      ),
    },
    {
      title: "Answers",
      key: "answers",
      render: (record: IQuiz) => {
        const answers = Array.isArray(record.answers) ? record.answers : JSON.parse(record.answers || "[]");
        return (
          <Space direction="vertical" size={2}>
            {answers.map((answer: string, index: number) => (
              <Tag 
                key={index}
                color={index === record.correctAnswerIndex ? "green" : "default"}
                style={{ margin: 2 }}
              >
                {index === record.correctAnswerIndex && <CheckCircleOutlined style={{ marginRight: 4 }} />}
                {answer}
              </Tag>
            ))}
          </Space>
        );
      },
    },
    {
      title: "Correct Answer",
      dataIndex: "correctAnswerIndex",
      key: "correctAnswerIndex",
      width: 120,
      render: (index: number) => (
        <Tag color="green">
          Option {index + 1}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: (record: IQuiz) => (
        <Space>
          <Tooltip title="View Quiz">
            <Button 
              type="text" 
              icon={<EyeOutlined />}
              onClick={() => router.push(`/dashboard/quizes/show/${record.id}`)}
            />
          </Tooltip>
          <Tooltip title="Edit Quiz">
            <Button 
              type="text" 
              icon={<EditOutlined />}
              onClick={() => handleEditQuiz(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Are you sure you want to delete this quiz?"
            onConfirm={() => handleDeleteQuiz(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete Quiz">
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
      <PageBreadCrumbs items={["Dashboard", "LMS", "Lesson Quizzes"]} />
      
      <div style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}>
        {/* Header Section */}
        <Card style={{ marginBottom: 24, borderRadius: 12 }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Space>
                <Button 
                  icon={<ArrowLeftOutlined />}
                  onClick={() => router.push(`/dashboard/courses/${lesson?.courseId}/lessons`)}
                >
                  Back to Lessons
                </Button>
                <Divider type="vertical" />
                <Title level={3} style={{ margin: 0 }}>
                  <QuestionCircleOutlined style={{ marginRight: 8, color: "#722ed1" }} />
                  {lesson?.title || "Lesson Quizzes"}
                </Title>
              </Space>
              <div style={{ marginTop: 8 }}>
                <Text type="secondary">
                  Manage quizzes for this lesson
                </Text>
              </div>
            </Col>
            <Col>
              <Space>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={handleCreateQuiz}
                >
                  Add Quiz
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Lesson Info */}
        {lesson && (
          <Card style={{ marginBottom: 24, borderRadius: 12 }}>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={16}>
                <Title level={4}>{lesson.title}</Title>
                <Text type="secondary">{lesson.description}</Text>
              </Col>
              <Col xs={24} md={8}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 24, fontWeight: "bold", color: "#722ed1" }}>
                    {quizes.length}
                  </div>
                  <Text type="secondary">Quizzes</Text>
                </div>
              </Col>
            </Row>
          </Card>
        )}

        {/* Quizzes Table */}
        <Card 
          title={
            <span>
              <OrderedListOutlined style={{ marginRight: 8, color: "#722ed1" }} />
              Lesson Quizzes ({quizes.length})
            </span>
          }
          style={{ borderRadius: 12 }}
        >
          <Table
            columns={columns}
            dataSource={quizes}
            rowKey="id"
            pagination={false}
            size="middle"
          />
        </Card>

      </div>
    </>
  );
}
