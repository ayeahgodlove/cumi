"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ThemedTitleV2 } from "@refinedev/antd";
import { Button, Space, Form, Input, Typography, Divider } from "antd";
import { SiAuth0 } from "react-icons/si";
import Link from "next/link";

import { FaLock } from "react-icons/fa";
import { authService } from "../../service/auth.service";
import { useNotification } from "@refinedev/core";
import { AppNav } from "@components/nav/nav.component";
import { AppFooter } from "@components/footer/footer";
import { AppFootnote } from "@components/footnote/footnote";

export default function RegisterPageComponent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { open } = useNotification();

  const onFinish = async (values: any) => {
    setLoading(true);
    const response = await authService.register({
      email: values.email,
      username: values.username,
      password: values.password,
      confirmPassword: values.confirmPassword,
    });

    if (response?.success) {
      router.push("/"); // Redirect after successful login
      open?.({
        type: "success",
        message: "Registration Successful!",
        key: "notification-key-open",
      });
      setLoading(false);
    } else {
      open?.({
        type: "error",
        message: "Registration Failed!",
        key: "notification-key-open",
      });
      setLoading(false);
    }
    setLoading(false);
  };

  return (
    <>
      <AppNav logoPath="/" />
      <div className="container-fluid mt-3" style={{ width: "100%" }}>
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card shadow">
              <div className="card-body p-4">
                <div className="text-center mb-4">
                  <ThemedTitleV2
                    collapsed={false}
                    text="Register"
                    icon={<FaLock />}
                  />
                  <Typography.Text type="secondary">
                    Create your account to get started
                  </Typography.Text>
                </div>

                <Form
                  name="register"
                  onFinish={onFinish}
                  layout="vertical"
                  autoComplete="off"
                >
                  <Form.Item
                    label="Username"
                    name="username"
                    rules={[
                      {
                        required: true,
                        message: "Please input your username!",
                      },
                    ]}
                  >
                    <Input placeholder="Enter your username" />
                  </Form.Item>

                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      {
                        required: true,
                        message: "Please input your email!",
                      },
                      {
                        type: "email",
                        message: "Please enter a valid email!",
                      },
                    ]}
                  >
                    <Input placeholder="Enter your email" />
                  </Form.Item>

                  <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "Please input your password!",
                      },
                      {
                        min: 6,
                        message: "Password must be at least 6 characters!",
                      },
                    ]}
                  >
                    <Input.Password placeholder="Enter your password" />
                  </Form.Item>

                  <Form.Item
                    label="Confirm Password"
                    name="confirmPassword"
                    dependencies={["password"]}
                    rules={[
                      {
                        required: true,
                        message: "Please confirm your password!",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("password") === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error("Passwords do not match!")
                          );
                        },
                      }),
                    ]}
                  >
                    <Input.Password placeholder="Confirm your password" />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      block
                      size="large"
                    >
                      Register
                    </Button>
                  </Form.Item>
                </Form>

                <Divider>Or</Divider>

                <Space direction="vertical" style={{ width: "100%" }}>
                  <Button
                    icon={<SiAuth0 />}
                    block
                    size="large"
                    onClick={() => signIn("auth0")}
                  >
                    Register with Auth0
                  </Button>
                </Space>

                <div className="text-center mt-3">
                  <Typography.Text>
                    Already have an account?{" "}
                    <Link href="/login" className="text-primary">
                      Login here
                    </Link>
                  </Typography.Text>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AppFooter logoPath="/" />
      <AppFootnote />
    </>
  );
}
