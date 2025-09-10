"use client";

import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Select, Switch, Upload, Button, Row, Col, InputNumber, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useUpload, getImageUrlFromEvent, getImageUrlString } from "@hooks/shared/upload.hook";
import { useEffect } from "react";

export default function ProfessionalCreate() {
  const { formProps, saveButtonProps } = useForm();

  const { fileList, setFileList, handleUploadChange, beforeUpload, handleRemove } = useUpload({
    maxSize: 1024 * 1024, // 1MB
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
    form: formProps.form,
    fieldName: 'profileImage',
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
          profileImage: imageUrl
        });
      }
    }
  }, [fileList, formProps.form]);

  return (
    <>
      <PageBreadCrumbs items={["Professionals", "Create"]} />
      <Create saveButtonProps={saveButtonProps}>
        <Form {...formProps} layout="vertical">
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Title"
                name="title"
                rules={[{ required: true, message: "Please enter professional title" }]}
              >
                <Input placeholder="e.g., Senior Developer" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Position"
                name="position"
                rules={[{ required: true, message: "Please enter position" }]}
              >
                <Input placeholder="e.g., Full Stack Developer" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please enter email" },
                  { type: "email", message: "Please enter a valid email" }
                ]}
              >
                <Input placeholder="professional@company.com" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="WhatsApp Contact"
                name="whatsappContact"
                rules={[{ required: true, message: "Please enter WhatsApp contact" }]}
              >
                <Input placeholder="+237681289411" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Location"
                name="location"
                rules={[{ required: true, message: "Please enter location" }]}
              >
                <Input placeholder="e.g., Bamenda, Cameroon" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Years of Experience"
                name="yearsOfExperience"
                rules={[{ required: true, message: "Please enter years of experience" }]}
              >
                <InputNumber min={0} max={50} placeholder="5" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Bio"
            name="bio"
            rules={[{ required: true, message: "Please enter bio" }]}
          >
            <Input.TextArea 
              rows={4} 
              placeholder="Tell us about this professional's background and expertise..."
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
            rules={[{ required: true, message: "Please select skills" }]}
          >
            <Select
              mode="multiple"
              placeholder="Select professional skills"
              options={[
                { label: "React", value: "React" },
                { label: "Laravel", value: "Laravel" },
                { label: "Node.js", value: "Node.js" },
                { label: "TypeScript", value: "TypeScript" },
                { label: "PHP", value: "PHP" },
                { label: "JavaScript", value: "JavaScript" },
                { label: "Python", value: "Python" },
                { label: "Java", value: "Java" },
                { label: "C++", value: "C++" },
                { label: "Vue.js", value: "Vue.js" },
                { label: "Angular", value: "Angular" },
                { label: "MongoDB", value: "MongoDB" },
                { label: "PostgreSQL", value: "PostgreSQL" },
                { label: "MySQL", value: "MySQL" },
                { label: "Docker", value: "Docker" },
                { label: "AWS", value: "AWS" },
                { label: "Git", value: "Git" }
              ]}
            />
          </Form.Item>

          <Form.Item
            label="Specializations"
            name="specializations"
          >
            <Select
              mode="multiple"
              placeholder="Select specializations"
              options={[
                { label: "Web Development", value: "Web Development" },
                { label: "Mobile Development", value: "Mobile Development" },
                { label: "Backend Development", value: "Backend Development" },
                { label: "Frontend Development", value: "Frontend Development" },
                { label: "DevOps", value: "DevOps" },
                { label: "UI/UX Design", value: "UI/UX Design" },
                { label: "Data Science", value: "Data Science" },
                { label: "Machine Learning", value: "Machine Learning" },
                { label: "Cloud Computing", value: "Cloud Computing" },
                { label: "Cybersecurity", value: "Cybersecurity" }
              ]}
            />
          </Form.Item>

          <Form.Item
            label="Availability"
            name="availability"
            initialValue="Available"
          >
            <Select
              options={[
                { label: "Available", value: "Available" },
                { label: "Busy", value: "Busy" },
                { label: "Not Available", value: "Not Available" }
              ]}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Hourly Rate ($)"
                name="hourlyRate"
              >
                <InputNumber min={0} placeholder="50" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Education"
                name="education"
              >
                <Input placeholder="e.g., BSc Computer Science" />
              </Form.Item>
            </Col>
          </Row>

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
              onRemove={handleRemove}
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
                initialValue={false}
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Active Status"
                name="isActive"
                valuePropName="checked"
                initialValue={true}
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Create>
    </>
  );
}
