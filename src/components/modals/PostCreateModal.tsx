"use client";

import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Select, Upload, message, Row, Col, Button } from "antd";
import { PlusOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons";
import { useForm } from "@refinedev/antd";
import { useNotification } from "@refinedev/core";
import { useSelect } from "@refinedev/antd";
import { ICategory } from "@domain/models/category";
import { ITag } from "@domain/models/tag";
import { useUpload, getImageUrlString } from "@hooks/shared/upload.hook";
import RichTextEditor from "@components/shared/rich-text-editor";

interface PostCreateModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

export default function PostCreateModal({ visible, onCancel, onSuccess }: PostCreateModalProps) {
  const [form] = Form.useForm();
  const { open } = useNotification();
  const { formProps, saveButtonProps } = useForm({
    resource: "posts",
    action: "create",
    redirect: false, // Prevent automatic redirect
  });

  const handleSubmit = async (values: any) => {
    try {
      // Format the data before submission
      const formattedValues = {
        ...values,
        // Ensure imageUrl is a string (not a file object)
        imageUrl: getImageUrlString(fileList) || values.imageUrl || "",
        // Ensure tags is an array of strings (IDs from the select)
        tags: Array.isArray(values.tags) ? values.tags : [],
        // Map excerpt to description if needed
        description: values.excerpt || values.description || "",
      };

      // Use the form submission logic from Refine
      await formProps.onFinish?.(formattedValues);
      
      // Show success notification
      open?.({
        type: "success",
        message: "Success",
        description: "Post created successfully!",
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
        description: "Failed to create post: " + error.message,
      });
      
      // Don't close modal on error - let user fix the issues
    }
  };

  const { queryResult: categoryData, selectProps } = useSelect<ICategory>({
    resource: "categories",
  });

  const { queryResult: tagData } = useSelect<ITag>({
    resource: "tags",
  });

  const categories = categoryData?.data?.data || [];
  const tags = tagData?.data?.data || [];

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
          Create New Post
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
        <Form.Item
          name="title"
          label="Post Title"
          rules={[{ required: true, message: "Please enter post title" }]}
        >
          <Input size="large" />
        </Form.Item>

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
              initialValue="DRAFT"
              rules={[{ required: true, message: "Please select a status" }]}
            >
              <Select size="large">
                <Select.Option value="DRAFT">Draft</Select.Option>
                <Select.Option value="PUBLISHED">Published</Select.Option>
                <Select.Option value="REJECTED">Rejected</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="excerpt"
          label="Excerpt"
          rules={[{ required: true, message: "Please enter post excerpt" }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item
          name="content"
          label="Content"
          rules={[{ required: true, message: "Please enter post content" }]}
        >
          <RichTextEditor
            value={form.getFieldValue("content")}
            onChange={(html) => form.setFieldValue("content", html)}
            placeholder="Enter post content..."
            height={300}
          />
        </Form.Item>

        <Form.Item
          name="tags"
          label="Tags"
          rules={[{ required: true, message: "Please select at least one tag" }]}
        >
          <Select
            mode="tags"
            placeholder="Select tags"
            size="large"
            options={
              tags && Array.isArray(tags)
                ? tags.map((tag: any) => ({
                    label: tag.name,
                    value: tag.id,
                  }))
                : []
            }
          />
        </Form.Item>

        <Form.Item
          name="imageUrl"
          label="Featured Image"
          rules={[
            { required: true, message: "Please upload a featured image" },
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
          <Upload
            listType="picture-card"
            beforeUpload={beforeUpload}
            onChange={handleUploadChange}
            action="/api/uploads"
            maxCount={1}
            showUploadList={{ showPreviewIcon: true }}
            onRemove={handleRemove}
            fileList={Array.isArray(fileList) ? fileList : []}
          >
            {fileList.length < 1 && (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
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
              {saveButtonProps?.loading ? 'Creating...' : 'Create Post'}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
}
