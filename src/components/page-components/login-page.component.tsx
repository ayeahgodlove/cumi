"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ThemedTitleV2 } from "@refinedev/antd";
import { Button, Space, Form, Input, Typography, Divider } from "antd";
import { SiAuth0 } from "react-icons/si";
import Link from "next/link";
import { FaLock } from "react-icons/fa";
import { useNotification } from "@refinedev/core";

export default function LoginPageComponent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { open } = useNotification();

  const onFinish = async (values: any) => {
    setLoading(true);

    const response = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    setLoading(false);
    if (response?.ok) {
      router.push("/"); // Redirect after successful login
      open?.({
        type: "success",
        message: "Login Successful!",
        key: "notification-key-open",
      });
    } else {
      open?.({
        type: "error",
        message: "Login Failed!",
        key: "notification-key-open",
      });
    }
  };

  return (
    <div className="d-flex flex-grow-1 justify-content-center align-items-center py-4 py-md-5 bg-light w-100">
      <Space
        direction="vertical"
        align="center"
        className="bg-white p-4 shadow-lg rounded"
      >
        {/* App Title */}
        <ThemedTitleV2
          collapsed={false}
          wrapperStyles={{
            fontSize: "22px",
            marginBottom: "24px",
          }}
          icon={null}
          text={"Login"}
        />

        {/* Login Form */}
        <Form
          name="login"
          layout="vertical"
          onFinish={onFinish}
          className="w-100 w-sm-75 w-md-50 w-lg-40 w-xl-25"
          size="large"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter your email!" },
              { type: "email", message: "Enter a valid email!" },
            ]}
          >
            <Input
              size="large"
              placeholder="Enter your email"
              disabled={loading}
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please enter your password!" },
            ]}
          >
            <Input.Password
              size="large"
              placeholder="Enter your password"
              prefix={<FaLock />}
              disabled={loading}
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            className="w-100"
            size="large"
            loading={loading}
            disabled={loading}
          >
            Sign in
          </Button>

          {/* Divider */}
          <Divider>OR</Divider>
          <div className="d-block w-100 mt-3">
            <Button
              icon={<SiAuth0 color="#d8452e" />}
              className="w-100 d-block"
              onClick={() => signIn("auth0")}
              size="large"
              style={{ width: "100%" }}
              block
            >
              Auth0
            </Button>
          </div>
        </Form>

        {/* Signup Link */}
        <Typography.Text>
          Don&lsquo;t have an account?{" "}
          <Link href="/register" style={{ color: "#1890ff" }}>
            Sign up
          </Link>
        </Typography.Text>
      </Space>
    </div>
  );
}
