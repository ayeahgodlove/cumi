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
  Select,
  DatePicker,
  Popconfirm,
} from "antd";
import {
  ArrowLeftOutlined,
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
import CourseHeader from "@components/course/course-header.component";
import EnhancedBreadcrumb from "@components/shared/enhanced-breadcrumb/enhanced-breadcrumb.component";
import { 
  useGetModulesByCourseQuery,
  useCreateModuleMutation,
  useUpdateModuleMutation,
  useDeleteModuleMutation 
} from "@store/api/module_api";
import { useGetSingleCourseQuery } from "@store/api/course_api";
import dayjs from "dayjs";

const { Title, Text } = Typography;

interface CourseDetailsPageProps {
  params: {
    id: string;
  };
}

export default function CourseDetailsPage({ params }: CourseDetailsPageProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const { open } = useNotification();
  const [moduleModalVisible, setModuleModalVisible] = useState(false);
  const [editingModule, setEditingModule] = useState<any>(null);
  const [moduleForm] = Form.useForm();
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [viewModalData, setViewModalData] = useState<any>(null);

  // RTK Query hooks
  const { data: course, isLoading: courseLoading, error: courseError } = useGetSingleCourseQuery(params.id);
  const { data: modules = [], isLoading: modulesLoading, refetch: refetchModules } = useGetModulesByCourseQuery(params.id);
  const [createModule, { isLoading: createLoading }] = useCreateModuleMutation();
  const [updateModule, { isLoading: updateLoading }] = useUpdateModuleMutation();
  const [deleteModule, { isLoading: deleteLoading }] = useDeleteModuleMutation();


  // Handle course error
  useEffect(() => {
    if (courseError) {
        open?.({
          type: "error",
          message: "Error",
        description: "Failed to fetch course data",
      });
      router.push("/dashboard/creator");
    }
  }, [courseError, open, router]);

  const handleModuleSubmit = async (values: any) => {
    try {
      // Generate slug from title
      const slug = values.title
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim("-");

      // Handle unlockDate properly - convert dayjs to ISO string
      let unlockDate = null;
      if (values.unlockDate) {
        if (dayjs.isDayjs(values.unlockDate)) {
          unlockDate = values.unlockDate.toISOString();
        } else if (values.unlockDate instanceof Date) {
          unlockDate = values.unlockDate.toISOString();
        } else if (typeof values.unlockDate === 'string') {
          unlockDate = values.unlockDate;
        } else {
          try {
            unlockDate = new Date(values.unlockDate).toISOString();
          } catch (e) {
            unlockDate = null;
          }
        }
      }

      const moduleData = {
        title: values.title,
        slug: slug,
        description: values.description || "",
        courseId: params.id,
        userId: session?.user?.id || "",
        moduleOrder: values.moduleOrder || 1,
        status: values.status || "draft",
        learningObjectives: values.learningObjectives || "",
        prerequisites: values.prerequisites || "",
        estimatedDurationHours: values.estimatedDurationHours || null,
        isLocked: values.isLocked || false,
        unlockDate: unlockDate,
        totalLessons: 0,
        totalQuizzes: 0,
        totalAssignments: 0,
      };

      // Validate required data
      if (!session?.user?.id) {
        throw new Error("User session not found. Please log in again.");
      }

      if (!params.id) {
        throw new Error("Course ID is required.");
      }

      if (editingModule) {
        // Update module
        await updateModule({ id: editingModule.id, module: moduleData }).unwrap();
        open?.({
          type: "success",
          message: "Success",
          description: "Module updated successfully!",
        });
      } else {
        // Create module
        await createModule(moduleData).unwrap();
        open?.({
          type: "success",
          message: "Success",
          description: "Module created successfully!",
        });
      }
      
      moduleForm.resetFields();
      setEditingModule(null);
      setModuleModalVisible(false);
    } catch (error: any) {
      // Extract error message from RTK Query error
      let errorMessage = "Unknown error occurred";
      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.data?.validationErrors?.length > 0) {
        errorMessage = error.data.validationErrors.map((err: any) => err.message).join(", ");
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (error?.status) {
        errorMessage = `Server error (${error.status})`;
      }

      open?.({
        type: "error",
        message: "Error",
        description: `Failed to save module: ${errorMessage}`,
      });
    }
  };

  const handleViewModule = (module: any) => {
    setViewModalData(module);
    setViewModalVisible(true);
  };

  const handleEditModule = (module: any) => {
    setEditingModule(module);
    moduleForm.setFieldsValue({
      ...module,
      unlockDate: module.unlockDate ? dayjs(module.unlockDate) : null,
    });
    setModuleModalVisible(true);
  };

  const handleDeleteModule = async (moduleId: string) => {
    try {
      await deleteModule(moduleId).unwrap();
      open?.({
        type: "success",
        message: "Success",
        description: "Module deleted successfully!",
      });
        } catch (error: any) {
      open?.({
        type: "error",
        message: "Error",
        description: `Failed to delete module: ${error.message}`,
      });
    }
  };

  const moduleColumns = [
    {
      title: "#",
      dataIndex: "moduleOrder",
      key: "moduleOrder",
      width: 60,
      render: (value: number) => (
        <Tag color="blue" style={{ fontWeight: 'bold' }}>
          {value || 1}
        </Tag>
      ),
      sorter: (a: any, b: any) => (a.moduleOrder || 0) - (b.moduleOrder || 0),
    },
    {
      title: "Module Title",
      dataIndex: "title",
      key: "title",
      render: (value: string, record: any) => (
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: 4 }}>
            {value || 'Untitled Module'}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            ID: {record.id?.substring(0, 8)}...
          </div>
        </div>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      render: (value: string) => (
        <div style={{ maxWidth: 200 }}>
          {value ? (
            <Text ellipsis={{ tooltip: value }}>
              {value}
            </Text>
          ) : (
            <Text type="secondary" italic>No description</Text>
          )}
        </div>
      ),
    },
    {
      title: "Duration",
      dataIndex: "estimatedDurationHours",
      key: "estimatedDurationHours",
      width: 100,
      render: (value: number) => (
        <div style={{ textAlign: 'center' }}>
          {value ? (
            <Tag color="blue">
              <ClockCircleOutlined style={{ marginRight: 4 }} />
              {value}h
            </Tag>
          ) : (
            <Text type="secondary">-</Text>
          )}
        </div>
      ),
    },
    {
      title: "Content Stats",
      key: "contentStats",
      width: 150,
      render: (_: any, record: any) => (
        <Space size="small">
          <Tag color="green" icon={<BookOutlined />}>
            {record.totalLessons || 0}
          </Tag>
          <Tag color="orange">
            {record.totalAssignments || 0}
          </Tag>
          <Tag color="purple">
            {record.totalQuizzes || 0}
          </Tag>
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (value: string) => {
        const statusConfig = {
          published: { color: 'green', text: 'Published' },
          draft: { color: 'orange', text: 'Draft' },
          archived: { color: 'gray', text: 'Archived' }
        };
        const config = statusConfig[value as keyof typeof statusConfig] || { color: 'default', text: value };
        
        return (
          <Tag color={config.color}>
            {config.text}
          </Tag>
        );
      },
      filters: [
        { text: 'Published', value: 'published' },
        { text: 'Draft', value: 'draft' },
        { text: 'Archived', value: 'archived' },
      ],
      onFilter: (value: any, record: any) => record.status === value,
    },
    {
      title: "Access",
      dataIndex: "isLocked",
      key: "isLocked",
      width: 80,
      render: (value: boolean, record: any) => (
        <div>
          <Tag color={value ? "red" : "green"}>
            {value ? "Locked" : "Open"}
          </Tag>
          {record.unlockDate && (
            <div style={{ fontSize: '10px', color: '#666', marginTop: 2 }}>
              Until: {new Date(record.unlockDate).toLocaleDateString()}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 100,
      render: (value: string) => (
        <Text style={{ fontSize: '12px' }}>
          {value ? new Date(value).toLocaleDateString() : '-'}
        </Text>
      ),
      sorter: (a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: "Actions",
      key: "actions",
      width: 200,
      render: (_: any, record: any) => (
        <Space>
          <Button 
            icon={<EyeOutlined />} 
            size="small" 
            onClick={() => handleViewModule(record)}
            title="View Module"
          />
          <Button 
            icon={<EditOutlined />} 
            size="small" 
            onClick={() => handleEditModule(record)}
            title="Edit Module"
          />
          <Button 
            type="primary"
            size="small" 
            onClick={() => router.push(`/dashboard/modules/${record.id}`)}
            title="Manage Module"
          >
            Manage
          </Button>
          <Popconfirm
            title="Delete Module"
            description="Are you sure you want to delete this module?"
            onConfirm={() => handleDeleteModule(record.id)}
            okText="Yes"
            cancelText="No"
          >
          <Button 
            icon={<DeleteOutlined />} 
            size="small" 
            danger
              loading={deleteLoading}
              title="Delete Module"
          />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (courseLoading) {
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

  if (!course) {
    return (
      <div
        style={{
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
          height: "100vh",
        }}
      >
        <Text>Course not found</Text>
      </div>
    );
  }

  // Calculate course stats
  const totalModules = modules.length;
  const publishedModules = modules.filter((m) => m.status === 'published').length;
  const totalLessons = modules.reduce((sum, m) => sum + (m.totalLessons || 0), 0);
  const totalAssignments = modules.reduce((sum, m) => sum + (m.totalAssignments || 0), 0);
  const totalQuizzes = modules.reduce((sum, m) => sum + (m.totalQuizzes || 0), 0);
  const totalDuration = modules.reduce((sum, m) => sum + (m.estimatedDurationHours || 0), 0);

  return (
    <div style={{ padding: "24px" }}>
      {/* Enhanced Breadcrumb */}
      <EnhancedBreadcrumb
        items={[
          { title: "Course Management" },
          { title: course?.title || "Loading..." }
        ]}
      />

      {/* Page Title */}
      <Title level={2} style={{ marginBottom: 24 }}>
        Course Details
      </Title>

      {/* Course Header */}
      <CourseHeader course={course} />

      {/* Course Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Title level={4}>Course Statistics</Title>
        </Col>
        <Col sm={6} md={6} span={24}>
          <Card
            size="small"
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              border: "none",
            }}
          >
            <Statistic
              title="Total Modules"
              value={totalModules}
              prefix={
                <span style={{ color: "#1890ff" }}>
                  <BookOutlined />
                </span>
              }
              valueStyle={{ fontSize: 20 }}
            />
          </Card>
        </Col>
        <Col sm={6} md={6} span={24}>
          <Card
            size="small"
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              border: "none",
            }}
          >
            <Statistic
              title="Published Modules"
              value={publishedModules}
              prefix={
                <span style={{ color: "#52c41a" }}>
                  <BookOutlined />
                </span>
              }
              valueStyle={{ fontSize: 20 }}
            />
          </Card>
        </Col>
        <Col sm={6} md={6} span={24}>
          <Card
            size="small"
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
              prefix={
                <span style={{ color: "#722ed1" }}>
                  <BookOutlined />
                </span>
              }
              valueStyle={{ fontSize: 20 }}
            />
          </Card>
        </Col>
        <Col sm={6} md={6} span={24}>
          <Card
            size="small"
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
              prefix={
                <span style={{ color: "#fa8c16" }}>
                  <ClockCircleOutlined />
                </span>
              }
              valueStyle={{ fontSize: 20 }}
            />
          </Card>
        </Col>
        <Col sm={6} md={6} span={24}>
          <Card
            size="small"
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
              prefix={
                <span style={{ color: "#13c2c2" }}>
                  <TrophyOutlined />
                </span>
              }
              valueStyle={{ fontSize: 20 }}
            />
          </Card>
        </Col>
        <Col sm={6} md={6} span={24}>
          <Card
            size="small"
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
              prefix={
                <span style={{ color: "#eb2f96" }}>
                  <TrophyOutlined />
                </span>
              }
              valueStyle={{ fontSize: 20 }}
            />
          </Card>
        </Col>
        <Col sm={6} md={6} span={24}>
          <Card
            size="small"
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              border: "none",
            }}
          >
            <Statistic
              title="Enrolled Students"
              value={course.currentStudents || 0}
              prefix={
                <span style={{ color: "#52c41a" }}>
                  <UserOutlined />
                </span>
              }
              valueStyle={{ fontSize: 20 }}
            />
          </Card>
        </Col>
        <Col sm={6} md={6} span={24}>
          <Card
            size="small"
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              border: "none",
            }}
          >
            <Statistic
              title="Max Students"
              value={course.maxStudents || "Unlimited"}
              prefix={
                <span style={{ color: "#fa8c16" }}>
                  <UserOutlined />
                </span>
              }
              valueStyle={{ fontSize: 20 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Course Details */}
      <Card
        title="Course Details"
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          border: "none",
          marginBottom: 24,
        }}
      >
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Author">
            {course.authorName}
          </Descriptions.Item>
          <Descriptions.Item label="Price">
            {course.isFree ? (
              <Tag color="green">Free</Tag>
            ) : (
              `${course.price || 0} ${course.currency || "XAF"}`
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Language">
            {course.language}
          </Descriptions.Item>
          <Descriptions.Item label="Duration">
            {course.durationWeeks} weeks
          </Descriptions.Item>
          <Descriptions.Item label="Created At">
            {new Date(course.createdAt).toLocaleDateString()}
          </Descriptions.Item>
          <Descriptions.Item label="Updated At">
            {new Date(course.updatedAt).toLocaleDateString()}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Modules Management */}
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Course Modules</span>
            {modules.length > 0 && (
              <div style={{ fontSize: '14px', color: '#666', fontWeight: 'normal' }}>
                {modules.length} module{modules.length !== 1 ? 's' : ''} • {' '}
                {modules.filter(m => m.status === 'published').length} published • {' '}
                {modules.reduce((sum, m) => sum + (m.totalLessons || 0), 0)} lessons total
              </div>
            )}
          </div>
        }
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => setModuleModalVisible(true)}
          >
            Add Module
          </Button>
        }
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          border: "none",
        }}
      >
        {modules.length === 0 && !modulesLoading ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px 20px',
            color: '#666'
          }}>
            <BookOutlined style={{ fontSize: '48px', marginBottom: '16px', color: '#d9d9d9' }} />
            <div style={{ fontSize: '16px', marginBottom: '8px' }}>
              No modules found for this course
            </div>
            <div style={{ fontSize: '14px', color: '#999' }}>
              Click "Add Module" to create your first module
            </div>
          </div>
        ) : (
        <Table
          dataSource={modules}
          columns={moduleColumns}
          rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} modules`,
            }}
          size="small"
            loading={modulesLoading}
            scroll={{ x: 1200 }}
            rowClassName={(record, index) => 
              index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
            }
        />
        )}
      </Card>

      {/* Module Modal */}
      <Modal
        title={
          editingModule
            ? `Edit Module: ${editingModule.title}`
            : "Add New Module"
        }
        open={moduleModalVisible}
        onCancel={() => {
          setModuleModalVisible(false);
          setEditingModule(null);
          moduleForm.resetFields();
        }}
        footer={null}
        width={800}
        // style={{ backgroundColor: "white" }}
      >
        <Card style={{ backgroundColor: "white" }}>
        <Form
          form={moduleForm}
          layout="vertical"
          onFinish={handleModuleSubmit}
        >
          <Form.Item
            name="title"
            label="Module Title"
            rules={[{ required: true, message: "Please enter module title" }]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
              rules={[
                { required: true, message: "Please enter module description" },
              ]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>

            <Form.Item name="learningObjectives" label="Learning Objectives">
              <Input.TextArea
                rows={3}
                placeholder="Enter learning objectives..."
              />
            </Form.Item>

            <Form.Item name="prerequisites" label="Prerequisites">
              <Input.TextArea rows={3} placeholder="Enter prerequisites..." />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                  name="moduleOrder"
                  label="Module Order"
                  rules={[
                    { required: true, message: "Please enter module order" },
                  ]}
                  initialValue={1}
                >
                  <InputNumber min={1} style={{ width: "100%" }} size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                  name="estimatedDurationHours"
                  label="Duration (hours)"
              >
                  <InputNumber min={1} style={{ width: "100%" }} size="large" />
              </Form.Item>
            </Col>
          </Row>

            <Row gutter={16}>
              <Col span={12}>
          <Form.Item
                  name="status"
                  label="Status"
                  rules={[{ required: true, message: "Please select status" }]}
                  initialValue="draft"
                >
                  <Select size="large">
                    <Select.Option value="draft">Draft</Select.Option>
                    <Select.Option value="published">Published</Select.Option>
                    <Select.Option value="archived">Archived</Select.Option>
                  </Select>
          </Form.Item>
              </Col>
              <Col span={12}>
          <Form.Item
                  name="isLocked"
                  label="Lock Module"
            valuePropName="checked"
            initialValue={false}
          >
            <Switch />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="unlockDate" label="Unlock Date (if locked)">
              <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item>
            <Space>
                <Button type="primary" htmlType="submit">
                {editingModule ? "Update Module" : "Create Module"}
              </Button>
                <Button
                  onClick={() => {
                setModuleModalVisible(false);
                setEditingModule(null);
                moduleForm.resetFields();
                  }}
                >
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
        </Card>
      </Modal>

      {/* View Module Modal */}
      <Modal
        title={`Module Details: ${viewModalData?.title}`}
        open={viewModalVisible}
        onCancel={() => {
          setViewModalVisible(false);
          setViewModalData(null);
        }}
        footer={[
          <Button key="close" onClick={() => {
            setViewModalVisible(false);
            setViewModalData(null);
          }}>
            Close
          </Button>
        ]}
        width={800}
      >
        {viewModalData && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Title">{viewModalData.title}</Descriptions.Item>
            <Descriptions.Item label="Description" span={2}>
              {viewModalData.description}
            </Descriptions.Item>
            <Descriptions.Item label="Learning Objectives" span={2}>
              {viewModalData.learningObjectives || 'Not specified'}
            </Descriptions.Item>
            <Descriptions.Item label="Prerequisites" span={2}>
              {viewModalData.prerequisites || 'None'}
            </Descriptions.Item>
            <Descriptions.Item label="Module Order">{viewModalData.moduleOrder}</Descriptions.Item>
            <Descriptions.Item label="Duration">
              {viewModalData.estimatedDurationHours ? `${viewModalData.estimatedDurationHours} hours` : 'Not specified'}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={
                viewModalData.status === 'published' ? 'green' :
                viewModalData.status === 'draft' ? 'orange' :
                viewModalData.status === 'archived' ? 'gray' : 'default'
              }>
                {viewModalData.status?.charAt(0).toUpperCase() + viewModalData.status?.slice(1)}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Locked">
              <Tag color={viewModalData.isLocked ? 'red' : 'green'}>
                {viewModalData.isLocked ? 'Locked' : 'Unlocked'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Unlock Date">
              {viewModalData.unlockDate ? new Date(viewModalData.unlockDate).toLocaleDateString() : 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Total Lessons">{viewModalData.totalLessons || 0}</Descriptions.Item>
            <Descriptions.Item label="Total Assignments">{viewModalData.totalAssignments || 0}</Descriptions.Item>
            <Descriptions.Item label="Total Quizzes">{viewModalData.totalQuizzes || 0}</Descriptions.Item>
            <Descriptions.Item label="Created At">
              {new Date(viewModalData.createdAt).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Updated At">
              {new Date(viewModalData.updatedAt).toLocaleString()}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}
