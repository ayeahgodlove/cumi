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

export default function Register() {
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
        message: "Login Successful!",
        key: "notification-key-open",
      });
      setLoading(false);
    } else {
      open?.({
        type: "error",
        message: "Login Failed!",
        key: "notification-key-open",
      });
      setLoading(false);
    }
    setLoading(false);
  };
  return (
    <>
      <div className="flex flex-1 justify-center items-center py-10 md:py-30">
        <Space
          direction="vertical"
          align="center"
          className="bg-white p-8  shadow-lg rounded-lg"
        >
          {/* App Title */}
          <ThemedTitleV2
            collapsed={false}
            wrapperStyles={{
              fontSize: "22px",
              marginBottom: "24px",
            }}
            icon={null}
            text={"Register"}
          />

          {/* Login Form */}
          <Form
            name="login"
            layout="vertical"
            onFinish={onFinish}
            // style={{ width: "320px" }}
            className="w-xs sm:w-sm md:w-md lg:w-lg xl:w-xl"
            size="large"
          >
            {/* Full Name */}
            <Form.Item
              label="Username"
              name="username"
              rules={[{ required: true, message: "Please enter your name" }]}
            >
              <Input placeholder="Enter your username" disabled={loading} />
            </Form.Item>

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

            {/* Confirm Password */}
            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Please confirm your password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match!"));
                  },
                }),
              ]}
            >
              <Input.Password
                placeholder="Confirm password"
                prefix={<FaLock />}
                disabled={loading}
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              style={{ width: "100%" }}
              size="large"
              disabled={loading}
              loading={loading}
            >
              Sign up
            </Button>
          </Form>
          {/* Divider */}
          <Divider>OR</Divider>

          <Space className="flex flex-col items-center justify-center">
            <Button
              icon={<SiAuth0 color="#d8452e" />}
              // style={{ display: "block", width: "100%" }}
              className="w-xs sm:w-sm md:w-md lg:w-lg xl:w-xl"
              onClick={() => signIn("auth0")}
              size="large"
            >
              Auth0
            </Button>
          </Space>

          {/* Signup Link */}
          <Typography.Text>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "#1890ff" }}>
              Sign-in
            </Link>
          </Typography.Text>
        </Space>
      </div>
    </>
  );
}
