"use client";

import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Row, Col, message, Upload } from "antd";
import { useUpload, getImageUrlFromEvent } from "@hooks/shared/upload.hook";
import { useState, useEffect } from "react";

export default function PartnerEdit() {
  const { formProps, saveButtonProps, queryResult } = useForm();
  const [initialImageUrl, setInitialImageUrl] = useState<string>("");

  const { fileList, setFileList, handleUploadChange, beforeUpload, handleRemove } = useUpload({
    maxSize: 1024 * 1024, // 1MB
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
    form: formProps.form,
    fieldName: 'logo',
    onSuccess: (response) => {
      formProps.form?.setFieldsValue({
        logo: response.url
      });
    },
    onError: (error) => {
      message.error(error);
    }
  });

  const handleRemoveWithCleanup = async (file: any) => {
    if (file.url === initialImageUrl && initialImageUrl) {
      try {
        const filename = initialImageUrl.split('/').pop();
        if (filename) {
          await fetch(`/api/uploads/${filename}`, { method: 'DELETE' });
        }
        message.success('File deleted successfully');
      } catch (error) {
        console.error('Error deleting file:', error);
        message.warning('File removed from form but may still exist on server');
      }
    }
    return await handleRemove(file);
  };

  useEffect(() => {
    if (queryResult?.data?.data) {
      const partnerData = queryResult.data.data;
      setInitialImageUrl(partnerData.logo || "");
      
      // Set initial file list if there's an existing image
      if (partnerData.logo) {
        setFileList([{
          uid: '-1',
          name: 'existing-image',
          status: 'done',
          url: partnerData.logo,
          response: { url: partnerData.logo }
        }]);
      }
    }
  }, [queryResult?.data?.data, setFileList]);

  return (
    <>
      <PageBreadCrumbs items={["Partners", "Edit"]} />
      <Edit saveButtonProps={saveButtonProps}>
        <Form {...formProps} layout="vertical" form={formProps.form}>
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
              onRemove={handleRemoveWithCleanup}
            >
              <p className="ant-upload-text">Drag & drop a partner logo here</p>
              <p className="ant-upload-hint">
                Support for single upload. Maximum file size: 1MB
              </p>
            </Upload.Dragger>
          </Form.Item>
        </Form>
      </Edit>
    </>
  );
}
