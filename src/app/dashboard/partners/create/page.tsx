"use client";

import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Row, Col, message, Upload } from "antd";
import { useUpload, getImageUrlFromEvent, getImageUrlString } from "@hooks/shared/upload.hook";
import { useEffect } from "react";

export default function PartnerCreate() {
  const { formProps, saveButtonProps } = useForm();

  const { fileList, setFileList, handleUploadChange, beforeUpload, handleRemove } = useUpload({
    maxSize: 1024 * 1024, // 1MB
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
    form: formProps.form,
    fieldName: 'logo',
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
        formProps.form?.setFieldsValue({
          logo: imageUrl
        });
      }
    }
  }, [fileList, formProps.form]);

  return (
    <>
      <PageBreadCrumbs items={["Partners", "Create"]} />
      <Create saveButtonProps={saveButtonProps}>
        <Form {...formProps} layout="vertical">
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: "Please enter partner name" }]}
              >
                <Input placeholder="Enter partner name" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Location"
                name="location"
                rules={[{ required: true, message: "Please enter location" }]}
              >
                <Input placeholder="e.g., Bamenda, Cameroon" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <Input.TextArea 
              rows={4} 
              placeholder="Tell us about this partner..."
            />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Contact Phone"
                name="contactPhone"
                rules={[{ required: true, message: "Please enter contact phone" }]}
              >
                <Input placeholder="+237681289411" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Website Link"
                name="websiteLink"
                rules={[
                  { required: true, message: "Please enter website link" },
                  { type: "url", message: "Please enter a valid URL" }
                ]}
              >
                <Input placeholder="https://partner-website.com" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Logo"
            name="logo"
            required={true}
            rules={[
              { required: true, message: "This field is a required field" },
              {
                validator: (_, value) => {
                  if (typeof value === 'string' && value.trim() !== '') {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Please upload a logo'));
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
              <p className="ant-upload-text">Drag & drop a partner logo here</p>
              <p className="ant-upload-hint">
                Support for single upload. Maximum file size: 1MB
              </p>
            </Upload.Dragger>
          </Form.Item>
        </Form>
      </Create>
    </>
  );
}
