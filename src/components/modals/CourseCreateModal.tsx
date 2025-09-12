"use client";

import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Select, Upload, message, InputNumber, Switch, DatePicker, Row, Col, Button, Space } from "antd";
import { PlusOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons";
import { useForm } from "@refinedev/antd";
import { useNotification } from "@refinedev/core";
import { useSelect } from "@refinedev/antd";
import { ICategory } from "@domain/models/category";
import { ITag } from "@domain/models/tag";
import { useUpload, getImageUrlString } from "@hooks/shared/upload.hook";
import RichTextEditor from "@components/shared/rich-text-editor";
import PhoneNumberInput from "@components/shared/phone-number-input.component";

interface CourseCreateModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  editingCourse?: any; // Course data for editing
}

export default function CourseCreateModal({ visible, onCancel, onSuccess, editingCourse }: CourseCreateModalProps) {
  const [form] = Form.useForm();
  const { open } = useNotification();
  const { formProps, saveButtonProps } = useForm({
    resource: "courses",
    action: editingCourse ? "edit" : "create",
    id: editingCourse?.id,
    redirect: false, // Prevent automatic redirect
  });

  const handleSubmit = async (values: any) => {
    try {
      // Format the data before submission
      const formattedValues = {
        ...values,
        // Ensure imageUrl is a string (not a file object)
        imageUrl: getImageUrlString(fileList) || values.imageUrl || "",
        // Ensure authorName is provided (required field)
        authorName: values.authorName || "Unknown Author",
      };

      // Use the form submission logic from Refine
      await formProps.onFinish?.(formattedValues);
      
      // Show success notification
      open?.({
        type: "success",
        message: "Success",
        description: editingCourse ? "Course updated successfully!" : "Course created successfully!",
      });
      
      // Reset form and close modal
      form.resetFields();
      setFileList([]);
      onSuccess();
      onCancel();
    } catch (error: any) {
      // Show error notification
      open?.({
        type: "error",
        message: "Error",
        description: "Failed to create course: " + error.message,
      });
      
      // Don't close modal on error - let user fix the issues
    }
  };

  const { queryResult: categoryData, selectProps } = useSelect<ICategory>({
    resource: "categories",
  });

  const categories = categoryData?.data?.data || [];

  const { fileList, setFileList, handleUploadChange, beforeUpload, handleRemove } = useUpload({
    maxSize: 1024 * 1024, // 1MB
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
    form: form,
    fieldName: 'imageUrl',
    onSuccess: (response) => {
      // This will be handled in useEffect to prevent setState in render
    },
    onError: (error) => {
      message.error(error);
    }
  });

  // Handle form field updates in useEffect to prevent setState in render
  useEffect(() => {
    if (fileList && fileList.length > 0) {
      const imageUrl = getImageUrlString(fileList);
      if (imageUrl) {
        form.setFieldsValue({
          imageUrl: imageUrl
        });
      }
    }
  }, [fileList, form]);

  // Preload form when editing
  useEffect(() => {
    if (editingCourse && visible) {
      form.setFieldsValue({
        title: editingCourse.title,
        description: editingCourse.description,
        price: editingCourse.price,
        isFree: editingCourse.isFree,
        currency: editingCourse.currency,
        level: editingCourse.level,
        language: editingCourse.language,
        status: editingCourse.status,
        categoryId: editingCourse.categoryId,
        authorName: editingCourse.authorName,
        durationWeeks: editingCourse.durationWeeks,
        maxStudents: editingCourse.maxStudents,
        targetAudience: editingCourse.targetAudience,
        prerequisites: editingCourse.prerequisites,
        objectives: editingCourse.objectives,
        keywords: editingCourse.keywords,
        imageUrl: editingCourse.imageUrl,
      });
      
      // Set file list if there's an existing image
      if (editingCourse.imageUrl) {
        setFileList([{
          uid: '-1',
          name: 'existing-image',
          status: 'done',
          url: editingCourse.imageUrl,
        }]);
      }
    } else if (!editingCourse && visible) {
      // Reset form for new course
      form.resetFields();
      setFileList([]);
    }
  }, [editingCourse, visible, form, setFileList]);

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    onCancel();
  };

  return (
    <Modal
      title={
        <div style={{ 
          fontSize: "20px", 
          fontWeight: "600", 
          color: "#1f2937",
          textAlign: "center",
          padding: "16px 0"
        }}>
          {editingCourse ? `Edit Course: ${editingCourse.title}` : "Create New Course"}
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={800}
      destroyOnClose
      style={{
        backgroundColor: "white"
      }}
      styles={{
        body: {
          backgroundColor: "white",
          padding: "24px"
        },
        header: {
          backgroundColor: "white",
          borderBottom: "1px solid #e5e7eb"
        }
      }}
    >
      <Form
        {...formProps}
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
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
              name="authorName"
              label="Author Name"
              rules={[{ required: true, message: "Please enter author name" }]}
            >
              <Input size="large" placeholder="Course author" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="categoryId"
              label="Category"
              rules={[{ required: true, message: "Please select a category" }]}
            >
              <Select
                placeholder="Select category"
                size="large"
              >
                {categories && Array.isArray(categories) && categories.map((category: any) => (
                  <Select.Option key={category.id} value={category.id}>
                    {category.name}
                  </Select.Option>
                ))}
              </Select>
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

        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Form.Item
              name="price"
              label="Price"
              rules={[{ required: true, message: "Please enter price" }]}
            >
              <InputNumber
                min={0}
                style={{ width: '100%' }}
                size="large"
                placeholder="0"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              name="currency"
              label="Currency"
              initialValue="XAF"
            >
              <Select size="large">
                <Select.Option value="XAF">XAF</Select.Option>
                <Select.Option value="USD">USD</Select.Option>
                <Select.Option value="EUR">EUR</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              name="isFree"
              label="Free Course"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="level"
              label="Difficulty Level"
              rules={[{ required: true, message: "Please select difficulty level" }]}
            >
              <Select size="large" placeholder="Select level">
                <Select.Option value="beginner">Beginner</Select.Option>
                <Select.Option value="intermediate">Intermediate</Select.Option>
                <Select.Option value="advanced">Advanced</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="language"
              label="Language"
              initialValue="both"
            >
              <Select size="large">
                <Select.Option value="french">French</Select.Option>
                <Select.Option value="english">English</Select.Option>
                <Select.Option value="both">Both</Select.Option>
                <Select.Option value="fulfulde">Fulfulde</Select.Option>
                <Select.Option value="ewondo">Ewondo</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="imageUrl"
          label="Course Image"
          rules={[
            { required: true, message: "Please upload a course image" },
            {
              validator: (_, value) => {
                // Check if we have a valid URL string
                if (typeof value === 'string' && value.trim() !== '') {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Please upload an image'));
              }
            }
          ]}
        >
          <Upload.Dragger
            name="file"
            action="/api/uploads"
            listType="picture"
            maxCount={1}
            multiple={false}
            fileList={Array.isArray(fileList) ? fileList : []}
            onChange={handleUploadChange}
            beforeUpload={beforeUpload}
            onRemove={handleRemove}
          >
            <p className="ant-upload-text">Drag & drop a course image here</p>
            <p className="ant-upload-hint">
              Support for single upload. Maximum file size: 1MB
            </p>
          </Upload.Dragger>
        </Form.Item>

        <Form.Item>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            gap: '12px',
            paddingTop: '24px',
            borderTop: '1px solid #e5e7eb'
          }}>
            <Button
              size="large"
              icon={<CloseOutlined />}
              onClick={handleCancel}
              style={{
                borderRadius: "8px",
                border: "2px solid #e5e7eb",
                color: "#6b7280",
                fontWeight: "500",
                padding: "8px 24px",
                height: "auto"
              }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              icon={<SaveOutlined />}
              loading={saveButtonProps?.loading}
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
              {saveButtonProps?.loading ? 'Creating...' : 'Create Course'}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
}
