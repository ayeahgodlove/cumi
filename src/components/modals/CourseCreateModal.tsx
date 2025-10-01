"use client";

import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Select, Upload, message, InputNumber, Switch, DatePicker, Row, Col, Button, Space, Card } from "antd";
import { PlusOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons";
import { useForm } from "@refinedev/antd";
import { useNotification } from "@refinedev/core";
import { useSelect } from "@refinedev/antd";
import { ICategory } from "@domain/models/category";
import { ITag } from "@domain/models/tag";
import { useUpload, getImageUrlString } from "@hooks/shared/upload.hook";
import RichTextEditor from "@components/shared/rich-text-editor";
import PhoneNumberInput from "@components/shared/phone-number-input.component";
import { useTranslation } from "@contexts/translation.context";

interface CourseCreateModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  editingCourse?: any; // Course data for editing
}

export default function CourseCreateModal({ visible, onCancel, onSuccess, editingCourse }: CourseCreateModalProps) {
  const [form] = Form.useForm();
  const { open } = useNotification();
  const { t } = useTranslation();
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
        message: t('common.success'),
        description: editingCourse ? t('creator.course_updated_success') : t('creator.course_created_success'),
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
        description: t('forms.course_create_failed', { message: error.message }),
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
          {editingCourse ? `${t('forms.edit_course')}: ${editingCourse.title}` : t('forms.create_new_course')}
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
      <Card style={{ backgroundColor: 'white', border: 'none' }}>
        <Form
          {...formProps}
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          size="large"
        >
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="title"
              label={t('forms.course_title')}
              rules={[{ required: true, message: t('forms.please_enter', { field: t('forms.course_title').toLowerCase() }) }]}
            >
              <Input size="large" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="authorName"
              label={t('forms.author_name')}
              rules={[{ required: true, message: t('forms.please_enter', { field: t('forms.author_name').toLowerCase() }) }]}
            >
              <Input size="large" placeholder={t('forms.course_author')} />
            </Form.Item>
          </Col>
        </Row>

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
              initialValue="draft"
            >
              <Select size="large">
                <Select.Option value="draft">{t('common.draft')}</Select.Option>
                <Select.Option value="published">{t('common.published')}</Select.Option>
                <Select.Option value="archived">{t('common.archived')}</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="description"
          label={t('common.description')}
          rules={[{ required: true, message: t('forms.please_enter', { field: t('common.description').toLowerCase() }) }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Form.Item
              name="price"
              label={t('common.price')}
              rules={[{ required: true, message: t('forms.please_enter', { field: t('common.price').toLowerCase() }) }]}
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
              label={t('forms.currency')}
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
              label={t('forms.free_course')}
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
              label={t('forms.difficulty_level')}
              rules={[{ required: true, message: t('forms.please_select', { field: t('forms.difficulty_level').toLowerCase() }) }]}
            >
              <Select size="large" placeholder={t('forms.select_level')}>
                <Select.Option value="beginner">{t('forms.beginner')}</Select.Option>
                <Select.Option value="intermediate">{t('forms.intermediate')}</Select.Option>
                <Select.Option value="advanced">{t('forms.advanced')}</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="language"
              label={t('common.language')}
              initialValue="both"
            >
              <Select size="large">
                <Select.Option value="french">{t('forms.french')}</Select.Option>
                <Select.Option value="english">{t('forms.english')}</Select.Option>
                <Select.Option value="both">{t('forms.both')}</Select.Option>
                <Select.Option value="fulfulde">{t('forms.fulfulde')}</Select.Option>
                <Select.Option value="ewondo">{t('forms.ewondo')}</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="imageUrl"
          label={t('forms.course_image')}
          rules={[
            { required: true, message: t('forms.please_upload', { field: t('forms.course_image').toLowerCase() }) },
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
            <p className="ant-upload-text">{t('forms.drag_drop_course_image')}</p>
            <p className="ant-upload-hint">
              {t('forms.upload_hint')}
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
              {saveButtonProps?.loading ? t('forms.creating') : t('forms.create_course')}
            </Button>
          </div>
        </Form.Item>
        </Form>
      </Card>
    </Modal>
  );
}
