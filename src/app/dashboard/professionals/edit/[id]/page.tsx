"use client";

import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Switch, Upload, Button, Space, Avatar } from "antd";
import { UploadOutlined, UserOutlined } from "@ant-design/icons";
import { BASE_URL_UPLOADS_MEDIA } from "@constants/api-url";

export default function ProfessionalEdit() {
  const { formProps, saveButtonProps } = useForm({});

  return (
    <>
      <PageBreadCrumbs items={["Professionals", "Edit"]} />
      <Edit saveButtonProps={saveButtonProps}>
        <Form {...formProps} layout="vertical">
          <Form.Item
            label="Avatar Preview"
            name="avatar"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e;
              }
              return e?.fileList;
            }}
          >
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action={`${BASE_URL_UPLOADS_MEDIA}`}
              beforeUpload={(file) => {
                const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
                if (!isJpgOrPng) {
                  console.error('You can only upload JPG/PNG file!');
                }
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) {
                  console.error('Image must smaller than 2MB!');
                }
                return isJpgOrPng && isLt2M;
              }}
            >
              <div>
                <Avatar
                  size={100}
                  src={formProps.form?.getFieldValue("avatar") ? `${BASE_URL_UPLOADS_MEDIA}/${formProps.form?.getFieldValue("avatar")}` : <UserOutlined />}
                  icon={<UserOutlined />}
                />
                <div style={{ marginTop: 8 }}>
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </div>
              </div>
            </Upload>
          </Form.Item>

          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Name is required",
              },
            ]}
          >
            <Input placeholder="Enter professional name" />
          </Form.Item>

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

          <Form.Item
            label="Company"
            name="company"
            rules={[
              {
                required: true,
                message: "Company is required",
              },
            ]}
          >
            <Input placeholder="Enter company name" />
          </Form.Item>

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

          <Form.Item
            label="Phone"
            name="phone"
          >
            <Input placeholder="Enter phone number" />
          </Form.Item>

          <Form.Item
            label="LinkedIn URL"
            name="linkedinUrl"
          >
            <Input placeholder="Enter LinkedIn profile URL" />
          </Form.Item>

          <Form.Item
            label="GitHub URL"
            name="githubUrl"
          >
            <Input placeholder="Enter GitHub profile URL" />
          </Form.Item>

          <Form.Item
            label="Twitter URL"
            name="twitterUrl"
          >
            <Input placeholder="Enter Twitter profile URL" />
          </Form.Item>

          <Form.Item
            label="Bio"
            name="bio"
          >
            <Input.TextArea 
              rows={4} 
              placeholder="Enter professional bio" 
            />
          </Form.Item>

          <Form.Item
            label="Skills"
            name="skills"
          >
            <Input.TextArea 
              rows={3} 
              placeholder="Enter skills (comma-separated)" 
            />
          </Form.Item>

          <Form.Item
            label="Experience"
            name="experience"
          >
            <Input placeholder="Enter years of experience" />
          </Form.Item>

          <Form.Item
            label="Active Status"
            name="isActive"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Form>
      </Edit>
    </>
  );
}
