"use client";

import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Descriptions,
  Tag,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Table,
  Tooltip,
  Tabs,
  Select,
  Switch,
  InputNumber,
  Space,
  Popconfirm,
  Typography,
} from "antd";
import {
  ClockCircleOutlined,
  BookOutlined,
  TrophyOutlined,
  PlusOutlined,
  MinusCircleOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import EnhancedBreadcrumb from "@components/shared/enhanced-breadcrumb/enhanced-breadcrumb.component";
import { useParams } from "next/navigation";
import { useGetSingleLessonQuery } from "@store/api/lesson_api";
import {
  useGetAssignmentsByLessonQuery,
  useCreateAssignmentMutation,
  useUpdateAssignmentMutation,
  useDeleteAssignmentMutation,
} from "@store/api/assignment_api";
import {
  useGetQuizzesByLessonQuery,
  useCreateQuizMutation,
  useUpdateQuizMutation,
  useDeleteQuizMutation,
} from "@store/api/quiz_api";
import { useNotification } from "@refinedev/core";
import Link from "next/link";
import slugify from "slugify";

const { Text } = Typography;

const LessonDetailsPage: React.FC = () => {
  const params = useParams();
  const id = params?.id as string;

  const { data: lesson, isLoading: lessonLoading } =
    useGetSingleLessonQuery(id);
  const { data: assignments = [], isLoading: assignLoading } =
    useGetAssignmentsByLessonQuery(id);
  const { data: quizzes = [], isLoading: quizLoading } =
    useGetQuizzesByLessonQuery(id);
  const [createAssignment, { isLoading: creatingAssignment }] =
    useCreateAssignmentMutation();
  const [updateAssignment, { isLoading: updatingAssignment }] =
    useUpdateAssignmentMutation();
  const [deleteAssignment, { isLoading: deletingAssignment }] =
    useDeleteAssignmentMutation();
  const [createQuiz, { isLoading: creatingQuiz }] = useCreateQuizMutation();
  const [updateQuiz, { isLoading: updatingQuiz }] = useUpdateQuizMutation();
  const [deleteQuiz, { isLoading: deletingQuiz }] = useDeleteQuizMutation();
  const { open } = useNotification();

  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false);
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<any>(null);
  const [editingQuiz, setEditingQuiz] = useState<any>(null);
  const [viewAssignment, setViewAssignment] = useState<any>(null);
  const [viewQuiz, setViewQuiz] = useState<any>(null);
  const [viewAssignmentModalOpen, setViewAssignmentModalOpen] = useState(false);
  const [viewQuizModalOpen, setViewQuizModalOpen] = useState(false);
  const [assignmentForm] = Form.useForm();
  const [quizForm] = Form.useForm();

  // Assignment handlers
  const handleViewAssignment = (assignment: any) => {
    setViewAssignment(assignment);
    setViewAssignmentModalOpen(true);
  };

  const handleEditAssignment = (assignment: any) => {
    setEditingAssignment(assignment);
    // Parse rubric if it's a JSON string
    const assignmentData = {
      ...assignment,
      rubricCriteria: assignment.rubric
        ? typeof assignment.rubric === "string"
          ? JSON.parse(assignment.rubric).criteria || []
          : assignment.rubric.criteria || []
        : [{ criterion: "", points: 10, description: "" }],
    };
    assignmentForm.setFieldsValue(assignmentData);
    setAssignmentModalOpen(true);
  };

  const handleDeleteAssignment = async (assignmentId: string) => {
    try {
      await deleteAssignment(assignmentId).unwrap();
      open?.({
        type: "success",
        message: "Success",
        description: "Assignment deleted successfully!",
      });
    } catch (error: any) {
      open?.({
        type: "error",
        message: "Error",
        description: `Failed to delete assignment: ${error.message}`,
      });
    }
  };

  // Quiz handlers
  const handleViewQuiz = (quiz: any) => {
    setViewQuiz(quiz);
    setViewQuizModalOpen(true);
  };

  const handleEditQuiz = (quiz: any) => {
    setEditingQuiz(quiz);
    // Parse answers if it's a JSON string
    const quizData = {
      ...quiz,
      answers:
        typeof quiz.answers === "string"
          ? JSON.parse(quiz.answers || "[]")
          : quiz.answers,
    };
    quizForm.setFieldsValue(quizData);
    setQuizModalOpen(true);
  };

  const handleDeleteQuiz = async (quizId: string) => {
    try {
      await deleteQuiz(quizId).unwrap();
      open?.({
        type: "success",
        message: "Success",
        description: "Quiz deleted successfully!",
      });
    } catch (error: any) {
      open?.({
        type: "error",
        message: "Error",
        description: `Failed to delete quiz: ${error.message}`,
      });
    }
  };

  const loading = lessonLoading || assignLoading || quizLoading;

  return (
    <div>
      <EnhancedBreadcrumb
        items={[
          { title: "Dashboard", href: "/dashboard/creator" },
          { title: "Lessons", href: "/dashboard/modules" },
          { title: lesson?.title || "Lesson" },
        ]}
        showBackButton
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card
            bordered={false}
            style={{
              backgroundColor: "white",
              borderRadius: 12,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              border: "none",
            }}
          >
            <Statistic
              title="Assignments"
              value={assignments.length}
              prefix={<BookOutlined />}
              valueStyle={{ fontSize: 20 }}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card
            bordered={false}
            style={{
              backgroundColor: "white",
              borderRadius: 12,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              border: "none",
            }}
          >
            <Statistic
              title="Quizzes"
              value={quizzes.length}
              prefix={<TrophyOutlined />}
              valueStyle={{ fontSize: 20 }}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card
            bordered={false}
            style={{
              backgroundColor: "white",
              borderRadius: 12,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              border: "none",
            }}
          >
            <Statistic
              title="Duration (min)"
              value={lesson?.durationMinutes ?? 0}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ fontSize: 20 }}
            />
          </Card>
        </Col>
      </Row>

      <Card
        bordered={false}
        style={{
          marginTop: 16,
          backgroundColor: "white",
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          border: "none",
        }}
        loading={loading}
      >
        {lesson && (
          <Descriptions
            column={2}
            bordered
            size="small"
            title="Lesson Information"
          >
            <Descriptions.Item label="Title">{lesson.title}</Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag
                color={
                  lesson.status === "published"
                    ? "green"
                    : lesson.status === "draft"
                    ? "orange"
                    : "gray"
                }
              >
                {lesson.status}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Difficulty">
              {lesson.difficulty}
            </Descriptions.Item>
            <Descriptions.Item label="Type">
              {lesson.lessonType}
            </Descriptions.Item>
            <Descriptions.Item label="Order">
              {lesson.lessonOrder}
            </Descriptions.Item>
            <Descriptions.Item label="Language">
              {lesson.language || "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Created">
              {new Date(lesson.createdAt).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Updated">
              {new Date(lesson.updatedAt).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Description" span={2}>
              {lesson.description}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Card>

      {/* Tabs with tables and per-tab controls */}
      <Card
        bordered={false}
        style={{
          marginTop: 16,
          backgroundColor: "white",
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          border: "none",
        }}
      >
        <Tabs
          defaultActiveKey="assignments"
          items={[
            {
              key: "assignments",
              label: `Assignments (${assignments.length})`,
              children: (
                <>
                  <Row justify="end" style={{ marginBottom: 12 }}>
                    <Button
                      type="primary"
                      onClick={() => setAssignmentModalOpen(true)}
                    >
                      New Assignment
                    </Button>
                  </Row>
                  <Table
                    size="small"
                    dataSource={assignments}
                    rowKey={(r: any) => r.id}
                    loading={assignLoading}
                    pagination={{
                      pageSize: 10,
                      showSizeChanger: true,
                      showQuickJumper: true,
                    }}
                    scroll={{ x: 1200 }}
                    columns={[
                      {
                        title: "#",
                        dataIndex: "assignmentOrder",
                        key: "assignmentOrder",
                        width: 60,
                        sorter: (a: any, b: any) =>
                          (a.assignmentOrder || 0) - (b.assignmentOrder || 0),
                        render: (value: number) => (
                          <Tag
                            color="blue"
                            style={{ fontWeight: "bold", fontSize: 12 }}
                          >
                            {value || 1}
                          </Tag>
                        ),
                      },
                      {
                        title: "Assignment Title",
                        dataIndex: "title",
                        key: "title",
                        render: (title: string, record: any) => (
                          <div>
                            <div
                              style={{ fontWeight: "bold", marginBottom: 2 }}
                            >
                              {title}
                            </div>
                            <div style={{ fontSize: 11, color: "#666" }}>
                              ID: {record.id?.substring(0, 8)}...
                            </div>
                          </div>
                        ),
                      },
                      {
                        title: "Type",
                        dataIndex: "assignmentType",
                        key: "assignmentType",
                        width: 100,
                        render: (value: string) => (
                          <Tag color="purple">{value || "essay"}</Tag>
                        ),
                      },
                      {
                        title: "Score",
                        key: "score",
                        width: 120,
                        render: (_: any, record: any) => (
                          <div style={{ textAlign: "center" }}>
                            <div style={{ fontSize: 12, fontWeight: "bold" }}>
                              {record.maxScore || 100} pts
                            </div>
                            <div style={{ fontSize: 10, color: "#666" }}>
                              Pass: {record.passingScore || 50}
                            </div>
                          </div>
                        ),
                      },
                      {
                        title: "Status",
                        dataIndex: "status",
                        key: "status",
                        width: 100,
                        filters: [
                          { text: "Published", value: "published" },
                          { text: "Draft", value: "draft" },
                          { text: "Archived", value: "archived" },
                        ],
                        onFilter: (value: any, record: any) =>
                          record.status === value,
                        render: (value: string) => {
                          const statusConfig = {
                            published: { color: "green", text: "Published" },
                            draft: { color: "orange", text: "Draft" },
                            archived: { color: "gray", text: "Archived" },
                          };
                          const config = statusConfig[
                            value as keyof typeof statusConfig
                          ] || {
                            color: "default",
                            text: value,
                          };
                          return <Tag color={config.color}>{config.text}</Tag>;
                        },
                      },
                      {
                        title: "Due Date",
                        dataIndex: "dueDate",
                        key: "dueDate",
                        width: 140,
                        sorter: (a: any, b: any) =>
                          new Date(a.dueDate || 0).getTime() -
                          new Date(b.dueDate || 0).getTime(),
                        render: (v: string) =>
                          v ? new Date(v).toLocaleDateString() : "-",
                      },
                      {
                        title: "Created",
                        dataIndex: "createdAt",
                        key: "createdAt",
                        width: 140,
                        sorter: (a: any, b: any) =>
                          new Date(a.createdAt).getTime() -
                          new Date(b.createdAt).getTime(),
                        render: (v: string) => new Date(v).toLocaleDateString(),
                      },
                      {
                        title: "Actions",
                        key: "actions",
                        width: 280,
                        render: (_: any, record: any) => (
                          <Space size="small" wrap>
                            <Tooltip title="View details">
                              <Button
                                icon={<EyeOutlined />}
                                size="small"
                                ghost
                                style={{ borderRadius: 8 }}
                                onClick={() => handleViewAssignment(record)}
                              />
                            </Tooltip>
                            <Tooltip title="Edit assignment">
                              <Button
                                type="primary"
                                icon={<EditOutlined />}
                                size="small"
                                ghost
                                style={{ borderRadius: 8 }}
                                onClick={() => handleEditAssignment(record)}
                              />
                            </Tooltip>
                            <Tooltip title="Manage assignment">
                              <Link
                                href={`/dashboard/assignments/${record.id}`}
                              >
                                <Button
                                  type="dashed"
                                  size="small"
                                  style={{ borderRadius: 8 }}
                                >
                                  Manage
                                </Button>
                              </Link>
                            </Tooltip>
                            <Popconfirm
                              title="Delete Assignment"
                              description="Are you sure you want to delete this assignment?"
                              onConfirm={() =>
                                handleDeleteAssignment(record.id)
                              }
                              okText="Yes"
                              cancelText="No"
                            >
                              <Tooltip title="Delete assignment">
                                <Button
                                  icon={<DeleteOutlined />}
                                  size="small"
                                  danger
                                  ghost
                                  style={{ borderRadius: 8 }}
                                  loading={deletingAssignment}
                                />
                              </Tooltip>
                            </Popconfirm>
                          </Space>
                        ),
                      },
                    ]}
                  />
                </>
              ),
            },
            {
              key: "quizzes",
              label: `Quizzes (${quizzes.length})`,
              children: (
                <>
                  <Row justify="end" style={{ marginBottom: 12 }}>
                    <Button onClick={() => setQuizModalOpen(true)}>
                      New Quiz
                    </Button>
                  </Row>
                  <Table
                    size="small"
                    dataSource={quizzes}
                    rowKey={(r: any) => r.id}
                    loading={quizLoading}
                    pagination={{
                      pageSize: 10,
                      showSizeChanger: true,
                      showQuickJumper: true,
                    }}
                    scroll={{ x: 1200 }}
                    columns={[
                      {
                        title: "#",
                        dataIndex: "quizOrder",
                        key: "quizOrder",
                        width: 60,
                        sorter: (a: any, b: any) =>
                          (a.quizOrder || 0) - (b.quizOrder || 0),
                        render: (value: number) => (
                          <Tag
                            color="blue"
                            style={{ fontWeight: "bold", fontSize: 12 }}
                          >
                            {value || 1}
                          </Tag>
                        ),
                      },
                      {
                        title: "Quiz Title",
                        dataIndex: "title",
                        key: "title",
                        render: (title: string, record: any) => (
                          <div>
                            <div
                              style={{ fontWeight: "bold", marginBottom: 2 }}
                            >
                              {title}
                            </div>
                            <div style={{ fontSize: 11, color: "#666" }}>
                              ID: {record.id?.substring(0, 8)}...
                            </div>
                          </div>
                        ),
                      },
                      {
                        title: "Question",
                        dataIndex: "question",
                        key: "question",
                        ellipsis: { showTitle: false },
                        render: (text: string) => (
                          <Tooltip title={text}>
                            <div style={{ maxWidth: 200 }}>{text}</div>
                          </Tooltip>
                        ),
                      },
                      {
                        title: "Type",
                        dataIndex: "quizType",
                        key: "quizType",
                        width: 120,
                        render: (value: string) => (
                          <Tag color="cyan">{value || "multiple_choice"}</Tag>
                        ),
                      },
                      {
                        title: "Difficulty",
                        dataIndex: "difficulty",
                        key: "difficulty",
                        width: 100,
                        filters: [
                          { text: "Easy", value: "easy" },
                          { text: "Medium", value: "medium" },
                          { text: "Hard", value: "hard" },
                        ],
                        onFilter: (value: any, record: any) =>
                          record.difficulty === value,
                        render: (value: string) => {
                          const config = {
                            easy: { color: "green", text: "Easy" },
                            medium: { color: "orange", text: "Medium" },
                            hard: { color: "red", text: "Hard" },
                          };
                          const difficultyConfig = config[
                            value as keyof typeof config
                          ] || {
                            color: "default",
                            text: value,
                          };
                          return (
                            <Tag color={difficultyConfig.color}>
                              {difficultyConfig.text}
                            </Tag>
                          );
                        },
                      },
                      {
                        title: "Points",
                        dataIndex: "points",
                        key: "points",
                        width: 80,
                        align: "center" as const,
                        sorter: (a: any, b: any) =>
                          (a.points || 0) - (b.points || 0),
                        render: (value: number) => (
                          <Tag color="gold">{value || 1} pts</Tag>
                        ),
                      },
                      {
                        title: "Status",
                        dataIndex: "status",
                        key: "status",
                        width: 100,
                        filters: [
                          { text: "Published", value: "published" },
                          { text: "Draft", value: "draft" },
                          { text: "Archived", value: "archived" },
                        ],
                        onFilter: (value: any, record: any) =>
                          record.status === value,
                        render: (value: string) => {
                          const statusConfig = {
                            published: { color: "green", text: "Published" },
                            draft: { color: "orange", text: "Draft" },
                            archived: { color: "gray", text: "Archived" },
                          };
                          const config = statusConfig[
                            value as keyof typeof statusConfig
                          ] || {
                            color: "default",
                            text: value,
                          };
                          return <Tag color={config.color}>{config.text}</Tag>;
                        },
                      },
                      {
                        title: "Created",
                        dataIndex: "createdAt",
                        key: "createdAt",
                        width: 140,
                        sorter: (a: any, b: any) =>
                          new Date(a.createdAt).getTime() -
                          new Date(b.createdAt).getTime(),
                        render: (v: string) => new Date(v).toLocaleDateString(),
                      },
                      {
                        title: "Actions",
                        key: "actions",
                        width: 280,
                        render: (_: any, record: any) => (
                          <Space size="small" wrap>
                            <Tooltip title="View details">
                              <Button
                                icon={<EyeOutlined />}
                                size="small"
                                ghost
                                style={{ borderRadius: 8 }}
                                onClick={() => handleViewQuiz(record)}
                              />
                            </Tooltip>
                            <Tooltip title="Edit quiz">
                              <Button
                                type="primary"
                                icon={<EditOutlined />}
                                size="small"
                                ghost
                                style={{ borderRadius: 8 }}
                                onClick={() => handleEditQuiz(record)}
                              />
                            </Tooltip>
                            <Tooltip title="Manage quiz">
                              <Link href={`/dashboard/quizzes/${record.id}`}>
                                <Button
                                  type="dashed"
                                  size="small"
                                  style={{ borderRadius: 8 }}
                                >
                                  Manage
                                </Button>
                              </Link>
                            </Tooltip>
                            <Popconfirm
                              title="Delete Quiz"
                              description="Are you sure you want to delete this quiz?"
                              onConfirm={() => handleDeleteQuiz(record.id)}
                              okText="Yes"
                              cancelText="No"
                            >
                              <Tooltip title="Delete quiz">
                                <Button
                                  icon={<DeleteOutlined />}
                                  size="small"
                                  danger
                                  ghost
                                  style={{ borderRadius: 8 }}
                                  loading={deletingQuiz}
                                />
                              </Tooltip>
                            </Popconfirm>
                          </Space>
                        ),
                      },
                    ]}
                  />
                </>
              ),
            },
          ]}
        />
      </Card>

      {/* Create/Edit Assignment Modal */}
      <Modal
        title={
          editingAssignment
            ? `Edit Assignment: ${editingAssignment.title}`
            : "Create Assignment"
        }
        open={assignmentModalOpen}
        onCancel={() => {
          setAssignmentModalOpen(false);
          setEditingAssignment(null);
          assignmentForm.resetFields();
        }}
        onOk={() => assignmentForm.submit()}
        okButtonProps={{ loading: creatingAssignment || updatingAssignment }}
      >
        <Card bordered={false} style={{ backgroundColor: "white" }}>
          {" "}
          <Form
            form={assignmentForm}
            layout="vertical"
            onFinish={async (values) => {
              try {
                if (editingAssignment) {
                  // Update assignment
                  await updateAssignment({
                    id: editingAssignment.id,
                    assignment: {
                      title: values.title,
                      slug: slugify(values.title, {
                        lower: true,
                        replacement: "-",
                      }),
                      description: values.description || "",
                      instructions: values.instructions || "",
                      lessonId: id,
                      courseId: lesson?.courseId,
                      moduleId: lesson?.moduleId,
                      userId: lesson?.userId || "",
                      assignmentType: values.assignmentType || "essay",
                      status: values.status || "draft",
                      assignmentOrder: values.assignmentOrder ?? 1,
                      maxScore: Number(values.maxScore ?? 100),
                      passingScore: Number(values.passingScore ?? 50),
                      maxAttempts: Number(values.maxAttempts ?? 3),
                      timeLimitMinutes: values.timeLimitMinutes
                        ? Number(values.timeLimitMinutes)
                        : undefined,
                      availableFrom: values.availableFrom
                        ? values.availableFrom instanceof Date
                          ? values.availableFrom.toISOString()
                          : values.availableFrom
                        : undefined,
                      dueDate: values.dueDate
                        ? values.dueDate instanceof Date
                          ? values.dueDate.toISOString()
                          : values.dueDate
                        : undefined,
                      lateSubmissionAllowed: !!values.lateSubmissionAllowed,
                      latePenaltyPercent:
                        values.latePenaltyPercent != null
                          ? Number(values.latePenaltyPercent)
                          : undefined,
                      submissionFormat: values.submissionFormat || "text",
                      allowedFileTypes: values.allowedFileTypes || undefined,
                      maxFileSizeMb:
                        values.maxFileSizeMb != null
                          ? Number(values.maxFileSizeMb)
                          : undefined,
                      minWordCount:
                        values.minWordCount != null
                          ? Number(values.minWordCount)
                          : undefined,
                      maxWordCount:
                        values.maxWordCount != null
                          ? Number(values.maxWordCount)
                          : undefined,
                      autoGrade: !!values.autoGrade,
                      rubric: values.rubricCriteria
                        ? JSON.stringify({ criteria: values.rubricCriteria })
                        : undefined,
                      peerReviewEnabled: !!values.peerReviewEnabled,
                      peerReviewsRequired:
                        values.peerReviewsRequired != null
                          ? Number(values.peerReviewsRequired)
                          : undefined,
                      referenceMaterials:
                        values.referenceMaterials || undefined,
                      sampleSubmissions: values.sampleSubmissions || undefined,
                    },
                  }).unwrap();
                  open?.({
                    type: "success",
                    message: "Success",
                    description: "Assignment updated successfully!",
                  });
                } else {
                  // Create assignment
                  await createAssignment({
                    title: values.title,
                    slug: slugify(values.title, {
                      lower: true,
                      replacement: "-",
                    }),
                    description: values.description || "",
                    instructions: values.instructions || "",
                    lessonId: id,
                    courseId: lesson?.courseId,
                    moduleId: lesson?.moduleId,
                    userId: lesson?.userId || "",
                    assignmentType: values.assignmentType || "essay",
                    status: values.status || "draft",
                    assignmentOrder: values.assignmentOrder ?? 1,
                    maxScore: Number(values.maxScore ?? 100),
                    passingScore: Number(values.passingScore ?? 50),
                    maxAttempts: Number(values.maxAttempts ?? 3),
                    timeLimitMinutes: values.timeLimitMinutes
                      ? Number(values.timeLimitMinutes)
                      : undefined,
                    availableFrom: values.availableFrom
                      ? values.availableFrom instanceof Date
                        ? values.availableFrom.toISOString()
                        : values.availableFrom
                      : undefined,
                    dueDate: values.dueDate
                      ? values.dueDate instanceof Date
                        ? values.dueDate.toISOString()
                        : values.dueDate
                      : undefined,
                    lateSubmissionAllowed: !!values.lateSubmissionAllowed,
                    latePenaltyPercent:
                      values.latePenaltyPercent != null
                        ? Number(values.latePenaltyPercent)
                        : undefined,
                    submissionFormat: values.submissionFormat || "text",
                    allowedFileTypes: values.allowedFileTypes || undefined,
                    maxFileSizeMb:
                      values.maxFileSizeMb != null
                        ? Number(values.maxFileSizeMb)
                        : undefined,
                    minWordCount:
                      values.minWordCount != null
                        ? Number(values.minWordCount)
                        : undefined,
                    maxWordCount:
                      values.maxWordCount != null
                        ? Number(values.maxWordCount)
                        : undefined,
                    autoGrade: !!values.autoGrade,
                    rubric: values.rubricCriteria
                      ? JSON.stringify({ criteria: values.rubricCriteria })
                      : undefined,
                    peerReviewEnabled: !!values.peerReviewEnabled,
                    peerReviewsRequired:
                      values.peerReviewsRequired != null
                        ? Number(values.peerReviewsRequired)
                        : undefined,
                    referenceMaterials: values.referenceMaterials || undefined,
                    sampleSubmissions: values.sampleSubmissions || undefined,
                  }).unwrap();
                  open?.({
                    type: "success",
                    message: "Success",
                    description: "Assignment created successfully!",
                  });
                }
                setAssignmentModalOpen(false);
                setEditingAssignment(null);
                assignmentForm.resetFields();
              } catch (e: any) {
                open?.({
                  type: "error",
                  message: "Error",
                  description:
                    e?.data?.message ||
                    e?.message ||
                    "Failed to create assignment",
                });
              }
            }}
          >
            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: "Please enter title" }]}
            >
              <Input placeholder="Assignment title" />
            </Form.Item>
            <Form.Item name="description" label="Description">
              <Input.TextArea rows={3} placeholder="Assignment description" />
            </Form.Item>
            <Form.Item name="instructions" label="Instructions">
              <Input.TextArea rows={4} placeholder="Detailed instructions" />
            </Form.Item>
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item
                  name="assignmentType"
                  label="Type"
                  initialValue="essay"
                  rules={[{ required: true }]}
                >
                  <Select
                    options={
                      [
                        { value: "essay", label: "Essay" },
                        { value: "project", label: "Project" },
                        { value: "practical", label: "Practical" },
                        { value: "presentation", label: "Presentation" },
                        { value: "research", label: "Research" },
                        { value: "coding", label: "Coding" },
                        { value: "design", label: "Design" },
                      ] as any
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="status"
                  label="Status"
                  initialValue="draft"
                  rules={[{ required: true }]}
                >
                  <Select
                    options={
                      [
                        { value: "draft", label: "Draft" },
                        { value: "published", label: "Published" },
                        { value: "archived", label: "Archived" },
                      ] as any
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={8}>
                <Form.Item
                  name="assignmentOrder"
                  label="Order"
                  initialValue={1}
                >
                  <InputNumber min={1} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="maxScore" label="Max Score" initialValue={100}>
                  <InputNumber step={0.01} min={0} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="passingScore"
                  label="Passing Score"
                  initialValue={50}
                >
                  <InputNumber step={0.01} min={0} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={8}>
                <Form.Item
                  name="maxAttempts"
                  label="Max Attempts"
                  initialValue={3}
                >
                  <InputNumber min={1} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="timeLimitMinutes" label="Time Limit (min)">
                  <InputNumber min={1} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="latePenaltyPercent" label="Late Penalty %">
                  <InputNumber step={0.01} min={0} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item name="availableFrom" label="Available From">
                  <DatePicker showTime style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="dueDate" label="Due Date">
                  <DatePicker showTime style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item
                  name="submissionFormat"
                  label="Submission Format"
                  initialValue="text"
                >
                  <Select
                    options={
                      [
                        { value: "text", label: "Text" },
                        { value: "file_upload", label: "File Upload" },
                        { value: "url", label: "URL" },
                        { value: "both_text_file", label: "Text + File" },
                      ] as any
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="allowedFileTypes" label="Allowed File Types">
                  <Input placeholder="e.g. pdf,docx,zip" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={8}>
                <Form.Item
                  name="maxFileSizeMb"
                  label="Max File Size (MB)"
                  initialValue={10}
                >
                  <InputNumber min={1} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="minWordCount" label="Min Words">
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="maxWordCount" label="Max Words">
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={8}>
                <Form.Item
                  name="autoGrade"
                  label="Auto Grade"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="lateSubmissionAllowed"
                  label="Late Submission"
                  valuePropName="checked"
                  initialValue={true}
                >
                  <Switch />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="peerReviewEnabled"
                  label="Peer Review"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item
                  name="peerReviewsRequired"
                  label="Peer Reviews Required"
                >
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="sampleSubmissions"
                  label="Sample Submissions URL"
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Form.List
              name="rubricCriteria"
              initialValue={[{ criterion: "", points: 10, description: "" }]}
            >
              {(fields, { add, remove }) => (
                <>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <label style={{ fontWeight: 600 }}>Grading Rubric</label>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      icon={<PlusOutlined />}
                      size="small"
                    >
                      Add Criterion
                    </Button>
                  </div>
                  {fields.map(({ key, name, ...restField }) => (
                    <Card
                      key={key}
                      size="small"
                      style={{ marginBottom: 8, backgroundColor: "#fafafa" }}
                    >
                      <Row gutter={8}>
                        <Col span={8}>
                          <Form.Item
                            {...restField}
                            name={[name, "criterion"]}
                            label="Criterion"
                            rules={[
                              {
                                required: true,
                                message: "Please enter criterion",
                              },
                            ]}
                          >
                            <Input placeholder="e.g. Content Quality" />
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          <Form.Item
                            {...restField}
                            name={[name, "points"]}
                            label="Points"
                            rules={[
                              { required: true, message: "Enter points" },
                            ]}
                          >
                            <InputNumber
                              min={1}
                              max={100}
                              style={{ width: "100%" }}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={10}>
                          <Form.Item
                            {...restField}
                            name={[name, "description"]}
                            label="Description"
                          >
                            <Input placeholder="Describe what this criterion evaluates" />
                          </Form.Item>
                        </Col>
                        <Col
                          span={2}
                          style={{
                            display: "flex",
                            alignItems: "end",
                            paddingBottom: 24,
                          }}
                        >
                          <Button
                            type="text"
                            danger
                            icon={<MinusCircleOutlined />}
                            onClick={() => remove(name)}
                            disabled={fields.length <= 1}
                            title="Remove criterion"
                          />
                        </Col>
                      </Row>
                    </Card>
                  ))}
                </>
              )}
            </Form.List>
            <Form.Item name="referenceMaterials" label="Reference Materials">
              <Input.TextArea rows={3} />
            </Form.Item>
          </Form>
        </Card>
      </Modal>

      {/* Create/Edit Quiz Modal */}
      <Modal
        title={editingQuiz ? `Edit Quiz: ${editingQuiz.title}` : "Create Quiz"}
        open={quizModalOpen}
        onCancel={() => {
          setQuizModalOpen(false);
          setEditingQuiz(null);
          quizForm.resetFields();
        }}
        onOk={() => quizForm.submit()}
        okButtonProps={{ loading: creatingQuiz || updatingQuiz }}
      >
        <Card bordered={false} style={{ backgroundColor: "white" }}>
          <Form
            form={quizForm}
            layout="vertical"
            onFinish={async (values) => {
              try {
                // Convert dynamic answers array to JSON string
                const answersArray = values.answers || [];

                if (editingQuiz) {
                  // Update quiz
                  await updateQuiz({
                    id: editingQuiz.id,
                    quiz: {
                      question: values.question,
                      answers: JSON.stringify(answersArray),
                      correctAnswerIndex: Number(
                        values.correctAnswerIndex ?? 0
                      ),
                      lessonId: id,
                      userId: lesson?.userId || "",
                      title: values.title,
                      instructions: values.instructions,
                      quizType: values.quizType || "multiple_choice",
                      points: Number(values.points ?? 1),
                      timeLimitMinutes: values.timeLimitMinutes
                        ? Number(values.timeLimitMinutes)
                        : undefined,
                      difficulty: values.difficulty || "easy",
                      explanation: values.explanation,
                      localExample: values.localExample,
                      passRequired: !!values.passRequired,
                      quizOrder: Number(values.quizOrder ?? 1),
                      status: values.status || "draft",
                      language: values.language || "both",
                    },
                  }).unwrap();
                  open?.({
                    type: "success",
                    message: "Success",
                    description: "Quiz updated successfully!",
                  });
                } else {
                  // Create quiz
                  await createQuiz({
                    question: values.question,
                    answers: JSON.stringify(answersArray),
                    correctAnswerIndex: Number(values.correctAnswerIndex ?? 0),
                    lessonId: id,
                    userId: lesson?.userId || "",
                    title: values.title,
                    instructions: values.instructions,
                    quizType: values.quizType || "multiple_choice",
                    points: Number(values.points ?? 1),
                    timeLimitMinutes: values.timeLimitMinutes
                      ? Number(values.timeLimitMinutes)
                      : undefined,
                    difficulty: values.difficulty || "easy",
                    explanation: values.explanation,
                    localExample: values.localExample,
                    passRequired: !!values.passRequired,
                    quizOrder: Number(values.quizOrder ?? 1),
                    status: values.status || "draft",
                    language: values.language || "both",
                  }).unwrap();
                  open?.({
                    type: "success",
                    message: "Success",
                    description: "Quiz created successfully!",
                  });
                }
                setQuizModalOpen(false);
                setEditingQuiz(null);
                quizForm.resetFields();
              } catch (e: any) {
                open?.({
                  type: "error",
                  message: "Error",
                  description:
                    e?.data?.message || e?.message || "Failed to create quiz",
                });
              }
            }}
          >
            <Form.Item
              name="title"
              label="Quiz Title"
              rules={[{ required: true, message: "Please enter title" }]}
            >
              <Input placeholder="Quiz title" />
            </Form.Item>
            <Form.Item
              name="question"
              label="Question"
              rules={[{ required: true, message: "Please enter question" }]}
            >
              <Input.TextArea rows={2} placeholder="Question text" />
            </Form.Item>

            <Form.List name="answers" initialValue={["Option A", "Option B"]}>
              {(fields, { add, remove }) => (
                <>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <label style={{ fontWeight: 600 }}>Answer Options</label>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      icon={<PlusOutlined />}
                      size="small"
                    >
                      Add Answer
                    </Button>
                  </div>
                  {fields.map(({ key, name, ...restField }) => (
                    <Row key={key} gutter={8} style={{ marginBottom: 8 }}>
                      <Col flex="auto">
                        <Form.Item
                          {...restField}
                          name={name}
                          rules={[
                            {
                              required: true,
                              message: "Please enter answer option",
                            },
                          ]}
                        >
                          <Input placeholder={`Answer option ${name + 1}`} />
                        </Form.Item>
                      </Col>
                      <Col>
                        <Button
                          type="text"
                          danger
                          icon={<MinusCircleOutlined />}
                          onClick={() => remove(name)}
                          disabled={fields.length <= 2}
                          title="Remove answer"
                        />
                      </Col>
                    </Row>
                  ))}
                </>
              )}
            </Form.List>

            <Form.Item
              name="correctAnswerIndex"
              label="Correct Answer Index"
              initialValue={0}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="instructions" label="Instructions">
              <Input.TextArea rows={2} placeholder="Quiz instructions" />
            </Form.Item>
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item
                  name="quizType"
                  label="Type"
                  initialValue="multiple_choice"
                  rules={[{ required: true }]}
                >
                  <Select
                    options={[
                      { value: "multiple_choice", label: "Multiple Choice" },
                      { value: "true_false", label: "True/False" },
                      { value: "fill_blank", label: "Fill in the Blank" },
                      { value: "short_answer", label: "Short Answer" },
                      { value: "essay", label: "Essay" },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="difficulty"
                  label="Difficulty"
                  initialValue="easy"
                  rules={[{ required: true }]}
                >
                  <Select
                    options={[
                      { value: "easy", label: "Easy" },
                      { value: "medium", label: "Medium" },
                      { value: "hard", label: "Hard" },
                    ]}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={8}>
                <Form.Item name="points" label="Points" initialValue={1}>
                  <InputNumber min={1} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="quizOrder" label="Order" initialValue={1}>
                  <InputNumber min={1} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="timeLimitMinutes" label="Time Limit (min)">
                  <InputNumber min={1} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item
                  name="language"
                  label="Language"
                  initialValue="both"
                  rules={[{ required: true }]}
                >
                  <Select
                    options={[
                      { value: "english", label: "English" },
                      { value: "french", label: "French" },
                      { value: "both", label: "Both" },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="status"
                  label="Status"
                  initialValue="draft"
                  rules={[{ required: true }]}
                >
                  <Select
                    options={[
                      { value: "draft", label: "Draft" },
                      { value: "published", label: "Published" },
                      { value: "archived", label: "Archived" },
                    ]}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              name="passRequired"
              label="Pass Required to Continue"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
            <Form.Item
              name="explanation"
              label="Explanation for Correct Answer"
            >
              <Input.TextArea
                rows={2}
                placeholder="Explain why this answer is correct"
              />
            </Form.Item>
            <Form.Item name="localExample" label="Cameroon-Specific Example">
              <Input.TextArea rows={2} placeholder="Local context or example" />
            </Form.Item>
          </Form>
        </Card>
      </Modal>

      {/* View Assignment Modal */}
      <Modal
        title={
          viewAssignment
            ? `Assignment: ${viewAssignment.title}`
            : "Assignment Details"
        }
        open={viewAssignmentModalOpen}
        onCancel={() => setViewAssignmentModalOpen(false)}
        footer={null}
        width={800}
      >
        {viewAssignment && (
          <Descriptions column={2} bordered size="small">
            <Descriptions.Item label="Title">
              {viewAssignment.title}
            </Descriptions.Item>
            <Descriptions.Item label="Type">
              <Tag color="purple">{viewAssignment.assignmentType}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag
                color={
                  viewAssignment.status === "published"
                    ? "green"
                    : viewAssignment.status === "draft"
                    ? "orange"
                    : "gray"
                }
              >
                {viewAssignment.status}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Max Score">
              {viewAssignment.maxScore || 100} pts
            </Descriptions.Item>
            <Descriptions.Item label="Passing Score">
              {viewAssignment.passingScore || 50} pts
            </Descriptions.Item>
            <Descriptions.Item label="Max Attempts">
              {viewAssignment.maxAttempts || 3}
            </Descriptions.Item>
            <Descriptions.Item label="Due Date">
              {viewAssignment.dueDate
                ? new Date(viewAssignment.dueDate).toLocaleString()
                : "No due date"}
            </Descriptions.Item>
            <Descriptions.Item label="Time Limit">
              {viewAssignment.timeLimitMinutes
                ? `${viewAssignment.timeLimitMinutes} min`
                : "No limit"}
            </Descriptions.Item>
            <Descriptions.Item label="Description" span={2}>
              {viewAssignment.description}
            </Descriptions.Item>
            <Descriptions.Item label="Instructions" span={2}>
              {viewAssignment.instructions}
            </Descriptions.Item>
            {viewAssignment.rubric && (
              <Descriptions.Item label="Grading Rubric" span={2}>
                {(() => {
                  try {
                    const rubric =
                      typeof viewAssignment.rubric === "string"
                        ? JSON.parse(viewAssignment.rubric)
                        : viewAssignment.rubric;
                    const criteria = rubric?.criteria || [];
                    return (
                      <div>
                        {criteria.map((criterion: any, index: number) => (
                          <div
                            key={index}
                            style={{
                              marginBottom: 8,
                              padding: 8,
                              backgroundColor: "#f5f5f5",
                              borderRadius: 4,
                            }}
                          >
                            <div style={{ fontWeight: "bold" }}>
                              {criterion.criterion} ({criterion.points} pts)
                            </div>
                            {criterion.description && (
                              <div
                                style={{
                                  fontSize: 12,
                                  color: "#666",
                                  marginTop: 4,
                                }}
                              >
                                {criterion.description}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    );
                  } catch (e) {
                    return <Text type="secondary">Invalid rubric format</Text>;
                  }
                })()}
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>

      {/* View Quiz Modal */}
      <Modal
        title={viewQuiz ? `Quiz: ${viewQuiz.title}` : "Quiz Details"}
        open={viewQuizModalOpen}
        onCancel={() => setViewQuizModalOpen(false)}
        footer={null}
        width={800}
      >
        {viewQuiz && (
          <Descriptions column={2} bordered size="small">
            <Descriptions.Item label="Title">
              {viewQuiz.title}
            </Descriptions.Item>
            <Descriptions.Item label="Type">
              <Tag color="cyan">{viewQuiz.quizType}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Difficulty">
              <Tag
                color={
                  viewQuiz.difficulty === "easy"
                    ? "green"
                    : viewQuiz.difficulty === "medium"
                    ? "orange"
                    : "red"
                }
              >
                {viewQuiz.difficulty}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Points">
              {viewQuiz.points || 1} pts
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag
                color={
                  viewQuiz.status === "published"
                    ? "green"
                    : viewQuiz.status === "draft"
                    ? "orange"
                    : "gray"
                }
              >
                {viewQuiz.status}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Language">
              <Tag>{viewQuiz.language}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Time Limit">
              {viewQuiz.timeLimitMinutes
                ? `${viewQuiz.timeLimitMinutes} min`
                : "No limit"}
            </Descriptions.Item>
            <Descriptions.Item label="Pass Required">
              <Tag color={viewQuiz.passRequired ? "red" : "green"}>
                {viewQuiz.passRequired ? "Required" : "Optional"}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Question" span={2}>
              {viewQuiz.question}
            </Descriptions.Item>
            <Descriptions.Item label="Answer Options" span={2}>
              {Array.isArray(viewQuiz.answers) ? (
                <div>
                  {viewQuiz.answers.map((answer: string, index: number) => (
                    <Tag
                      key={index}
                      color={
                        index === viewQuiz.correctAnswerIndex
                          ? "green"
                          : "default"
                      }
                      style={{ margin: "2px 4px 2px 0" }}
                    >
                      {index === viewQuiz.correctAnswerIndex ? "✓ " : ""}
                      {answer}
                    </Tag>
                  ))}
                </div>
              ) : (
                <div>{viewQuiz.answers}</div>
              )}
            </Descriptions.Item>
            {viewQuiz.explanation && (
              <Descriptions.Item label="Explanation" span={2}>
                {viewQuiz.explanation}
              </Descriptions.Item>
            )}
            {viewQuiz.localExample && (
              <Descriptions.Item label="Local Example" span={2}>
                {viewQuiz.localExample}
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default LessonDetailsPage;
