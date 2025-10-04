"use client";
import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Select, message, InputNumber, Switch, DatePicker, Row, Col, Button, Space, Card } from "antd";
import { SaveOutlined, CloseOutlined } from "@ant-design/icons";
import { useForm } from "@refinedev/antd";
import { useNotification } from "@refinedev/core";
import { useSelect } from "@refinedev/antd";
import { ICategory } from "@domain/models/category";
import { ITag } from "@domain/models/tag";
import ImageUploadField from "@components/shared/image-upload-field.component";
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
        // Ensure imageUrl is a string from the ImageUploadField
        imageUrl: values.imageUrl || "",
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
    } else if (!editingCourse && visible) {
      // Reset form for new course
      form.resetFields();
    }
  }, [editingCourse, visible, form]);

const handleCancel = () => {
    form.resetFields();
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
      width="95%"
      style={{ maxWidth: '1200px', top: 20 }}
      destroyOnClose={true}
      maskClosable={true}
      keyboard={true}
      forceRender={false}
      styles={{
        body: {
          backgroundColor: "white",
          padding: "24px",
          maxHeight: 'calc(100vh - 200px)',
          overflowY: 'auto'
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
          <Input.TextArea size="large" rows={4} />
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

<ImageUploadField
          name="imageUrl"
          label={t('forms.course_image')}
          required={true}
          form={form}
          maxSize={5 * 1024 * 1024}
          dragger={true}
          draggerText={t('forms.drag_drop_course_image')}
          draggerHint={t('forms.upload_hint')}
        />

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
