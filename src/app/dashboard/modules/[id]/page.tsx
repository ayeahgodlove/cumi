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
import { useTranslation } from "@contexts/translation.context";
import RichTextEditor from "@components/shared/rich-text-editor";
import EnhancedBreadcrumb from "@components/shared/enhanced-breadcrumb/enhanced-breadcrumb.component";
import ImageUploadField from "@components/shared/image-upload-field.component";
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
  const { t } = useTranslation();
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

  // Handle RTK Query errors
  useEffect(() => {
    if (moduleLoading === false && !module) {
      open?.({
        type: "error",
        message: t('common.error'),
        description: t('module_manage.fetch_module_failed'),
      });
      router.push("/dashboard/creator");
    }
  }, [moduleLoading, module, router, open, t]);


  const handleLessonSubmit = async (values: any) => {
    try {
      // Generate slug from title
      const slug = values.title
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim("-");

      // Get image URL from form value (ImageUploadField handles this)
      const imageUrl = values.imageUrl || "";

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
          message: t('common.success'),
          description: t('module_manage.lesson_updated_success'),
        });
      } else {
        // Create lesson using RTK Query
        await createLesson(lessonData).unwrap();
        open?.({
          type: "success",
          message: t('common.success'),
          description: t('module_manage.lesson_created_success'),
        });
      }

      lessonForm.resetFields();
      setEditingLesson(null);
      setLessonModalVisible(false);
    } catch (error: any) {
      open?.({
        type: "error",
        message: t('common.error'),
        description: t('module_manage.lesson_save_failed', { message: error.message }),
      });
    }
  };

  const handleEditLesson = (lesson: any) => {
    setEditingLesson(lesson);
    lessonForm.setFieldsValue(lesson);
    setLessonModalVisible(true);
  };

  const handleDeleteLesson = async (lessonId: string) => {
    try {
      await deleteLesson(lessonId).unwrap();
      open?.({
        type: "success",
        message: t('common.success'),
        description: t('module_manage.lesson_deleted_success'),
      });
    } catch (error: any) {
      open?.({
        type: "error",
        message: t('common.error'),
        description: t('module_manage.lesson_delete_failed', { message: error.message }),
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
      title: t('module_manage.lesson_title'),
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
      title: t('common.description'),
      dataIndex: "description",
      key: "description",
      ellipsis: { showTitle: false },
      render: (text: string) => (
        <Tooltip title={text}>
          <Text>{text || t('module_manage.no_description')}</Text>
        </Tooltip>
      ),
    },
    {
      title: t('module_manage.duration'),
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
      title: t('module_manage.difficulty'),
      dataIndex: "difficulty",
      key: "difficulty",
      width: 100,
      filters: [
        { text: t('module_manage.beginner'), value: "beginner" },
        { text: t('module_manage.intermediate'), value: "intermediate" },
        { text: t('module_manage.advanced'), value: "advanced" },
      ],
      onFilter: (value: any, record: any) => record.difficulty === value,
      render: (value: string) => {
        const config = {
          beginner: { color: "green" },
          intermediate: { color: "orange" },
          advanced: { color: "red" },
        };
        const difficultyConfig = config[value as keyof typeof config] || {
          color: "default",
        };
        return (
          <Tag color={difficultyConfig.color}>{t(`module_manage.${value}`)}</Tag>
        );
      },
    },
    {
      title: t('common.status'),
      dataIndex: "status",
      key: "status",
      width: 100,
      filters: [
        { text: t('common.published'), value: "published" },
        { text: t('common.draft'), value: "draft" },
        { text: t('common.archived'), value: "archived" },
      ],
      onFilter: (value: any, record: any) => record.status === value,
      render: (value: string) => {
        const statusLower = value?.toLowerCase();
        const statusConfig = {
          published: { color: "green" },
          draft: { color: "orange" },
          archived: { color: "gray" },
        };
        const config = statusConfig[statusLower as keyof typeof statusConfig] || {
          color: "default",
        };
        return <Tag color={config.color}>{t(`common.${statusLower}`)}</Tag>;
      },
    },
    {
      title: t('module_manage.created'),
      dataIndex: "createdAt",
      key: "createdAt",
      width: 100,
      sorter: (a: any, b: any) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      title: t('common.actions'),
      key: "actions",
      width: 260,
      render: (_: any, record: any) => (
        <Space size="small" wrap>
          <Tooltip title={t('module_manage.view_details')}>
            <Button
              icon={<EyeOutlined />}
              size="small"
              style={{ borderRadius: 8 }}
              onClick={() => handleViewLesson(record)}
            />
          </Tooltip>

          <Tooltip title={t('module_manage.edit_lesson')}>
            <Button
              type="primary"
              icon={<EditOutlined />}
              size="small"
              ghost
              style={{ borderRadius: 8 }}
              onClick={() => handleEditLesson(record)}
            />
          </Tooltip>

          <Tooltip title={t('module_manage.manage_lesson')}>
            <Link href={`/dashboard/lessons/${record.id}`}>
              <Button 
                type="dashed" 
                size="small" 
                style={{ 
                  borderRadius: 8,
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  border: "none",
                  color: "white"
                }}
              >
                {t('common.manage')}
              </Button>
            </Link>
          </Tooltip>

          <Popconfirm
            title={t('module_manage.delete_lesson_title')}
            description={t('module_manage.delete_lesson_confirm')}
            onConfirm={() => handleDeleteLesson(record.id)}
            okText={t('common.yes')}
            cancelText={t('common.no')}
          >
            <Tooltip title={t('module_manage.delete_lesson')}>
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
        <Text>{t('module_manage.module_not_found')}</Text>
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
            title: course?.title || t('module_manage.course_management'),
            href: `/dashboard/courses/${module.courseId}`,
          },
          { title: t('module_manage.module_management') },
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
                {t('module_manage.order')}: {module.moduleOrder}
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
                  {t('course_manage.locked').toUpperCase()}
                </Tag>
              )}
            </Space>
          </Col>
        </Row>
      </Card>

      <Modal
        title={
          viewLesson ? `${t('module_manage.lesson_details')}: ${viewLesson.title}` : t('module_manage.lesson_details')
        }
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button 
            key="close" 
            onClick={() => setViewModalVisible(false)}
            size="large"
            style={{
              borderRadius: '8px',
              height: '40px',
              padding: '0 24px',
              fontWeight: 500,
            }}
          >
            {t('common.close')}
          </Button>
        ]}
        width="95%"
        style={{ maxWidth: '900px', top: 20 }}
        destroyOnClose={true}
        maskClosable={true}
        keyboard={true}
        forceRender={false}
        styles={{
          body: {
            maxHeight: 'calc(100vh - 200px)',
            overflowY: 'auto',
            padding: '24px'
          }
        }}
      >
        {viewLesson && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label={t('common.title')}>
              {viewLesson.title}
            </Descriptions.Item>
            <Descriptions.Item label={t('common.description')}>
              {viewLesson.description}
            </Descriptions.Item>
            <Descriptions.Item label={t('module_manage.difficulty')}>
              {t(`module_manage.${viewLesson.difficulty}`)}
            </Descriptions.Item>
            <Descriptions.Item label={t('common.status')}>
              {t(`common.${viewLesson.status?.toLowerCase()}`)}
            </Descriptions.Item>
            <Descriptions.Item label={t('module_manage.duration_minutes')}>
              {viewLesson.durationMinutes ?? 0}
            </Descriptions.Item>
            <Descriptions.Item label={t('module_manage.type')}>
              {t(`module_manage.${viewLesson.lessonType}`)}
            </Descriptions.Item>
            <Descriptions.Item label={t('module_manage.created')}>
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
              title={t('course_manage.total_lessons')}
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
              title={t('module_manage.published_lessons')}
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
              title={t('module_manage.assignments')}
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
              title={t('module_manage.quizzes')}
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
              title={t('module_manage.total_duration')}
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
              title={t('module_manage.module_duration')}
              value={module.estimatedDurationHours || 0}
              suffix={t('module_manage.hrs')}
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
              title={t('module_manage.course')}
              value={course?.title || t('module_manage.unknown')}
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
              title={t('module_manage.author')}
              value={t('module_manage.unknown')}
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
        title={t('course_manage.module_details')}
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
          <Descriptions.Item label={t('common.title')}>{module.title}</Descriptions.Item>
          <Descriptions.Item label={t('module_manage.order')}>
            {module.moduleOrder}
          </Descriptions.Item>
          <Descriptions.Item label={t('course_manage.duration')}>
            {module.estimatedDurationHours || 0} {t('course_manage.hours_full')}
          </Descriptions.Item>
          <Descriptions.Item label={t('common.status')}>
            <Tag
              color={
                module.status === "published"
                  ? "green"
                  : module.status === "draft"
                  ? "orange"
                  : "gray"
              }
            >
              {t(`common.${module.status?.toLowerCase()}`) || t('common.draft')}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label={t('course_manage.access')}>
            <Tag color={module.isLocked ? "red" : "green"}>
              {module.isLocked ? t('course_manage.locked') : t('course_manage.open')}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label={t('common.created_at')}>
            {new Date(module.createdAt).toLocaleDateString()}
          </Descriptions.Item>
          <Descriptions.Item label={t('common.description')} span={2}>
            {module.description || t('module_manage.no_description_provided')}
          </Descriptions.Item>
          {module.learningObjectives && (
            <Descriptions.Item label={t('course_manage.learning_objectives')} span={2}>
              {module.learningObjectives}
            </Descriptions.Item>
          )}
          {module.prerequisites && (
            <Descriptions.Item label={t('course_manage.prerequisites')} span={2}>
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
              {t('module_manage.module_lessons')} ({lessons.length} {t('module_manage.total')}, {publishedLessons}{" "}
              {t('module_manage.published')})
            </span>
          </div>
        }
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setLessonModalVisible(true)}
            size="large"
            style={{
              borderRadius: "8px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              border: "none",
              fontWeight: 500,
              boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)"
            }}
          >
            {t('module_manage.add_lesson')}
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
            <div>{t('module_manage.no_lessons_found')}</div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setLessonModalVisible(true)}
              style={{ 
                marginTop: 16,
                borderRadius: "8px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                border: "none",
                boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)"
              }}
              size="large"
            >
              {t('module_manage.add_first_lesson')}
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
                `${range[0]}-${range[1]} ${t('module_manage.of')} ${total} ${t('module_manage.lessons')}`,
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
            ? `${t('module_manage.edit_lesson')}: ${editingLesson.title}`
            : t('module_manage.add_new_lesson')
        }
        open={lessonModalVisible}
        onCancel={() => {
          setLessonModalVisible(false);
          setEditingLesson(null);
          lessonForm.resetFields();
        }}
        footer={null}
        width="95%"
        style={{ maxWidth: '1100px', top: 20 }}
        destroyOnClose={true}
        maskClosable={true}
        keyboard={true}
        forceRender={false}
        styles={{
          body: {
            maxHeight: 'calc(100vh - 200px)',
            overflowY: 'auto',
            padding: '24px'
          }
        }}
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
                  label={t('module_manage.lesson_title')}
                  rules={[
                    { required: true, message: t('forms.please_enter', { field: t('module_manage.lesson_title').toLowerCase() }) },
                  ]}
                >
                  <Input size="large" placeholder={t('module_manage.enter_lesson_title')} />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="description"
              label={t('common.description')}
              rules={[
                { required: true, message: t('forms.please_enter', { field: t('common.description').toLowerCase() }) },
              ]}
            >
              <Input.TextArea rows={3} placeholder={t('module_manage.enter_lesson_description')} />
            </Form.Item>

            {/* Duration and Difficulty */}
            <Row gutter={16}>
              <Col xs={12} sm={8} md={6} lg={4} xl={4}>
                <Form.Item
                  name="durationMinutes"
                  label={t('module_manage.duration_minutes')}
                  rules={[{ required: true, message: t('forms.please_enter', { field: t('module_manage.duration').toLowerCase() }) }]}
                >
                  <InputNumber min={1} style={{ width: "100%" }} size="large" />
                </Form.Item>
              </Col>
              <Col xs={12} sm={8} md={6} lg={6} xl={6}>
                <Form.Item
                  name="estimatedCompletionTime"
                  label={t('module_manage.completion_time')}
                >
                  <InputNumber min={1} style={{ width: "100%" }} size="large" />
                </Form.Item>
              </Col>
              <Col xs={12} sm={8} md={6} lg={6} xl={6}>
                <Form.Item
                  name="difficulty"
                  label={t('module_manage.difficulty')}
                  rules={[
                    { required: true, message: t('forms.please_select', { field: t('module_manage.difficulty').toLowerCase() }) },
                  ]}
                >
                  <Select size="large" placeholder={t('module_manage.select_difficulty')}>
                    <Select.Option value="beginner">{t('module_manage.beginner')}</Select.Option>
                    <Select.Option value="intermediate">
                      {t('module_manage.intermediate')}
                    </Select.Option>
                    <Select.Option value="advanced">{t('module_manage.advanced')}</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={12} sm={12} md={6} lg={4} xl={4}>
                <Form.Item
                  name="lessonType"
                  label={t('module_manage.lesson_type')}
                  rules={[
                    { required: true, message: t('forms.please_select', { field: t('module_manage.lesson_type').toLowerCase() }) },
                  ]}
                >
                  <Select size="large" placeholder={t('module_manage.select_type')}>
                    <Select.Option value="video">{t('module_manage.video')}</Select.Option>
                    <Select.Option value="text">{t('module_manage.text')}</Select.Option>
                    <Select.Option value="audio">{t('module_manage.audio')}</Select.Option>
                    <Select.Option value="practical">{t('module_manage.practical')}</Select.Option>
                    <Select.Option value="discussion">{t('module_manage.discussion')}</Select.Option>
                    <Select.Option value="assignment">{t('module_manage.assignment')}</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={12} sm={12} md={6} lg={4} xl={4}>
                <Form.Item
                  name="lessonOrder"
                  label={t('module_manage.order')}
                  rules={[
                    { required: true, message: t('forms.please_enter', { field: t('module_manage.order').toLowerCase() }) },
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
                <ImageUploadField
                  name="imageUrl"
                  label="Lesson Image"
                  form={lessonForm}
                  initialImageUrl={editingLesson?.imageUrl}
                  maxSize={5 * 1024 * 1024}
                />
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
              <div style={{ 
                display: 'flex', 
                justifyContent: 'flex-end', 
                gap: '12px',
                paddingTop: '24px',
                borderTop: '1px solid #e5e7eb'
              }}>
                <Button
                  onClick={() => {
                    setLessonModalVisible(false);
                    setEditingLesson(null);
                    lessonForm.resetFields();
                  }}
                  size="large"
                  style={{
                    borderRadius: "8px",
                    border: "2px solid #e5e7eb",
                    color: "#6b7280",
                    fontWeight: "500",
                    padding: "8px 24px",
                    height: "auto"
                  }}
                >
                  {t('common.cancel')}
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={createLoading || updateLoading}
                  style={{
                    borderRadius: "8px",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    border: "none",
                    color: "white",
                    fontWeight: "500",
                    padding: "8px 24px",
                    height: "auto",
                    boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)"
                  }}
                >
                  {createLoading || updateLoading ? t('forms.saving') : (editingLesson ? t('module_manage.update_lesson') : t('module_manage.create_lesson'))}
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Card>
      </Modal>
    </div>
  );
}
