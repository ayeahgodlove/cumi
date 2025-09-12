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

interface ModuleDetailsPageProps {
  params: {
    id: string;
  };
}

export default function ModuleDetailsPage({ params }: ModuleDetailsPageProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const { open } = useNotification();
  const [module, setModule] = useState<any>(null);
  const [course, setCourse] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [quizes, setQuizes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lessonModalVisible, setLessonModalVisible] = useState(false);
  const [editingLesson, setEditingLesson] = useState<any>(null);
  const [lessonForm] = Form.useForm();

  // Fetch module details and related data
  useEffect(() => {
    const fetchModuleData = async () => {
      try {
        // Fetch module details
        const moduleResponse = await fetch(`/api/modules/${params.id}`);
        const moduleData = await moduleResponse.json();
        
        if (!moduleResponse.ok) {
          throw new Error(moduleData.message || 'Failed to fetch module');
        }
        
        setModule(moduleData);

        // Fetch course details
        const courseResponse = await fetch(`/api/courses/${moduleData.courseId}`);
        const courseData = await courseResponse.json();
        
        if (courseResponse.ok) {
          setCourse(courseData);
        }

        // Fetch lessons for this module
        const lessonsResponse = await fetch('/api/lessons');
        const lessonsData = await lessonsResponse.json();
        
        if (lessonsResponse.ok) {
          const moduleLessons = lessonsData.filter((lesson: any) => lesson.moduleId === params.id);
          setLessons(moduleLessons);
        }

        // Fetch assignments for this module
        const assignmentsResponse = await fetch('/api/assignments');
        const assignmentsData = await assignmentsResponse.json();
        
        if (assignmentsResponse.ok) {
          const moduleAssignments = assignmentsData.filter((assignment: any) => assignment.moduleId === params.id);
          setAssignments(moduleAssignments);
        }

        // Fetch quizes for this module
        const quizesResponse = await fetch('/api/quizes');
        const quizesData = await quizesResponse.json();
        
        if (quizesResponse.ok) {
          const moduleQuizes = quizesData.filter((quiz: any) => quiz.moduleId === params.id);
          setQuizes(moduleQuizes);
        }

      } catch (error: any) {
        open?.({
          type: "error",
          message: "Error",
          description: `Failed to fetch module data: ${error.message}`,
        });
        router.push('/dashboard/creator');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchModuleData();
    }
  }, [params.id, router, open]);

  const handleLessonSubmit = async (values: any) => {
    try {
      const lessonData = {
        ...values,
        moduleId: params.id,
        courseId: module?.courseId,
      };

      if (editingLesson) {
        // Update lesson
        const response = await fetch(`/api/lessons/${editingLesson.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(lessonData),
        });

        const result = await response.json();
        
        if (response.ok) {
          message.success("Lesson updated successfully!");
          // Update the lessons list
          setLessons(lessons.map(l => l.id === editingLesson.id ? result.data : l));
        } else {
          throw new Error(result.message || 'Failed to update lesson');
        }
      } else {
        // Create lesson
        const response = await fetch('/api/lessons', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(lessonData),
        });

        const result = await response.json();
        
        if (response.ok) {
          message.success("Lesson created successfully!");
          // Add the new lesson to the list
          setLessons([...lessons, result.data]);
        } else {
          throw new Error(result.message || 'Failed to create lesson');
        }
      }
      
      lessonForm.resetFields();
      setEditingLesson(null);
      setLessonModalVisible(false);
    } catch (error: any) {
      message.error("Failed to save lesson: " + error.message);
    }
  };

  const handleEditLesson = (lesson: any) => {
    setEditingLesson(lesson);
    lessonForm.setFieldsValue(lesson);
    setLessonModalVisible(true);
  };

  const handleDeleteLesson = (lessonId: string) => {
    Modal.confirm({
      title: "Are you sure you want to delete this lesson?",
      content: "This action cannot be undone.",
      onOk: async () => {
        try {
          const response = await fetch(`/api/lessons/${lessonId}`, {
            method: 'DELETE',
          });

          const result = await response.json();
          
          if (response.ok) {
            message.success("Lesson deleted successfully!");
            // Remove the lesson from the list
            setLessons(lessons.filter(l => l.id !== lessonId));
          } else {
            throw new Error(result.message || 'Failed to delete lesson');
          }
        } catch (error: any) {
          message.error("Failed to delete lesson: " + error.message);
        }
      },
    });
  };

  const lessonColumns = [
    {
      title: "Order",
      dataIndex: "lessonOrder",
      key: "lessonOrder",
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
      dataIndex: "durationMinutes",
      key: "durationMinutes",
      width: 120,
    },
    {
      title: "Difficulty",
      dataIndex: "difficulty",
      key: "difficulty",
      width: 100,
      render: (value: string) => (
        <Tag color={
          value === 'beginner' ? 'green' :
          value === 'intermediate' ? 'orange' :
          value === 'advanced' ? 'red' : 'default'
        }>
          {value}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (value: string) => (
        <Tag color={
          value === 'published' ? 'green' :
          value === 'draft' ? 'orange' :
          value === 'archived' ? 'gray' : 'default'
        }>
          {value}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: (_, record: any) => (
        <Space>
          <Button 
            icon={<EyeOutlined />} 
            size="small" 
            onClick={() => {/* View lesson */}}
          />
          <Button 
            icon={<EditOutlined />} 
            size="small" 
            onClick={() => handleEditLesson(record)}
          />
          <Button 
            icon={<DeleteOutlined />} 
            size="small" 
            danger
            onClick={() => handleDeleteLesson(record.id)}
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

  if (!module) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh" 
      }}>
        <Text>Module not found</Text>
      </div>
    );
  }

  // Calculate module stats
  const totalLessons = lessons.length;
  const publishedLessons = lessons.filter(l => l.status === 'published').length;
  const totalAssignments = assignments.length;
  const totalQuizzes = quizes.length;
  const totalDuration = lessons.reduce((sum, l) => sum + (l.durationMinutes || 0), 0);

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
        <Breadcrumb.Item>
          <Button 
            type="link" 
            onClick={() => router.push(`/dashboard/courses/${module.courseId}`)}
          >
            {course?.title || 'Course Management'}
          </Button>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Module Management</Breadcrumb.Item>
        <Breadcrumb.Item>{module.title}</Breadcrumb.Item>
      </Breadcrumb>

      {/* Module Header */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={16}>
            <Title level={2} style={{ margin: 0 }}>
              {module.title}
            </Title>
            <Text type="secondary" style={{ fontSize: 16 }}>
              {module.description}
            </Text>
          </Col>
          <Col xs={24} md={8} style={{ textAlign: 'right' }}>
            <Space>
              <Tag color={module.isPublished ? 'green' : 'orange'}>
                {module.isPublished ? 'PUBLISHED' : 'DRAFT'}
              </Tag>
              <Tag color="blue">
                Order: {module.order}
              </Tag>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Module Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Total Lessons"
              value={totalLessons}
              prefix={<BookOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Published Lessons"
              value={publishedLessons}
              prefix={<BookOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
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
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
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
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Module Duration"
              value={module.duration || 0}
              suffix="min"
              prefix={<ClockCircleOutlined style={{ color: '#722ed1' }} />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Course"
              value={course?.title || 'Unknown'}
              prefix={<BookOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Author"
              value={module.authorName || 'Unknown'}
              prefix={<UserOutlined style={{ color: '#fa8c16' }} />}
            />
          </Card>
        </Col>
      </Row>

      {/* Module Details */}
      <Card title="Module Details" style={{ marginBottom: 24 }}>
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Title">{module.title}</Descriptions.Item>
          <Descriptions.Item label="Order">{module.order}</Descriptions.Item>
          <Descriptions.Item label="Duration">{module.duration} minutes</Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={module.isPublished ? 'green' : 'orange'}>
              {module.isPublished ? 'Published' : 'Draft'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Author">{module.authorName}</Descriptions.Item>
          <Descriptions.Item label="Created At">
            {new Date(module.createdAt).toLocaleDateString()}
          </Descriptions.Item>
          <Descriptions.Item label="Description" span={2}>
            {module.description}
          </Descriptions.Item>
          <Descriptions.Item label="Content" span={2}>
            <div dangerouslySetInnerHTML={{ __html: module.content }} />
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Lessons Management */}
      <Card
        title="Module Lessons"
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => setLessonModalVisible(true)}
          >
            Add Lesson
          </Button>
        }
      >
        <Table
          dataSource={lessons}
          columns={lessonColumns}
          rowKey="id"
          pagination={false}
          size="small"
        />
      </Card>

      {/* Lesson Modal */}
      <Modal
        title={editingLesson ? `Edit Lesson: ${editingLesson.title}` : "Add New Lesson"}
        open={lessonModalVisible}
        onCancel={() => {
          setLessonModalVisible(false);
          setEditingLesson(null);
          lessonForm.resetFields();
        }}
        footer={null}
        width={800}
      >
        <Form
          form={lessonForm}
          layout="vertical"
          onFinish={handleLessonSubmit}
        >
          <Form.Item
            name="title"
            label="Lesson Title"
            rules={[{ required: true, message: "Please enter lesson title" }]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter lesson description" }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="lessonOrder"
                label="Order"
                rules={[{ required: true, message: "Please enter lesson order" }]}
              >
                <InputNumber min={1} style={{ width: '100%' }} size="large" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="durationMinutes"
                label="Duration (minutes)"
                rules={[{ required: true, message: "Please enter duration" }]}
              >
                <InputNumber min={1} style={{ width: '100%' }} size="large" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="difficulty"
                label="Difficulty"
                rules={[{ required: true, message: "Please select difficulty" }]}
              >
                <Input size="large" placeholder="beginner, intermediate, advanced" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="content"
            label="Lesson Content"
            rules={[{ required: true, message: "Please enter lesson content" }]}
          >
            <RichTextEditor
              value={lessonForm.getFieldValue("content")}
              onChange={(html) => lessonForm.setFieldValue("content", html)}
              placeholder="Enter lesson content..."
              height={200}
            />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            initialValue="draft"
          >
            <Input size="large" placeholder="draft, published, archived" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button 
                type="primary" 
                htmlType="submit"
              >
                {editingLesson ? "Update Lesson" : "Create Lesson"}
              </Button>
              <Button onClick={() => {
                setLessonModalVisible(false);
                setEditingLesson(null);
                lessonForm.resetFields();
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
