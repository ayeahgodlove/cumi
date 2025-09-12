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
  message,
  Spin,
  Divider,
  Descriptions,
  Breadcrumb,
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
  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [quizes, setQuizes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [moduleModalVisible, setModuleModalVisible] = useState(false);
  const [editingModule, setEditingModule] = useState<any>(null);
  const [moduleForm] = Form.useForm();

  // Fetch course details and related data
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        // Fetch course details
        const courseResponse = await fetch(`/api/courses/${params.id}`);
        const courseData = await courseResponse.json();
        
        if (!courseResponse.ok) {
          throw new Error(courseData.message || 'Failed to fetch course');
        }
        
        setCourse(courseData);

        // Fetch modules for this course
        const modulesResponse = await fetch('/api/modules');
        const modulesData = await modulesResponse.json();
        
        if (modulesResponse.ok) {
          const courseModules = modulesData.filter((module: any) => module.courseId === params.id);
          setModules(courseModules);
        }

        // Fetch lessons for this course
        const lessonsResponse = await fetch('/api/lessons');
        const lessonsData = await lessonsResponse.json();
        
        if (lessonsResponse.ok) {
          const courseLessons = lessonsData.filter((lesson: any) => lesson.courseId === params.id);
          setLessons(courseLessons);
        }

        // Fetch assignments for this course
        const assignmentsResponse = await fetch('/api/assignments');
        const assignmentsData = await assignmentsResponse.json();
        
        if (assignmentsResponse.ok) {
          const courseAssignments = assignmentsData.filter((assignment: any) => assignment.courseId === params.id);
          setAssignments(courseAssignments);
        }

        // Fetch quizes for this course
        const quizesResponse = await fetch('/api/quizes');
        const quizesData = await quizesResponse.json();
        
        if (quizesResponse.ok) {
          const courseQuizes = quizesData.filter((quiz: any) => quiz.courseId === params.id);
          setQuizes(courseQuizes);
        }

      } catch (error: any) {
        open?.({
          type: "error",
          message: "Error",
          description: `Failed to fetch course data: ${error.message}`,
        });
        router.push('/dashboard/creator');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchCourseData();
    }
  }, [params.id, router, open]);

  const handleModuleSubmit = async (values: any) => {
    try {
      const moduleData = {
        ...values,
        courseId: params.id,
      };

      if (editingModule) {
        // Update module
        const response = await fetch(`/api/modules/${editingModule.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(moduleData),
        });

        const result = await response.json();
        
        if (response.ok) {
          message.success("Module updated successfully!");
          // Update the modules list
          setModules(modules.map(m => m.id === editingModule.id ? result.data : m));
        } else {
          throw new Error(result.message || 'Failed to update module');
        }
      } else {
        // Create module
        const response = await fetch('/api/modules', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(moduleData),
        });

        const result = await response.json();
        
        if (response.ok) {
          message.success("Module created successfully!");
          // Add the new module to the list
          setModules([...modules, result.data]);
        } else {
          throw new Error(result.message || 'Failed to create module');
        }
      }
      
      moduleForm.resetFields();
      setEditingModule(null);
      setModuleModalVisible(false);
    } catch (error: any) {
      message.error("Failed to save module: " + error.message);
    }
  };

  const handleEditModule = (module: any) => {
    setEditingModule(module);
    moduleForm.setFieldsValue(module);
    setModuleModalVisible(true);
  };

  const handleDeleteModule = (moduleId: string) => {
    Modal.confirm({
      title: "Are you sure you want to delete this module?",
      content: "This action cannot be undone.",
      onOk: async () => {
        try {
          const response = await fetch(`/api/modules/${moduleId}`, {
            method: 'DELETE',
          });

          const result = await response.json();
          
          if (response.ok) {
            message.success("Module deleted successfully!");
            // Remove the module from the list
            setModules(modules.filter(m => m.id !== moduleId));
          } else {
            throw new Error(result.message || 'Failed to delete module');
          }
        } catch (error: any) {
          message.error("Failed to delete module: " + error.message);
        }
      },
    });
  };

  const moduleColumns = [
    {
      title: "Order",
      dataIndex: "order",
      key: "order",
      width: 80,
      render: (value: number) => <Tag color="blue">{value}</Tag>,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Duration (min)",
      dataIndex: "duration",
      key: "duration",
      width: 120,
    },
    {
      title: "Lessons",
      key: "lessons",
      width: 80,
      render: (_, record: any) => {
        const moduleLessons = lessons.filter((lesson: any) => lesson.moduleId === record.id);
        return <Tag color="green">{moduleLessons.length}</Tag>;
      },
    },
    {
      title: "Assignments",
      key: "assignments",
      width: 100,
      render: (_, record: any) => {
        const moduleAssignments = assignments.filter((assignment: any) => assignment.moduleId === record.id);
        return <Tag color="orange">{moduleAssignments.length}</Tag>;
      },
    },
    {
      title: "Quizzes",
      key: "quizzes",
      width: 80,
      render: (_, record: any) => {
        const moduleQuizes = quizes.filter((quiz: any) => quiz.moduleId === record.id);
        return <Tag color="purple">{moduleQuizes.length}</Tag>;
      },
    },
    {
      title: "Status",
      dataIndex: "isPublished",
      key: "isPublished",
      width: 100,
      render: (value: boolean) => (
        <Tag color={value ? "green" : "orange"}>
          {value ? "Published" : "Draft"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 200,
      render: (_, record: any) => (
        <Space>
          <Button 
            icon={<EyeOutlined />} 
            size="small" 
            onClick={() => {/* View module */}}
          />
          <Button 
            icon={<EditOutlined />} 
            size="small" 
            onClick={() => handleEditModule(record)}
          />
          <Button 
            type="primary"
            size="small" 
            onClick={() => router.push(`/dashboard/modules/${record.id}`)}
            title="Manage Module"
          >
            Manage
          </Button>
          <Button 
            icon={<DeleteOutlined />} 
            size="small" 
            danger
            onClick={() => handleDeleteModule(record.id)}
          />
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh" 
      }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!course) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh" 
      }}>
        <Text>Course not found</Text>
      </div>
    );
  }

  // Calculate course stats
  const totalModules = modules.length;
  const publishedModules = modules.filter(m => m.isPublished).length;
  const totalLessons = lessons.length;
  const totalAssignments = assignments.length;
  const totalQuizzes = quizes.length;
  const totalDuration = modules.reduce((sum, m) => sum + (m.duration || 0), 0);

  return (
    <div style={{ padding: "24px" }}>
      {/* Breadcrumb */}
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>
          <Button 
            type="link" 
            icon={<ArrowLeftOutlined />} 
            onClick={() => router.push('/dashboard/creator')}
          >
            Creator Dashboard
          </Button>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Course Management</Breadcrumb.Item>
        <Breadcrumb.Item>{course.title}</Breadcrumb.Item>
      </Breadcrumb>

      {/* Course Header */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={16}>
            <Title level={2} style={{ margin: 0 }}>
              {course.title}
            </Title>
            <Text type="secondary" style={{ fontSize: 16 }}>
              {course.description}
            </Text>
          </Col>
          <Col xs={24} md={8} style={{ textAlign: 'right' }}>
            <Space>
              <Tag color={
                course.status === 'published' ? 'green' :
                course.status === 'draft' ? 'orange' :
                course.status === 'archived' ? 'gray' : 'default'
              }>
                {course.status?.toUpperCase()}
              </Tag>
              <Tag color="blue">
                {course.level?.toUpperCase()}
              </Tag>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Course Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Total Modules"
              value={totalModules}
              prefix={<BookOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Published Modules"
              value={publishedModules}
              prefix={<BookOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Total Lessons"
              value={totalLessons}
              prefix={<BookOutlined style={{ color: '#722ed1' }} />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Total Duration"
              value={totalDuration}
              suffix="min"
              prefix={<ClockCircleOutlined style={{ color: '#fa8c16' }} />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Assignments"
              value={totalAssignments}
              prefix={<TrophyOutlined style={{ color: '#13c2c2' }} />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Quizzes"
              value={totalQuizzes}
              prefix={<TrophyOutlined style={{ color: '#eb2f96' }} />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Enrolled Students"
              value={course.currentStudents || 0}
              prefix={<UserOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Max Students"
              value={course.maxStudents || 'Unlimited'}
              prefix={<UserOutlined style={{ color: '#fa8c16' }} />}
            />
          </Card>
        </Col>
      </Row>

      {/* Course Details */}
      <Card title="Course Details" style={{ marginBottom: 24 }}>
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Author">{course.authorName}</Descriptions.Item>
          <Descriptions.Item label="Price">
            {course.isFree ? (
              <Tag color="green">Free</Tag>
            ) : (
              `${course.price || 0} ${course.currency || 'XAF'}`
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Language">{course.language}</Descriptions.Item>
          <Descriptions.Item label="Duration">{course.durationWeeks} weeks</Descriptions.Item>
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
        title="Course Modules"
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => setModuleModalVisible(true)}
          >
            Add Module
          </Button>
        }
      >
        <Table
          dataSource={modules}
          columns={moduleColumns}
          rowKey="id"
          pagination={false}
          size="small"
        />
      </Card>

      {/* Module Modal */}
      <Modal
        title={editingModule ? `Edit Module: ${editingModule.title}` : "Add New Module"}
        open={moduleModalVisible}
        onCancel={() => {
          setModuleModalVisible(false);
          setEditingModule(null);
          moduleForm.resetFields();
        }}
        footer={null}
        width={800}
      >
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
            rules={[{ required: true, message: "Please enter module description" }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="order"
                label="Order"
                rules={[{ required: true, message: "Please enter module order" }]}
              >
                <InputNumber min={1} style={{ width: '100%' }} size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="duration"
                label="Duration (minutes)"
                rules={[{ required: true, message: "Please enter duration" }]}
              >
                <InputNumber min={1} style={{ width: '100%' }} size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="content"
            label="Module Content"
            rules={[{ required: true, message: "Please enter module content" }]}
          >
            <RichTextEditor
              value={moduleForm.getFieldValue("content")}
              onChange={(html) => moduleForm.setFieldValue("content", html)}
              placeholder="Enter module content..."
              height={200}
            />
          </Form.Item>

          <Form.Item
            name="isPublished"
            label="Publish Module"
            valuePropName="checked"
            initialValue={false}
          >
            <Switch />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button 
                type="primary" 
                htmlType="submit"
              >
                {editingModule ? "Update Module" : "Create Module"}
              </Button>
              <Button onClick={() => {
                setModuleModalVisible(false);
                setEditingModule(null);
                moduleForm.resetFields();
              }}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
