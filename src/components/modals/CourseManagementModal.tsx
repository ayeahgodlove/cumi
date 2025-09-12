"use client";

import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Upload,
  message,
  Row,
  Col,
  InputNumber,
  Switch,
  Button,
  Space,
  Table,
  Tag,
  Card,
  Typography,
  Divider,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { useForm } from "@refinedev/antd";
import { useSelect } from "@refinedev/antd";
import { ICategory } from "@domain/models/category";
import { ICourse } from "@domain/models/course";
import { useUpload, getImageUrlString } from "@hooks/shared/upload.hook";
import RichTextEditor from "@components/shared/rich-text-editor";

const { Title, Text } = Typography;

interface CourseManagementModalProps {
  visible: boolean;
  onCancel: () => void;
  courseId?: string;
  courseTitle?: string;
}

interface ModuleFormData {
  title: string;
  description: string;
  content: string;
  order: number;
  duration: number;
  isPublished: boolean;
  courseId: string;
}

export default function CourseManagementModal({ 
  visible, 
  onCancel, 
  courseId, 
  courseTitle 
}: CourseManagementModalProps) {
  const [form] = Form.useForm();
  const [moduleForm] = Form.useForm();
  const [activeTab, setActiveTab] = useState("modules");
  const [editingModule, setEditingModule] = useState<any>(null);

  // Course form mutation
  const { mutate: updateCourse, isLoading: updatingCourse } = useForm({
    resource: "courses",
    action: "edit",
    id: courseId,
    onSuccess: () => {
      message.success("Course updated successfully!");
    },
    onError: (error) => {
      message.error("Failed to update course: " + error.message);
    },
  });

  // Module form mutation
  const { mutate: createModule, isLoading: creatingModule } = useForm({
    resource: "modules",
    action: "create",
    onSuccess: () => {
      message.success("Module created successfully!");
      moduleForm.resetFields();
      setEditingModule(null);
      // Refetch modules would go here
    },
    onError: (error) => {
      message.error("Failed to create module: " + error.message);
    },
  });

  const { mutate: updateModule, isLoading: updatingModule } = useForm({
    resource: "modules",
    action: "edit",
    onSuccess: () => {
      message.success("Module updated successfully!");
      moduleForm.resetFields();
      setEditingModule(null);
      // Refetch modules would go here
    },
    onError: (error) => {
      message.error("Failed to update module: " + error.message);
    },
  });

  const { mutate: deleteModule, isLoading: deletingModule } = useForm({
    resource: "modules",
    action: "delete",
    onSuccess: () => {
      message.success("Module deleted successfully!");
      // Refetch modules would go here
    },
    onError: (error) => {
      message.error("Failed to delete module: " + error.message);
    },
  });

  // Mock modules data - in real implementation, this would come from API
  const [modules, setModules] = useState([
    {
      id: "1",
      title: "Introduction to Web Development",
      description: "Learn the basics of web development",
      order: 1,
      duration: 120,
      isPublished: true,
      courseId: courseId,
    },
    {
      id: "2",
      title: "HTML Fundamentals",
      description: "Master HTML structure and elements",
      order: 2,
      duration: 90,
      isPublished: true,
      courseId: courseId,
    },
    {
      id: "3",
      title: "CSS Styling",
      description: "Learn CSS for beautiful designs",
      order: 3,
      duration: 150,
      isPublished: false,
      courseId: courseId,
    },
  ]);

  const handleCourseUpdate = (values: any) => {
    updateCourse({
      values: {
        ...values,
        id: courseId,
      },
    });
  };

  const handleModuleSubmit = (values: ModuleFormData) => {
    if (editingModule) {
      updateModule({
        values: {
          ...values,
          id: editingModule.id,
          courseId: courseId,
        },
      });
    } else {
      createModule({
        values: {
          ...values,
          courseId: courseId,
        },
      });
    }
  };

  const handleEditModule = (module: any) => {
    setEditingModule(module);
    moduleForm.setFieldsValue(module);
    setActiveTab("modules");
  };

  const handleDeleteModule = (moduleId: string) => {
    Modal.confirm({
      title: "Are you sure you want to delete this module?",
      content: "This action cannot be undone.",
      onOk: () => {
        deleteModule({
          id: moduleId,
        });
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
      width: 150,
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
            icon={<DeleteOutlined />} 
            size="small" 
            danger
            onClick={() => handleDeleteModule(record.id)}
          />
        </Space>
      ),
    },
  ];

  const handleCancel = () => {
    form.resetFields();
    moduleForm.resetFields();
    setEditingModule(null);
    setActiveTab("modules");
    onCancel();
  };

  return (
    <Modal
      title={`Manage Course: ${courseTitle || 'Untitled'}`}
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={1000}
      destroyOnClose
    >
      <div style={{ marginBottom: 16 }}>
        <Button.Group>
          <Button 
            type={activeTab === "course" ? "primary" : "default"}
            onClick={() => setActiveTab("course")}
          >
            Course Details
          </Button>
          <Button 
            type={activeTab === "modules" ? "primary" : "default"}
            onClick={() => setActiveTab("modules")}
          >
            Modules ({modules.length})
          </Button>
        </Button.Group>
      </div>

      {activeTab === "course" && (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCourseUpdate}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                name="title"
                label="Course Title"
                rules={[{ required: true, message: "Please enter course title" }]}
              >
                <Input size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="status"
                label="Status"
                initialValue="draft"
              >
                <Select size="large">
                  <Select.Option value="draft">Draft</Select.Option>
                  <Select.Option value="published">Published</Select.Option>
                  <Select.Option value="archived">Archived</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter course description" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={updatingCourse}>
                Update Course
              </Button>
              <Button onClick={handleCancel}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      )}

      {activeTab === "modules" && (
        <div>
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={4}>
              {editingModule ? `Edit Module: ${editingModule.title}` : "Add New Module"}
            </Title>
            {editingModule && (
              <Button onClick={() => {
                setEditingModule(null);
                moduleForm.resetFields();
              }}>
                Cancel Edit
              </Button>
            )}
          </div>

          <Card style={{ marginBottom: 16 }}>
            <Form
              form={moduleForm}
              layout="vertical"
              onFinish={handleModuleSubmit}
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="title"
                    label="Module Title"
                    rules={[{ required: true, message: "Please enter module title" }]}
                  >
                    <Input size="large" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={6}>
                  <Form.Item
                    name="order"
                    label="Order"
                    rules={[{ required: true, message: "Please enter module order" }]}
                  >
                    <InputNumber min={1} style={{ width: '100%' }} size="large" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={6}>
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
                name="description"
                label="Description"
                rules={[{ required: true, message: "Please enter module description" }]}
              >
                <Input.TextArea rows={3} />
              </Form.Item>

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
                    loading={creatingModule || updatingModule}
                  >
                    {editingModule ? "Update Module" : "Create Module"}
                  </Button>
                  <Button onClick={() => {
                    moduleForm.resetFields();
                    setEditingModule(null);
                  }}>
                    Reset
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>

          <Divider />

          <div style={{ marginBottom: 16 }}>
            <Title level={4}>Course Modules</Title>
            <Text type="secondary">
              Manage the modules in this course. Drag to reorder or click edit to modify.
            </Text>
          </div>

          <Table
            dataSource={modules}
            columns={moduleColumns}
            rowKey="id"
            pagination={false}
            size="small"
          />
        </div>
      )}
    </Modal>
  );
}
