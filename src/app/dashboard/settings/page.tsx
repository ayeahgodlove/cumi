"use client";

import { Card, Form, Input, Button, message, Space, Typography, Divider } from "antd";
import { UserOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";
import { useSession } from "next-auth/react";
import { useState } from "react";
import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";

const { Title, Text } = Typography;

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleUpdateProfile = async (values: any) => {
    setLoading(true);
    try {
      // Here you would typically call an API to update the user profile
      // For now, we'll just show a success message
      message.success("Profile updated successfully!");
      
      // Update the session if needed
      await update({
        ...session,
        user: {
          ...session?.user,
          name: values.name,
          email: values.email,
        },
      });
    } catch (error) {
      message.error("Failed to update profile");
      console.error("Profile update error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (values: any) => {
    setLoading(true);
    try {
      // Here you would typically call an API to change the password
      message.success("Password changed successfully!");
      form.setFieldsValue({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      message.error("Failed to change password");
      console.error("Password change error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      <PageBreadCrumbs items={["Dashboard", "Settings"]} />
      
      <Title level={2}>Settings</Title>
      
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {/* Profile Settings */}
        <Card title="Profile Settings" style={{ maxWidth: 600 }}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleUpdateProfile}
            initialValues={{
              name: session?.user?.name || "",
              email: session?.user?.email || "",
            }}
          >
            <Form.Item
              name="name"
              label="Full Name"
              rules={[{ required: true, message: "Please enter your name" }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Enter your full name"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email Address"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Enter your email address"
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
              >
                Update Profile
              </Button>
            </Form.Item>
          </Form>
        </Card>

        {/* Password Settings */}
        <Card title="Password Settings" style={{ maxWidth: 600 }}>
          <Form
            layout="vertical"
            onFinish={handleChangePassword}
          >
            <Form.Item
              name="currentPassword"
              label="Current Password"
              rules={[{ required: true, message: "Please enter your current password" }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Enter your current password"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="newPassword"
              label="New Password"
              rules={[
                { required: true, message: "Please enter a new password" },
                { min: 8, message: "Password must be at least 8 characters" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Enter your new password"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Confirm New Password"
              dependencies={["newPassword"]}
              rules={[
                { required: true, message: "Please confirm your new password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match"));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Confirm your new password"
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
              >
                Change Password
              </Button>
            </Form.Item>
          </Form>
        </Card>

        {/* Account Information */}
        <Card title="Account Information" style={{ maxWidth: 600 }}>
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <div>
              <Text strong>User ID:</Text>
              <br />
              <Text type="secondary">{session?.user?.id || "N/A"}</Text>
            </div>
            
            <Divider />
            
            <div>
              <Text strong>Role:</Text>
              <br />
              <Text type="secondary" style={{ textTransform: "capitalize" }}>
                {session?.user?.role || "User"}
              </Text>
            </div>
            
            <Divider />
            
            <div>
              <Text strong>Account Status:</Text>
              <br />
              <Text type="secondary" style={{ color: "#52c41a" }}>
                Active
              </Text>
            </div>
          </Space>
        </Card>
      </Space>
    </div>
  );
}