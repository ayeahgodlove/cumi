"use client";

import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Select, Switch, Upload, Button, Row, Col, Space } from "antd";
import { UploadOutlined } from "@ant-design/icons";

export default function TeamCreate() {
  const { formProps, saveButtonProps } = useForm();

  return (
    <>
      <PageBreadCrumbs items={["Team", "Create"]} />
      <Create saveButtonProps={saveButtonProps}>
        <Form {...formProps} layout="vertical">
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: "Please enter team member name" }]}
              >
                <Input placeholder="Enter team member name" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Role"
                name="role"
                rules={[{ required: true, message: "Please enter role" }]}
              >
                <Input placeholder="e.g., Software Engineer" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Position"
                name="position"
                rules={[{ required: true, message: "Please enter position" }]}
              >
                <Input placeholder="e.g., Senior Developer" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Experience"
                name="experience"
                rules={[{ required: true, message: "Please enter experience" }]}
              >
                <Input placeholder="e.g., 5+ years" />
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
              placeholder="Tell us about this team member's background and expertise..."
            />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { type: "email", message: "Please enter a valid email" }
                ]}
              >
                <Input placeholder="team@cumi.dev" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Phone"
                name="phone"
              >
                <Input placeholder="+237681289411" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={8}>
              <Form.Item
                label="LinkedIn"
                name="linkedin"
              >
                <Input placeholder="https://linkedin.com/in/username" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                label="GitHub"
                name="github"
              >
                <Input placeholder="https://github.com/username" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                label="Twitter"
                name="twitter"
              >
                <Input placeholder="https://twitter.com/username" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Education"
                name="education"
              >
                <Input placeholder="e.g., Computer Science Degree" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Location"
                name="location"
              >
                <Input placeholder="e.g., Bamenda, Northwest, Cameroon" />
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
              placeholder="Select team member skills"
              options={[
                { label: "React", value: "React" },
                { label: "Laravel", value: "Laravel" },
                { label: "Node.js", value: "Node.js" },
                { label: "TypeScript", value: "TypeScript" },
                { label: "PHP", value: "PHP" },
                { label: "JavaScript", value: "JavaScript" },
                { label: "UI/UX Design", value: "UI/UX Design" },
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
            label="Avatar"
            name="avatar"
          >
            <Upload
              name="avatar"
              listType="picture-card"
              showUploadList={false}
              action="/api/uploads"
            >
              <Button icon={<UploadOutlined />}>Upload Avatar</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            label="Active Status"
            name="isActive"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch />
          </Form.Item>
        </Form>
      </Create>
    </>
  );
}
