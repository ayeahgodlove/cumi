"use client";

import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Switch, Upload, Button, Space, Avatar, Row, Col, InputNumber, message } from "antd";
import { UploadOutlined, UserOutlined } from "@ant-design/icons";
import { BASE_URL_UPLOADS_MEDIA } from "@constants/api-url";
import { useUpload, deleteUploadedFile, getImageUrlFromEvent } from "@hooks/shared/upload.hook";
import { useEffect, useState } from "react";

export default function ProfessionalEdit() {
  const { formProps, saveButtonProps, queryResult } = useForm({});
  const [initialImageUrl, setInitialImageUrl] = useState<string>("");

  const { fileList, setFileList, handleUploadChange, beforeUpload, handleRemove } = useUpload({
    maxSize: 1024 * 1024, // 1MB
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
    form: formProps.form,
    fieldName: 'profileImage',
    onSuccess: (response) => {
      formProps.form?.setFieldsValue({
        profileImage: response.url
      });
    },
    onError: (error) => {
      message.error(error);
    }
  });

  // Set initial file list when data loads
  useEffect(() => {
    if (queryResult?.data?.data?.profileImage) {
      const imageUrl = queryResult.data.data.profileImage;
      setInitialImageUrl(imageUrl);
      
      // Create file list item for existing image
      const existingFile = {
        uid: '-1',
        name: imageUrl.split('/').pop() || 'image',
        status: 'done',
        url: imageUrl,
        response: { url: imageUrl }
      };
      setFileList([existingFile]);
    }
  }, [queryResult?.data?.data?.profileImage, setFileList]);

  const handleRemoveWithCleanup = async (file: any) => {
    // If removing existing file, delete it from server
    if (file.url === initialImageUrl && initialImageUrl) {
      const deleted = await deleteUploadedFile(initialImageUrl);
      if (deleted) {
        message.success('File deleted successfully');
      } else {
        message.warning('File removed from form but may still exist on server');
      }
    }
    
    // Use the hook's handleRemove for uploaded files
    return await handleRemove(file);
  };

  return (
    <>
      <PageBreadCrumbs items={["Professionals", "Edit"]} />
      <Edit saveButtonProps={saveButtonProps}>
        <Form {...formProps} layout="vertical">
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Title"
                name="title"
                rules={[
                  {
                    required: true,
                    message: "Title is required",
                  },
                ]}
              >
                <Input placeholder="Enter professional title" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Position"
                name="position"
                rules={[
                  {
                    required: true,
                    message: "Position is required",
                  },
                ]}
              >
                <Input placeholder="Enter position" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Email is required",
                  },
                  {
                    type: "email",
                    message: "Please enter a valid email",
                  },
                ]}
              >
                <Input placeholder="Enter email address" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="WhatsApp Contact"
                name="whatsappContact"
                rules={[
                  {
                    required: true,
                    message: "WhatsApp contact is required",
                  },
                ]}
              >
                <Input placeholder="Enter WhatsApp contact" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Location"
                name="location"
                rules={[
                  {
                    required: true,
                    message: "Location is required",
                  },
                ]}
              >
                <Input placeholder="Enter location" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Years of Experience"
                name="yearsOfExperience"
                rules={[
                  {
                    required: true,
                    message: "Years of experience is required",
                  },
                ]}
              >
                <InputNumber min={0} max={50} placeholder="5" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Bio"
            name="bio"
            rules={[
              {
                required: true,
                message: "Bio is required",
              },
            ]}
          >
            <Input.TextArea 
              rows={4} 
              placeholder="Enter professional bio" 
            />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} sm={8}>
              <Form.Item
                label="LinkedIn"
                name={["socialLinks", "linkedin"]}
              >
                <Input placeholder="https://linkedin.com/in/username" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                label="GitHub"
                name={["socialLinks", "github"]}
              >
                <Input placeholder="https://github.com/username" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                label="Website"
                name={["socialLinks", "website"]}
              >
                <Input placeholder="https://website.com" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Skills"
            name="skills"
            rules={[
              {
                required: true,
                message: "Skills are required",
              },
            ]}
          >
            <Input.TextArea 
              rows={3} 
              placeholder="Enter skills (comma-separated)" 
            />
          </Form.Item>

          <Form.Item
            label="Specializations"
            name="specializations"
          >
            <Input.TextArea 
              rows={3} 
              placeholder="Enter specializations (comma-separated)" 
            />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Availability"
                name="availability"
              >
                <Input placeholder="Available, Busy, Not Available" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Hourly Rate ($)"
                name="hourlyRate"
              >
                <InputNumber min={0} placeholder="50" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Education"
            name="education"
          >
            <Input placeholder="e.g., BSc Computer Science" />
          </Form.Item>

          <Form.Item
            label="Profile Image"
            name="profileImage"
            required={true}
            rules={[
              { required: true, message: "This field is a required field" },
              {
                validator: (_, value) => {
                  if (typeof value === 'string' && value.trim() !== '') {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Please upload a profile image'));
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
              <p className="ant-upload-text">Drag & drop a profile image here</p>
              <p className="ant-upload-hint">
                Support for single upload. Maximum file size: 1MB
              </p>
            </Upload.Dragger>
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Verified Status"
                name="isVerified"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Active Status"
                name="isActive"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Edit>
    </>
  );
}
