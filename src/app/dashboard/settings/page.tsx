"use client";

import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import { Card, Form, Input, Button, Row, Col, Avatar, Upload, message, Divider, Typography, Space } from "antd";
import { UserOutlined, UploadOutlined, SaveOutlined } from "@ant-design/icons";
import { useSession } from "next-auth/react";
import { useState } from "react";

const { Title, Text } = Typography;

export default function UserSettings() {
  const { data: session, update } = useSession();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      // Here you would typically update the user profile via API
      console.log('Updating profile:', values);
      message.success('Profile updated successfully!');
      
      // Update the session if needed
      await update({
        ...session,
        user: {
          ...session?.user,
          name: values.name,
          email: values.email,
        }
      });
    } catch (error) {
      message.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = (info: any) => {
    if (info.file.status === 'done') {
      message.success('Avatar updated successfully!');
      // Update session with new avatar
      update({
        ...session,
        user: {
          ...session?.user,
          image: info.file.response?.url || info.file.thumbUrl,
        }
      });
    } else if (info.file.status === 'error') {
      message.error('Failed to upload avatar');
    }
  };

  return (
    <>
      <PageBreadCrumbs items={["Dashboard", "Settings"]} />
      
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={8}>
          <Card title="Profile Picture" className="text-center">
            <Space direction="vertical" size="large" className="w-100">
              <Avatar
                size={120}
                src={session?.user?.image}
                icon={<UserOutlined />}
                style={{ backgroundColor: '#1890ff' }}
              />
              <Upload
                name="avatar"
                listType="picture-card"
                showUploadList={false}
                action="/api/uploads"
                onChange={handleAvatarUpload}
              >
                <Button icon={<UploadOutlined />} type="primary">
                  Change Avatar
                </Button>
              </Upload>
              <Text type="secondary">
                Upload a new profile picture
              </Text>
            </Space>
          </Card>
        </Col>

        <Col xs={24} lg={16}>
          <Card title="Account Settings">
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                name: session?.user?.name || '',
                email: session?.user?.email || '',
              }}
              onFinish={handleSubmit}
            >
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Full Name"
                    name="name"
                    rules={[
                      { required: true, message: 'Please enter your full name' }
                    ]}
                  >
                    <Input placeholder="Enter your full name" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Email Address"
                    name="email"
                    rules={[
                      { required: true, message: 'Please enter your email' },
                      { type: 'email', message: 'Please enter a valid email' }
                    ]}
                  >
                    <Input placeholder="Enter your email address" />
                  </Form.Item>
                </Col>
              </Row>

              <Divider />

              <Title level={4}>Security Settings</Title>
              
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Current Password"
                    name="currentPassword"
                  >
                    <Input.Password placeholder="Enter current password" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="New Password"
                    name="newPassword"
                  >
                    <Input.Password placeholder="Enter new password" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="Confirm New Password"
                name="confirmPassword"
                dependencies={['newPassword']}
                rules={[
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Passwords do not match!'));
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Confirm new password" />
              </Form.Item>

              <Divider />

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  loading={loading}
                  size="large"
                >
                  Save Changes
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </>
  );
}
