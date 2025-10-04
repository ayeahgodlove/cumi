"use client";
import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Select, message, Row, Col, DatePicker, InputNumber, Button } from "antd";
import { SaveOutlined, CloseOutlined } from "@ant-design/icons";
import { useForm } from "@refinedev/antd";
import { useNotification } from "@refinedev/core";
import { useSelect } from "@refinedev/antd";
import { ITag } from "@domain/models/tag";
import ImageUploadField from "@components/shared/image-upload-field.component";
import RichTextEditor from "@components/shared/rich-text-editor";
import { useTranslation } from "@contexts/translation.context";
import dayjs from "dayjs";

interface EventCreateModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  editingEvent?: any;
}

export default function EventCreateModal({ visible, onCancel, onSuccess, editingEvent }: EventCreateModalProps) {
  const [form] = Form.useForm();
  const { open } = useNotification();
  const { t } = useTranslation();
  const { formProps, saveButtonProps } = useForm({
    resource: "events",
    action: editingEvent ? "edit" : "create",
    id: editingEvent?.id,
    redirect: false, // Prevent automatic redirect
  });

const handleSubmit = async (values: any) => {
    try {
      // Format the data before submission
      const formattedValues = {
        ...values,
        // Convert eventDate to ISO string
        eventDate: values.eventDate ? values.eventDate.toISOString() : new Date().toISOString(),
        // Ensure imageUrl is a string from the ImageUploadField
        imageUrl: values.imageUrl || "",
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
        message: t('common.success'),
        description: editingEvent ? t('creator.event_updated_success') : t('creator.event_created_success'),
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
        description: t('forms.event_create_failed', { message: error.message }),
      });

// Don't close modal on error - let user fix the issues
    }
  };

const { queryResult: tagData } = useSelect<ITag>({
    resource: "tags",
  });

const tags = tagData?.data?.data || [];

// Preload form when editing
  useEffect(() => {
    if (editingEvent && visible) {
      // Parse the eventDate safely
      let parsedEventDate = null;
      if (editingEvent.eventDate) {
        try {
          parsedEventDate = dayjs(editingEvent.eventDate);
          // Verify it's valid
          if (!parsedEventDate.isValid()) {
            parsedEventDate = null;
          }
        } catch (e) {
          console.error('Error parsing event date:', e);
          parsedEventDate = null;
        }
      }

form.setFieldsValue({
        title: editingEvent.title,
        category: editingEvent.category,
        status: editingEvent.status,
        eventDate: parsedEventDate,
        location: editingEvent.location,
        maxAttendees: editingEvent.maxAttendees,
        registrationFee: editingEvent.registrationFee || editingEvent.entryFee,
        description: editingEvent.description,
        content: editingEvent.content,
        tags: editingEvent.tags || [],
        imageUrl: editingEvent.imageUrl,
      });
    } else if (!editingEvent && visible) {
      // Reset form for new event
      form.resetFields();
    }
  }, [editingEvent, visible, form]);

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
          {editingEvent ? `${t('forms.edit_event')}: ${editingEvent.title}` : t('forms.create_new_event')}
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width="95%"
      style={{ maxWidth: '900px', top: 20 }}
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
      <Form
        {...formProps}
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="title"
          label={t('forms.event_title')}
          rules={[{ required: true, message: t('forms.please_enter', { field: t('forms.event_title').toLowerCase() }) }]}
        >
          <Input size="large" />
        </Form.Item>

<Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="category"
              label={t('common.category')}
              rules={[{ required: true, message: t('forms.please_select', { field: t('common.category').toLowerCase() }) }]}
            >
              <Select
                placeholder={t('forms.select_category')}
                size="large"
              >
                <Select.Option value="workshop">{t('forms.workshop')}</Select.Option>
                <Select.Option value="seminar">{t('forms.seminar')}</Select.Option>
                <Select.Option value="conference">{t('forms.conference')}</Select.Option>
                <Select.Option value="training">{t('forms.training')}</Select.Option>
                <Select.Option value="meeting">{t('forms.meeting')}</Select.Option>
                <Select.Option value="social">{t('forms.social')}</Select.Option>
                <Select.Option value="religious">{t('forms.religious')}</Select.Option>
                <Select.Option value="cultural">{t('forms.cultural')}</Select.Option>
                <Select.Option value="sports">{t('forms.sports')}</Select.Option>
                <Select.Option value="business">{t('forms.business')}</Select.Option>
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
                <Select.Option value="cancelled">{t('common.cancelled')}</Select.Option>
                <Select.Option value="completed">{t('common.completed')}</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

<Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="eventDate"
              label={t('forms.event_date')}
              rules={[{ required: true, message: t('forms.please_select', { field: t('forms.event_date').toLowerCase() }) }]}
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
              label={t('creator.location')}
              rules={[{ required: true, message: t('forms.please_enter', { field: t('creator.location').toLowerCase() }) }]}
            >
              <Input size="large" placeholder={t('forms.event_location')} />
            </Form.Item>
          </Col>
        </Row>

<Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="maxAttendees"
              label={t('forms.max_attendees')}
            >
              <InputNumber
                min={1}
                style={{ width: '100%' }}
                size="large"
                placeholder={t('creator.unlimited')}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="registrationFee"
              label={t('forms.registration_fee')}
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
          label={t('common.description')}
          rules={[{ required: true, message: t('forms.please_enter', { field: t('common.description').toLowerCase() }) }]}
        >
          <Input.TextArea size="large" rows={4} />
        </Form.Item>

<Form.Item
          name="content"
          label={t('forms.event_details')}
          rules={[{ required: true, message: t('forms.please_enter', { field: t('forms.event_details').toLowerCase() }) }]}
        >
          <RichTextEditor
            value={form.getFieldValue("content")}
            onChange={(html) => form.setFieldValue("content", html)}
            placeholder={t('forms.enter_event_details')}
            height={300}
          />
        </Form.Item>

<Form.Item
          name="tags"
          label={t('forms.tags')}
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

<ImageUploadField
          name="imageUrl"
          label={t('forms.event_image')}
          required={true}
          form={form}
          maxSize={5 * 1024 * 1024}
          dragger={true}
          draggerText={t('forms.drag_drop_event_image')}
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
              {saveButtonProps?.loading ? t('forms.saving') : (editingEvent ? t('forms.update_event') : t('forms.create_event'))}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
}
