"use client";

import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Select, Upload, message, Row, Col, DatePicker, InputNumber, Button } from "antd";
import { PlusOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons";
import { useForm } from "@refinedev/antd";
import { useNotification } from "@refinedev/core";
import { useSelect } from "@refinedev/antd";
import { ITag } from "@domain/models/tag";
import { useUpload, getImageUrlString } from "@hooks/shared/upload.hook";
import RichTextEditor from "@components/shared/rich-text-editor";

interface EventCreateModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

export default function EventCreateModal({ visible, onCancel, onSuccess }: EventCreateModalProps) {
  const [form] = Form.useForm();
  const { open } = useNotification();
  const { formProps, saveButtonProps } = useForm({
    resource: "events",
    action: "create",
    redirect: false, // Prevent automatic redirect
  });

  const handleSubmit = async (values: any) => {
    try {
      // Format the data before submission
      const formattedValues = {
        ...values,
        // Convert eventDate to ISO string
        eventDate: values.eventDate ? values.eventDate.toISOString() : new Date().toISOString(),
        // Ensure imageUrl is a string (not a file object)
        imageUrl: getImageUrlString(fileList) || values.imageUrl || "",
        // Ensure tags is an array of strings (IDs from the select)
        tags: Array.isArray(values.tags) ? values.tags : [],
        // Ensure content is included
        content: values.content || values.description || "",
      };

      // Use the form submission logic from Refine
      await formProps.onFinish?.(formattedValues);
      
      // Show success notification
      open?.({
        type: "success",
        message: "Success",
        description: "Event created successfully!",
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
        description: "Failed to create event: " + error.message,
      });
      
      // Don't close modal on error - let user fix the issues
    }
  };

  const { queryResult: tagData } = useSelect<ITag>({
    resource: "tags",
  });

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
          Create New Event
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
          label="Event Title"
          rules={[{ required: true, message: "Please enter event title" }]}
        >
          <Input size="large" />
        </Form.Item>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true, message: "Please select a category" }]}
            >
              <Select
                placeholder="Select category"
                size="large"
              >
                <Select.Option value="workshop">Workshop</Select.Option>
                <Select.Option value="seminar">Seminar</Select.Option>
                <Select.Option value="conference">Conference</Select.Option>
                <Select.Option value="training">Training</Select.Option>
                <Select.Option value="meeting">Meeting</Select.Option>
                <Select.Option value="social">Social</Select.Option>
                <Select.Option value="religious">Religious</Select.Option>
                <Select.Option value="cultural">Cultural</Select.Option>
                <Select.Option value="sports">Sports</Select.Option>
                <Select.Option value="business">Business</Select.Option>
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
                <Select.Option value="cancelled">Cancelled</Select.Option>
                <Select.Option value="completed">Completed</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="eventDate"
              label="Event Date"
              rules={[{ required: true, message: "Please select event date" }]}
            >
              <DatePicker
                showTime
                style={{ width: '100%' }}
                size="large"
                format="YYYY-MM-DD HH:mm"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="location"
              label="Location"
              rules={[{ required: true, message: "Please enter event location" }]}
            >
              <Input size="large" placeholder="Event location" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="maxAttendees"
              label="Maximum Attendees"
            >
              <InputNumber
                min={1}
                style={{ width: '100%' }}
                size="large"
                placeholder="Unlimited"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="registrationFee"
              label="Registration Fee"
            >
              <InputNumber
                min={0}
                style={{ width: '100%' }}
                size="large"
                placeholder="0"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please enter event description" }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item
          name="content"
          label="Event Details"
          rules={[{ required: true, message: "Please enter event details" }]}
        >
          <RichTextEditor
            value={form.getFieldValue("content")}
            onChange={(html) => form.setFieldValue("content", html)}
            placeholder="Enter event details..."
            height={300}
          />
        </Form.Item>

        <Form.Item
          name="tags"
          label="Tags"
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
          label="Event Image"
          rules={[
            { required: true, message: "Please upload an event image" },
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
            <p className="ant-upload-text">Drag & drop an event image here</p>
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
              {saveButtonProps?.loading ? 'Creating...' : 'Create Event'}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
}
