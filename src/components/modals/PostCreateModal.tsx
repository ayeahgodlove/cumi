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
import { useTranslation } from "@contexts/translation.context";

interface PostCreateModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  editingPost?: any;
}

export default function PostCreateModal({ visible, onCancel, onSuccess, editingPost }: PostCreateModalProps) {
  const [form] = Form.useForm();
  const { open } = useNotification();
  const { t } = useTranslation();
  const { formProps, saveButtonProps } = useForm({
    resource: "posts",
    action: editingPost ? "edit" : "create",
    id: editingPost?.id,
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
        message: t('common.success'),
        description: editingPost ? t('creator.post_updated_success') : t('creator.post_created_success'),
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
        message: t('common.error'),
        description: t('forms.post_create_failed', { message: error.message }),
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

  // Preload form when editing
  useEffect(() => {
    if (editingPost && visible) {
      form.setFieldsValue({
        title: editingPost.title,
        categoryId: editingPost.categoryId,
        status: editingPost.status,
        excerpt: editingPost.description,
        content: editingPost.content,
        tags: editingPost.tags || [],
        imageUrl: editingPost.imageUrl,
      });
      
      // Set file list if there's an existing image
      if (editingPost.imageUrl) {
        setFileList([{
          uid: '-1',
          name: 'existing-image',
          status: 'done',
          url: editingPost.imageUrl,
        }]);
      }
    } else if (!editingPost && visible) {
      // Reset form for new post
      form.resetFields();
      setFileList([]);
    }
  }, [editingPost, visible, form, setFileList]);

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
          {editingPost ? `${t('forms.edit_post')}: ${editingPost.title}` : t('forms.create_new_post')}
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
          label={t('forms.post_title')}
          rules={[{ required: true, message: t('forms.please_enter', { field: t('forms.post_title').toLowerCase() }) }]}
        >
          <Input size="large" />
        </Form.Item>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="categoryId"
              label={t('common.category')}
              rules={[{ required: true, message: t('forms.please_select', { field: t('common.category').toLowerCase() }) }]}
            >
              <Select
                placeholder={t('forms.select_category')}
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
              label={t('common.status')}
              initialValue="DRAFT"
              rules={[{ required: true, message: t('forms.please_select', { field: t('common.status').toLowerCase() }) }]}
            >
              <Select size="large">
                <Select.Option value="DRAFT">{t('common.draft')}</Select.Option>
                <Select.Option value="PUBLISHED">{t('common.published')}</Select.Option>
                <Select.Option value="REJECTED">{t('forms.rejected')}</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="excerpt"
          label={t('forms.excerpt')}
          rules={[{ required: true, message: t('forms.please_enter', { field: t('forms.excerpt').toLowerCase() }) }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item
          name="content"
          label={t('common.content')}
          rules={[{ required: true, message: t('forms.please_enter', { field: t('common.content').toLowerCase() }) }]}
        >
          <RichTextEditor
            value={form.getFieldValue("content")}
            onChange={(html) => form.setFieldValue("content", html)}
            placeholder={t('forms.enter_post_content')}
            height={300}
          />
        </Form.Item>

        <Form.Item
          name="tags"
          label={t('forms.tags')}
          rules={[{ required: true, message: t('forms.select_at_least_one_tag') }]}
        >
          <Select
            mode="tags"
            placeholder={t('forms.select_tags')}
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
          label={t('forms.featured_image')}
          rules={[
            { required: true, message: t('forms.please_upload', { field: t('forms.featured_image').toLowerCase() }) },
            {
              validator: (_, value) => {
                // Check if we have a valid URL string
                if (typeof value === 'string' && value.trim() !== '') {
                  return Promise.resolve();
                }
                return Promise.reject(new Error(t('forms.please_upload', { field: 'image' })));
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
                <div style={{ marginTop: 8 }}>{t('forms.upload')}</div>
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
              {t('common.cancel')}
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
              {saveButtonProps?.loading ? t('forms.saving') : (editingPost ? t('forms.update_post') : t('forms.create_post'))}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
}
