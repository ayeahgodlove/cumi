"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Button,
  Space,
  Table,
  Tag,
  Modal,
  Form,
  Input,
  InputNumber,
  Switch,
  Spin,
  Descriptions,
  Tooltip,
  Select,
  Upload,
  Popconfirm,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  BookOutlined,
  ClockCircleOutlined,
  UserOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useNotification } from "@refinedev/core";
import RichTextEditor from "@components/shared/rich-text-editor";
import EnhancedBreadcrumb from "@components/shared/enhanced-breadcrumb/enhanced-breadcrumb.component";
import { useUpload, getImageUrlString } from "@hooks/shared/upload.hook";
import {
  useGetLessonsByModuleQuery,
  useCreateLessonMutation,
  useUpdateLessonMutation,
  useDeleteLessonMutation,
} from "@store/api/lesson_api";
import {
  useGetSingleModuleQuery,
  useUpdateModuleMutation,
} from "@store/api/module_api";
import { useGetSingleCourseQuery } from "@store/api/course_api";
import { useGetAssignmentsByModuleQuery } from "@store/api/assignment_api";
import { useGetQuizzesByModuleQuery } from "@store/api/quiz_api";
import Link from "next/link";

const { Title, Text } = Typography;

interface ModuleDetailsPageProps {
  params: {
    id: string;
  };
}

export default function ModuleDetailsPage({ params }: ModuleDetailsPageProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const { open } = useNotification();
  // RTK Query hooks
  const {
    data: module,
    isLoading: moduleLoading,
    refetch: refetchModule,
  } = useGetSingleModuleQuery(params.id);
  const { data: course, isLoading: courseLoading } = useGetSingleCourseQuery(
    module?.courseId || ""
  );
  const {
    data: lessons = [],
    isLoading: lessonsLoading,
    refetch: refetchLessons,
  } = useGetLessonsByModuleQuery(params.id);
  const { data: assignments = [], isLoading: assignmentsLoading } =
    useGetAssignmentsByModuleQuery(params.id);
  const { data: quizes = [], isLoading: quizesLoading } =
    useGetQuizzesByModuleQuery(params.id);

  const [createLesson, { isLoading: createLoading }] =
    useCreateLessonMutation();
  const [updateLesson, { isLoading: updateLoading }] =
    useUpdateLessonMutation();
  const [deleteLesson, { isLoading: deleteLoading }] =
    useDeleteLessonMutation();
  const [updateModule] = useUpdateModuleMutation();
  const [lessonModalVisible, setLessonModalVisible] = useState(false);
  const [editingLesson, setEditingLesson] = useState<any>(null);
  const [lessonForm] = Form.useForm();

  // Image upload hook for lesson form
  const {
    fileList: lessonImageFileList,
    setFileList: setLessonImageFileList,
    handleUploadChange: handleLessonImageUploadChange,
    beforeUpload: beforeLessonImageUpload,
    handleRemove: handleLessonImageRemove,
  } = useUpload({
    maxSize: 1024 * 1024, // 1MB
    allowedTypes: [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
    ],
    form: lessonForm,
    fieldName: "imageUrl",
    onError: (error) => {
      open?.({
        type: "error",
        message: "Upload Error",
        description: error,
      });
    },
  });

  // Handle RTK Query errors
  useEffect(() => {
    if (moduleLoading === false && !module) {
      open?.({
        type: "error",
        message: "Error",
        description: "Failed to fetch module data",
      });
      router.push("/dashboard/creator");
    }
  }, [moduleLoading, module, router, open]);

  // Handle lesson image upload updates
  useEffect(() => {
    if (lessonImageFileList && lessonImageFileList.length > 0) {
      const imageUrl = getImageUrlString(lessonImageFileList);
      if (imageUrl) {
        lessonForm.setFieldsValue({
          imageUrl: imageUrl,
        });
      }
    }
  }, [lessonImageFileList, lessonForm]);

  const handleLessonSubmit = async (values: any) => {
    try {
      // Generate slug from title
      const slug = values.title
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim("-");

      // Get image URL from file list or form value
      const imageUrl =
        getImageUrlString(lessonImageFileList) || values.imageUrl || "";

      // Extract specific fields to avoid any string conversion issues
      const { reviews, ...cleanValues } = values;

      const lessonData = {
        ...cleanValues,
        slug: slug,
        moduleId: params.id,
        courseId: module?.courseId,
        userId: session?.user?.id || "",
        // Set defaults for required fields
        imageUrl: imageUrl, // Ensure imageUrl is saved as a string
        durationMinutes:
          values.durationMinutes || values.estimatedCompletionTime || 0,
        prerequisites: Array.isArray(values.prerequisites)
          ? values.prerequisites
          : [],
        objectives: Array.isArray(values.objectives) ? values.objectives : [],
        keywords: Array.isArray(values.keywords) ? values.keywords : [],
        reviews: [], // Always set as empty array, never from form values
        authorName: session?.user?.name || "Unknown",
        language: values.language || "en",
        rating: values.rating || 0,
        // Ensure all required fields are set
        lessonOrder: values.lessonOrder || 1,
        status: values.status || "draft",
        lessonType: values.lessonType || "text",
        isFreePreview: values.isFreePreview || false,
        requiresCompletion: values.requiresCompletion || true,
        estimatedCompletionTime:
          values.estimatedCompletionTime || values.durationMinutes || 0,
      };

      if (editingLesson) {
        // Update lesson using RTK Query
        await updateLesson({
          id: editingLesson.id,
          lesson: lessonData,
        }).unwrap();
        open?.({
          type: "success",
          message: "Success",
          description: "Lesson updated successfully!",
        });
      } else {
        // Create lesson using RTK Query
        await createLesson(lessonData).unwrap();
        open?.({
          type: "success",
          message: "Success",
          description: "Lesson created successfully!",
        });
      }

      lessonForm.resetFields();
      setEditingLesson(null);
      setLessonModalVisible(false);
    } catch (error: any) {
      open?.({
        type: "error",
        message: "Error",
        description: `Failed to save lesson: ${error.message}`,
      });
    }
  };

  const handleEditLesson = (lesson: any) => {
    setEditingLesson(lesson);
    lessonForm.setFieldsValue(lesson);

    // Handle image file list for editing
    if (lesson.imageUrl) {
      const imageFile = {
        uid: `existing-${lesson.id}`,
        name: lesson.imageUrl.split("/").pop() || "image",
        status: "done",
        url: lesson.imageUrl,
        response: { url: lesson.imageUrl },
      };
      setLessonImageFileList([imageFile]);
    } else {
      setLessonImageFileList([]);
    }

    setLessonModalVisible(true);
  };

  const handleDeleteLesson = async (lessonId: string) => {
    try {
      await deleteLesson(lessonId).unwrap();
      open?.({
        type: "success",
        message: "Success",
        description: "Lesson deleted successfully!",
      });
    } catch (error: any) {
      open?.({
        type: "error",
        message: "Error",
        description: `Failed to delete lesson: ${error.message}`,
      });
    }
  };

  const [viewLesson, setViewLesson] = useState<any>(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);

  const handleViewLesson = (lesson: any) => {
    setViewLesson(lesson);
    setViewModalVisible(true);
  };

  const lessonColumns = [
    {
      title: "#",
      dataIndex: "lessonOrder",
      key: "lessonOrder",
      width: 60,
      sorter: (a: any, b: any) => a.lessonOrder - b.lessonOrder,
      render: (value: number) => (
        <Tag color="blue" style={{ fontWeight: "bold", fontSize: 12 }}>
          {value}
        </Tag>
      ),
    },
    {
      title: "Lesson Title",
      dataIndex: "title",
      key: "title",
      render: (title: string, record: any) => (
        <div>
          <div style={{ fontWeight: "bold", marginBottom: 2 }}>{title}</div>
          <Text type="secondary" style={{ fontSize: 11 }}>
            ID: {record.id?.substring(0, 8)}...
          </Text>
        </div>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: { showTitle: false },
      render: (text: string) => (
        <Tooltip title={text}>
          <Text>{text || "No description"}</Text>
        </Tooltip>
      ),
    },
    {
      title: "Duration",
      dataIndex: "durationMinutes",
      key: "durationMinutes",
      width: 100,
      align: "center" as const,
      sorter: (a: any, b: any) =>
        (a.durationMinutes || 0) - (b.durationMinutes || 0),
      render: (value: number) => (
        <Tag color="blue" icon={<ClockCircleOutlined />}>
          {value || 0}min
        </Tag>
      ),
    },
    {
      title: "Difficulty",
      dataIndex: "difficulty",
      key: "difficulty",
      width: 100,
      filters: [
        { text: "Beginner", value: "beginner" },
        { text: "Intermediate", value: "intermediate" },
        { text: "Advanced", value: "advanced" },
      ],
      onFilter: (value: any, record: any) => record.difficulty === value,
      render: (value: string) => {
        const config = {
          beginner: { color: "green", text: "Beginner" },
          intermediate: { color: "orange", text: "Intermediate" },
          advanced: { color: "red", text: "Advanced" },
        };
        const difficultyConfig = config[value as keyof typeof config] || {
          color: "default",
          text: value,
        };
        return (
          <Tag color={difficultyConfig.color}>{difficultyConfig.text}</Tag>
        );
      },
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
      onFilter: (value: any, record: any) => record.status === value,
      render: (value: string) => {
        const statusConfig = {
          published: { color: "green", text: "Published" },
          draft: { color: "orange", text: "Draft" },
          archived: { color: "gray", text: "Archived" },
        };
        const config = statusConfig[value as keyof typeof statusConfig] || {
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
      width: 100,
      sorter: (a: any, b: any) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      width: 260,
      render: (_: any, record: any) => (
        <Space size="small" wrap>
          <Tooltip title="View details">
            <Button
              icon={<EyeOutlined />}
              size="small"
              // ghost
              style={{ borderRadius: 8 }}
              onClick={() => handleViewLesson(record)}
            />
          </Tooltip>

          <Tooltip title="Edit lesson">
            <Button
              type="primary"
              icon={<EditOutlined />}
              size="small"
              ghost
              style={{ borderRadius: 8 }}
              onClick={() => handleEditLesson(record)}
            />
          </Tooltip>

          <Tooltip title="Manage lesson">
            <Link href={`/dashboard/lessons/${record.id}`}>
              <Button type="dashed" size="small" style={{ borderRadius: 8 }}>
                Manage
              </Button>
            </Link>
          </Tooltip>

          <Popconfirm
            title="Delete Lesson"
            description="Are you sure you want to delete this lesson?"
            onConfirm={() => handleDeleteLesson(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete lesson">
              <Button
                icon={<DeleteOutlined />}
                size="small"
                danger
                ghost
                style={{ borderRadius: 8 }}
                loading={deleteLoading}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (moduleLoading || courseLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (!module) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Text>Module not found</Text>
      </div>
    );
  }

  // Calculate module stats
  const totalLessons = lessons.length;
  const publishedLessons = lessons.filter(
    (l) => l.status === "published"
  ).length;
  const totalAssignments = assignments.length;
  const totalQuizzes = quizes.length;
  const totalDuration = lessons.reduce(
    (sum, l) => sum + (l.durationMinutes || 0),
    0
  );

  return (
    <div style={{ padding: "24px" }}>
      {/* Enhanced Breadcrumb */}
      <EnhancedBreadcrumb
        items={[
          {
            title: course?.title || "Course Management",
            href: `/dashboard/courses/${module.courseId}`,
          },
          { title: "Module Management" },
          { title: module.title },
        ]}
      />

      {/* Module Header */}
      <Card
        style={{
          marginBottom: 24,
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          border: "none",
        }}
      >
        <Row gutter={[0, 0]} align="middle">
          <Col xs={24} md={16}>
            <Title level={2} style={{ margin: 0, marginBottom: 8 }}>
              {module.title}
            </Title>
            <Text type="secondary" style={{ fontSize: 16, lineHeight: 1.6 }}>
              {module.description}
            </Text>
          </Col>
          <Col xs={24} md={8} style={{ textAlign: "right" }}>
            <Space direction="horizontal" size="small">
              <Tag
                color={
                  module.status === "published"
                    ? "green"
                    : module.status === "draft"
                    ? "orange"
                    : "gray"
                }
                style={{ fontSize: 12, fontWeight: "bold", padding: "4px 8px" }}
              >
                {module.status?.toUpperCase() || "DRAFT"}
              </Tag>
              <Tag
                color="blue"
                style={{ fontSize: 12, fontWeight: "bold", padding: "4px 8px" }}
              >
                Order: {module.moduleOrder}
              </Tag>
              {module.isLocked && (
                <Tag
                  color="red"
                  style={{
                    fontSize: 12,
                    fontWeight: "bold",
                    padding: "4px 8px",
                  }}
                >
                  LOCKED
                </Tag>
              )}
            </Space>
          </Col>
        </Row>
      </Card>

      <Modal
        title={
          viewLesson ? `Lesson Details: ${viewLesson.title}` : "Lesson Details"
        }
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={null}
        width={800}
      >
        {viewLesson && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Title">
              {viewLesson.title}
            </Descriptions.Item>
            <Descriptions.Item label="Description">
              {viewLesson.description}
            </Descriptions.Item>
            <Descriptions.Item label="Difficulty">
              {viewLesson.difficulty}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              {viewLesson.status}
            </Descriptions.Item>
            <Descriptions.Item label="Duration (min)">
              {viewLesson.durationMinutes ?? 0}
            </Descriptions.Item>
            <Descriptions.Item label="Type">
              {viewLesson.lessonType}
            </Descriptions.Item>
            <Descriptions.Item label="Created">
              {new Date(viewLesson.createdAt).toLocaleString()}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* Module Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <Card
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              border: "none",
            }}
          >
            <Statistic
              title="Total Lessons"
              value={totalLessons}
              valueStyle={{ fontSize: 20 }}
              prefix={
                <span style={{ color: "#1890ff" }}>
                  <BookOutlined />
                </span>
              }
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              border: "none",
            }}
          >
            <Statistic
              title="Published Lessons"
              value={publishedLessons}
              valueStyle={{ fontSize: 20 }}
              prefix={
                <span style={{ color: "#52c41a" }}>
                  <BookOutlined />
                </span>
              }
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              border: "none",
            }}
          >
            <Statistic
              title="Assignments"
              value={totalAssignments}
              valueStyle={{ fontSize: 20 }}
              prefix={
                <span style={{ color: "#13c2c2" }}>
                  <TrophyOutlined />
                </span>
              }
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              border: "none",
            }}
          >
            <Statistic
              title="Quizzes"
              value={totalQuizzes}
              valueStyle={{ fontSize: 20 }}
              prefix={
                <span style={{ color: "#eb2f96" }}>
                  <TrophyOutlined />
                </span>
              }
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <Card
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              border: "none",
            }}
          >
            <Statistic
              title="Total Duration"
              value={totalDuration}
              suffix="min"
              valueStyle={{ fontSize: 20 }}
              prefix={
                <span style={{ color: "#fa8c16" }}>
                  <ClockCircleOutlined />
                </span>
              }
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              border: "none",
            }}
          >
            <Statistic
              title="Module Duration"
              value={module.estimatedDurationHours || 0}
              suffix="hrs"
              valueStyle={{ fontSize: 20 }}
              prefix={
                <span style={{ color: "#722ed1" }}>
                  <ClockCircleOutlined />
                </span>
              }
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              border: "none",
            }}
          >
            <Statistic
              title="Course"
              value={course?.title || "Unknown"}
              valueStyle={{ fontSize: 16 }}
              prefix={
                <span style={{ color: "#52c41a" }}>
                  <BookOutlined />
                </span>
              }
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              border: "none",
            }}
          >
            <Statistic
              title="Author"
              value="Unknown"
              valueStyle={{ fontSize: 16 }}
              prefix={
                <span style={{ color: "#fa8c16" }}>
                  <UserOutlined />
                </span>
              }
            />
          </Card>
        </Col>
      </Row>

      {/* Module Details */}
      <Card
        title="Module Details"
        style={{
          marginBottom: 24,
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          border: "none",
        }}
        size="small"
      >
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Title">{module.title}</Descriptions.Item>
          <Descriptions.Item label="Order">
            {module.moduleOrder}
          </Descriptions.Item>
          <Descriptions.Item label="Duration">
            {module.estimatedDurationHours || 0} hours
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag
              color={
                module.status === "published"
                  ? "green"
                  : module.status === "draft"
                  ? "orange"
                  : "gray"
              }
            >
              {module.status || "Draft"}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Access">
            <Tag color={module.isLocked ? "red" : "green"}>
              {module.isLocked ? "Locked" : "Open"}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Created At">
            {new Date(module.createdAt).toLocaleDateString()}
          </Descriptions.Item>
          <Descriptions.Item label="Description" span={2}>
            {module.description || "No description provided"}
          </Descriptions.Item>
          {module.learningObjectives && (
            <Descriptions.Item label="Learning Objectives" span={2}>
              {module.learningObjectives}
            </Descriptions.Item>
          )}
          {module.prerequisites && (
            <Descriptions.Item label="Prerequisites" span={2}>
              {module.prerequisites}
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>

      {/* Lessons Management */}
      <Card
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <BookOutlined style={{ color: "#1890ff" }} />
            <span>
              Module Lessons ({lessons.length} total, {publishedLessons}{" "}
              published)
            </span>
          </div>
        }
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setLessonModalVisible(true)}
          >
            Add Lesson
          </Button>
        }
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          border: "none",
        }}
      >
        {lessons.length === 0 && !lessonsLoading ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px 0",
              color: "#999",
            }}
          >
            <BookOutlined style={{ fontSize: 48, marginBottom: 16 }} />
            <div>No lessons found for this module</div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setLessonModalVisible(true)}
              style={{ marginTop: 16 }}
            >
              Add First Lesson
            </Button>
          </div>
        ) : (
          <Table
            dataSource={lessons}
            columns={lessonColumns}
            rowKey="id"
            loading={lessonsLoading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} lessons`,
            }}
            scroll={{ x: 1200 }}
            rowClassName={(record, index) =>
              index % 2 === 0 ? "table-row-light" : "table-row-dark"
            }
            size="small"
          />
        )}
      </Card>

      {/* Enhanced Lesson Modal */}
      <Modal
        title={
          editingLesson
            ? `Edit Lesson: ${editingLesson.title}`
            : "Add New Lesson"
        }
        open={lessonModalVisible}
        onCancel={() => {
          setLessonModalVisible(false);
          setEditingLesson(null);
          lessonForm.resetFields();
          setLessonImageFileList([]);
        }}
        footer={null}
        width={1000}
        style={{ top: 20 }}
      >
        <Card
          bordered={false}
          size="small"
          style={{ backgroundColor: "white" }}
        >
          <Form
            form={lessonForm}
            layout="vertical"
            onFinish={handleLessonSubmit}
            initialValues={{
              status: "draft",
              lessonType: "text",
              difficulty: "beginner",
              language: "en",
              lessonOrder: 1,
              isFreePreview: false,
              requiresCompletion: true,
              rating: 5,
            }}
          >
            {/* Basic Information */}
            <Row gutter={16}>
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <Form.Item
                  name="title"
                  label="Lesson Title"
                  rules={[
                    { required: true, message: "Please enter lesson title" },
                  ]}
                >
                  <Input size="large" placeholder="Enter lesson title" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="description"
              label="Description"
              rules={[
                { required: true, message: "Please enter lesson description" },
              ]}
            >
              <Input.TextArea rows={3} placeholder="Enter lesson description" />
            </Form.Item>

            {/* Duration and Difficulty */}
            <Row gutter={16}>
              <Col xs={12} sm={8} md={6} lg={4} xl={4}>
                <Form.Item
                  name="durationMinutes"
                  label="Duration (min)"
                  rules={[{ required: true, message: "Please enter duration" }]}
                >
                  <InputNumber min={1} style={{ width: "100%" }} size="large" />
                </Form.Item>
              </Col>
              <Col xs={12} sm={8} md={6} lg={6} xl={6}>
                <Form.Item
                  name="estimatedCompletionTime"
                  label="Completion Time (minutes)"
                >
                  <InputNumber min={1} style={{ width: "100%" }} size="large" />
                </Form.Item>
              </Col>
              <Col xs={12} sm={8} md={6} lg={6} xl={6}>
                <Form.Item
                  name="difficulty"
                  label="Difficulty"
                  rules={[
                    { required: true, message: "Please select difficulty" },
                  ]}
                >
                  <Select size="large" placeholder="Select difficulty">
                    <Select.Option value="beginner">Beginner</Select.Option>
                    <Select.Option value="intermediate">
                      Intermediate
                    </Select.Option>
                    <Select.Option value="advanced">Advanced</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={12} sm={12} md={6} lg={4} xl={4}>
                <Form.Item
                  name="lessonType"
                  label="Lesson Type"
                  rules={[
                    { required: true, message: "Please select lesson type" },
                  ]}
                >
                  <Select size="large" placeholder="Select type">
                    <Select.Option value="video">Video</Select.Option>
                    <Select.Option value="text">Text</Select.Option>
                    <Select.Option value="audio">Audio</Select.Option>
                    <Select.Option value="practical">Practical</Select.Option>
                    <Select.Option value="discussion">Discussion</Select.Option>
                    <Select.Option value="assignment">Assignment</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={12} sm={12} md={6} lg={4} xl={4}>
                <Form.Item
                  name="lessonOrder"
                  label="Order"
                  rules={[
                    { required: true, message: "Please enter lesson order" },
                  ]}
                >
                  <InputNumber min={1} style={{ width: "100%" }} size="large" />
                </Form.Item>
              </Col>
            </Row>

            {/* Media URLs */}
            <Row gutter={16}>
              <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                <Form.Item name="videoUrl" label="Video URL">
                  <Input size="large" placeholder="https://..." />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                <Form.Item name="audioUrl" label="Audio URL">
                  <Input size="large" placeholder="https://..." />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                <Form.Item
                  name="downloadMaterials"
                  label="Download Materials URL"
                >
                  <Input size="large" placeholder="https://..." />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <Form.Item
                  name="imageUrl"
                  label="Lesson Image"
                  rules={[
                    {
                      validator: (_, value) => {
                        // Check if we have a valid URL string
                        if (typeof value === "string" && value.trim() !== "") {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("Please upload an image")
                        );
                      },
                    },
                  ]}
                >
                  <Upload.Dragger
                    name="file"
                    action="/api/uploads"
                    listType="picture"
                    maxCount={1}
                    multiple={false}
                    fileList={
                      Array.isArray(lessonImageFileList)
                        ? lessonImageFileList
                        : []
                    }
                    onChange={handleLessonImageUploadChange}
                    beforeUpload={beforeLessonImageUpload}
                    onRemove={handleLessonImageRemove}
                  >
                    <p className="ant-upload-text">
                      Drag & drop a lesson image here
                    </p>
                    <p className="ant-upload-hint">
                      Support for single upload. Maximum file size: 1MB
                    </p>
                  </Upload.Dragger>
                </Form.Item>
              </Col>
            </Row>

            {/* Content */}
            <Form.Item
              name="content"
              label="Lesson Content"
              rules={[
                { required: true, message: "Please enter lesson content" },
              ]}
            >
              <RichTextEditor
                value={lessonForm.getFieldValue("content")}
                onChange={(html) => lessonForm.setFieldValue("content", html)}
                placeholder="Enter lesson content..."
                height={200}
              />
            </Form.Item>

            {/* Objectives and Prerequisites */}
            <Row gutter={16}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Form.Item
                  name="objectives"
                  label="Learning Objectives"
                  tooltip="Enter each objective on a new line"
                >
                  <Input.TextArea
                    rows={3}
                    placeholder="Enter learning objectives, one per line"
                    onChange={(e) => {
                      const objectives = e.target.value
                        .split("\n")
                        .filter((obj) => obj.trim());
                      lessonForm.setFieldValue("objectives", objectives);
                    }}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Form.Item
                  name="prerequisites"
                  label="Prerequisites"
                  tooltip="Enter each prerequisite on a new line"
                >
                  <Input.TextArea
                    rows={3}
                    placeholder="Enter prerequisites, one per line"
                    onChange={(e) => {
                      const prerequisites = e.target.value
                        .split("\n")
                        .filter((prereq) => prereq.trim());
                      lessonForm.setFieldValue("prerequisites", prerequisites);
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* Additional Information */}
            <Row gutter={16}>
              <Col xs={12} sm={8} md={6} lg={4} xl={4}>
                <Form.Item name="language" label="Language">
                  <Select size="large" placeholder="Select language">
                    <Select.Option value="en">English</Select.Option>
                    <Select.Option value="fr">French</Select.Option>
                    <Select.Option value="es">Spanish</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={12} sm={8} md={6} lg={4} xl={4}>
                <Form.Item name="status" label="Status">
                  <Select size="large" placeholder="Select status">
                    <Select.Option value="draft">Draft</Select.Option>
                    <Select.Option value="published">Published</Select.Option>
                    <Select.Option value="archived">Archived</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={16} md={12} lg={16} xl={16}>
                <Form.Item
                  name="keywords"
                  label="Keywords"
                  tooltip="Enter keywords separated by commas"
                >
                  <Input
                    placeholder="keyword1, keyword2, keyword3"
                    onChange={(e) => {
                      const keywords = e.target.value
                        .split(",")
                        .map((k) => k.trim())
                        .filter((k) => k);
                      lessonForm.setFieldValue("keywords", keywords);
                    }}
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* Local Content */}
            <Row gutter={16}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Form.Item
                  name="practicalExamples"
                  label="Practical Examples"
                  tooltip="Cameroon/Local-specific examples and use cases"
                >
                  <Input.TextArea
                    rows={3}
                    placeholder="Enter local examples and practical use cases"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <Form.Item
                  name="resourcesNeeded"
                  label="Resources Needed"
                  tooltip="Required materials, tools, or resources"
                >
                  <Input.TextArea
                    rows={3}
                    placeholder="Enter required resources and materials"
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* Options */}
            <Row gutter={16}>
              <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                <Form.Item
                  name="isFreePreview"
                  label="Free Preview"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
              <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                <Form.Item
                  name="requiresCompletion"
                  label="Requires Completion"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
            </Row>

            {/* Form Actions */}
            <Form.Item style={{ marginTop: 24 }}>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={createLoading || updateLoading}
                >
                  {editingLesson ? "Update Lesson" : "Create Lesson"}
                </Button>
                <Button
                  onClick={() => {
                    setLessonModalVisible(false);
                    setEditingLesson(null);
                    lessonForm.resetFields();
                    setLessonImageFileList([]);
                  }}
                  size="large"
                >
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </Modal>
    </div>
  );
}
