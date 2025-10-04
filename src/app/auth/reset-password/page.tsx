"use client";

import React, { useState, useEffect, Suspense } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  notification,
  Typography,
  Space,
  Alert,
  Progress,
} from "antd";
import {
  LockOutlined,
  CheckCircleOutlined,
  SafetyOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";

const { Title, Text, Paragraph } = Typography;

function ResetPasswordForm() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [api, contextHolder] = notification.useNotification();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      api.error({
        message: "Invalid Reset Link",
        description:
          "The password reset link is invalid or missing. Please request a new one.",
        placement: "topRight",
      });
      setTimeout(() => router.push("/forgot-password"), 3000);
    }
  }, [token, router, api]);

  const calculatePasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 6) strength += 20;
    if (password.length >= 8) strength += 20;
    if (password.length >= 12) strength += 20;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 20;
    if (/\d/.test(password)) strength += 10;
    if (/[^a-zA-Z\d]/.test(password)) strength += 10;
    return Math.min(strength, 100);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setPasswordStrength(calculatePasswordStrength(password));
  };

  const getStrengthColor = (strength: number): string => {
    if (strength < 30) return "#ff4d4f";
    if (strength < 60) return "#faad14";
    if (strength < 80) return "#1890ff";
    return "#22C55E";
  };

  const getStrengthText = (strength: number): string => {
    if (strength < 30) return "Weak";
    if (strength < 60) return "Fair";
    if (strength < 80) return "Good";
    return "Strong";
  };

  const handleSubmit = async (values: {
    password: string;
    confirmPassword: string;
  }) => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password: values.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        api.success({
          message: "Success!",
          description:
            "Your password has been reset successfully. Redirecting to login...",
          placement: "topRight",
          duration: 3,
        });
        setTimeout(() => router.push("/login"), 3000);
      } else {
        api.error({
          message: "Reset Failed",
          description:
            data.error ||
            "Failed to reset password. Please try again or request a new reset link.",
          placement: "topRight",
        });
      }
    } catch (error) {
      api.error({
        message: "Error",
        description: "An unexpected error occurred. Please try again later.",
        placement: "topRight",
      });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
          padding: "20px",
        }}
      >
        {contextHolder}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card
            style={{
              width: "100%",
              maxWidth: 500,
              textAlign: "center",
              borderRadius: "20px",
              boxShadow:
                "0 20px 25px -5px rgba(34, 197, 94, 0.1), 0 10px 10px -5px rgba(34, 197, 94, 0.05)",
              border: "none",
            }}
            styles={{ body: { padding: "48px 40px" } }}
          >
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              {/* Success Icon */}
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  margin: "0 auto",
                  background:
                    "linear-gradient(135deg, #22C55E 0%, #14B8A6 100%)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 10px 20px rgba(34, 197, 94, 0.3)",
                }}
              >
                <CheckCircleOutlined style={{ fontSize: 56, color: "white" }} />
              </div>

              <Title
                level={2}
                style={{ margin: "24px 0 16px", color: "#1F2937" }}
              >
                Password Reset Successful!
              </Title>

              <Paragraph
                style={{ fontSize: "16px", color: "#6B7280", lineHeight: 1.7 }}
              >
                Your password has been successfully updated. You can now sign in
                to your account with your new password.
              </Paragraph>

              <div
                style={{
                  background:
                    "linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)",
                  padding: "20px",
                  borderRadius: "12px",
                  border: "1px solid #22C55E",
                  margin: "20px 0",
                }}
              >
                <Text style={{ color: "#065F46", fontSize: "15px" }}>
                  <SafetyOutlined style={{ marginRight: "8px" }} />
                  Your account is now secure with your new password
                </Text>
              </div>

              <Button
                type="primary"
                size="large"
                onClick={() => router.push("/login")}
                style={{
                  width: "100%",
                  height: "48px",
                  background:
                    "linear-gradient(135deg, #22C55E 0%, #14B8A6 100%)",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "16px",
                  fontWeight: 600,
                  boxShadow: "0 4px 12px rgba(34, 197, 94, 0.3)",
                }}
              >
                Continue to Sign In →
              </Button>
            </Space>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
        padding: "20px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {contextHolder}

      {/* Background Decoration */}
      <div
        style={{
          position: "absolute",
          top: "-50%",
          left: "-50%",
          width: "200%",
          height: "200%",
          background:
            "radial-gradient(circle, rgba(34, 197, 94, 0.05) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          pointerEvents: "none",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          width: "100%",
          maxWidth: 500,
          position: "relative",
          zIndex: 1,
        }}
      >
        <Card
          style={{
            width: "100%",
            borderRadius: "20px",
            boxShadow:
              "0 20px 25px -5px rgba(34, 197, 94, 0.1), 0 10px 10px -5px rgba(34, 197, 94, 0.05)",
            border: "none",
            overflow: "hidden",
          }}
          styles={{ body: { padding: 0 } }}
        >
          {/* Header with Logo */}
          <div
            style={{
              background: "linear-gradient(135deg, #22C55E 0%, #14B8A6 100%)",
              padding: "48px 40px",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-50%",
                left: "-50%",
                width: "200%",
                height: "200%",
                background:
                  "radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)",
                backgroundSize: "30px 30px",
              }}
            />

            {/* Logo */}
            <div
              style={{
                width: "80px",
                height: "80px",
                margin: "0 auto 24px",
                background: "white",
                borderRadius: "16px",
                padding: "8px",
                boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
                position: "relative",
                zIndex: 1,
              }}
            >
              <Image
                src="/cumi-green.jpg"
                alt="CUMI Logo"
                width={70}
                height={80}
                style={{
                  borderRadius: "12px",
                  objectFit: "cover",
                  marginTop: "1.5rem",
                }}
              />
            </div>

            <Title
              level={2}
              style={{
                color: "white",
                margin: "0 0 8px",
                fontSize: "32px",
                position: "relative",
                zIndex: 1,
              }}
            >
              🔐 Reset Password
            </Title>
            <Text
              style={{
                color: "white",
                fontSize: "18px",
                opacity: 0.95,
                position: "relative",
                zIndex: 1,
              }}
            >
              Create a strong new password
            </Text>
          </div>

          {/* Form Content */}
          <div style={{ padding: "40px" }}>
            <Alert
              message="Password Requirements"
              description={
                <ul style={{ margin: "8px 0 0", paddingLeft: "20px" }}>
                  <li>At least 6 characters (8+ recommended)</li>
                  <li>Mix of uppercase and lowercase letters</li>
                  <li>Include numbers and special characters</li>
                </ul>
              }
              type="info"
              showIcon
              style={{
                marginBottom: "28px",
                borderRadius: "12px",
                border: "1px solid #DBEAFE",
              }}
            />

            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              size="large"
            >
              <Form.Item
                name="password"
                label={
                  <Text strong style={{ fontSize: "15px" }}>
                    New Password
                  </Text>
                }
                rules={[
                  { required: true, message: "Please enter your new password" },
                  {
                    min: 6,
                    message: "Password must be at least 6 characters long",
                  },
                  {
                    pattern: /^(?=.*[a-zA-Z])(?=.*\d).+$/,
                    message: "Password must contain both letters and numbers",
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: "#22C55E" }} />}
                  placeholder="Enter your new password"
                  onChange={handlePasswordChange}
                  iconRender={(visible) =>
                    visible ? (
                      <EyeTwoTone twoToneColor="#22C55E" />
                    ) : (
                      <EyeInvisibleOutlined />
                    )
                  }
                  style={{
                    borderRadius: "10px",
                    padding: "12px 16px",
                    fontSize: "15px",
                  }}
                />
              </Form.Item>

              {/* Password Strength Indicator */}
              {passwordStrength > 0 && (
                <div style={{ marginBottom: "24px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "8px",
                    }}
                  >
                    <Text style={{ fontSize: "13px", color: "#6B7280" }}>
                      Password Strength:
                    </Text>
                    <Text
                      strong
                      style={{
                        fontSize: "13px",
                        color: getStrengthColor(passwordStrength),
                      }}
                    >
                      {getStrengthText(passwordStrength)}
                    </Text>
                  </div>
                  <Progress
                    percent={passwordStrength}
                    strokeColor={getStrengthColor(passwordStrength)}
                    showInfo={false}
                    strokeWidth={8}
                    style={{ marginBottom: 0 }}
                  />
                </div>
              )}

              <Form.Item
                name="confirmPassword"
                label={
                  <Text strong style={{ fontSize: "15px" }}>
                    Confirm Password
                  </Text>
                }
                dependencies={["password"]}
                rules={[
                  { required: true, message: "Please confirm your password" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("The passwords you entered do not match")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: "#22C55E" }} />}
                  placeholder="Confirm your new password"
                  iconRender={(visible) =>
                    visible ? (
                      <EyeTwoTone twoToneColor="#22C55E" />
                    ) : (
                      <EyeInvisibleOutlined />
                    )
                  }
                  style={{
                    borderRadius: "10px",
                    padding: "12px 16px",
                    fontSize: "15px",
                  }}
                />
              </Form.Item>

              <Form.Item style={{ marginBottom: "16px" }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  icon={<SafetyOutlined />}
                  style={{
                    width: "100%",
                    height: "52px",
                    background:
                      "linear-gradient(135deg, #22C55E 0%, #14B8A6 100%)",
                    border: "none",
                    borderRadius: "12px",
                    fontSize: "17px",
                    fontWeight: 600,
                    boxShadow: "0 4px 12px rgba(34, 197, 94, 0.3)",
                    letterSpacing: "0.3px",
                  }}
                >
                  {loading ? "Resetting Password..." : "Reset My Password"}
                </Button>
              </Form.Item>

              <div style={{ textAlign: "center", marginTop: "20px" }}>
                <Button
                  type="text"
                  icon={<ArrowLeftOutlined />}
                  onClick={() => router.push("/login")}
                  style={{
                    color: "#6B7280",
                    fontSize: "15px",
                    fontWeight: 500,
                  }}
                >
                  Back to Sign In
                </Button>
              </div>
            </Form>

            <div
              style={{
                marginTop: "28px",
                padding: "16px",
                background: "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)",
                borderRadius: "12px",
                border: "1px solid #F59E0B",
              }}
            >
              <Text
                style={{
                  fontSize: "13px",
                  color: "#92400E",
                  display: "block",
                  textAlign: "center",
                }}
              >
                <SafetyOutlined style={{ marginRight: "6px" }} />
                Remember to use a unique password that you don&apos;t use on
                other websites
              </Text>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
          }}
        >
          <Card style={{ padding: "40px", borderRadius: "20px" }}>
            <Space direction="vertical" size="large" align="center">
              <LockOutlined style={{ fontSize: 48, color: "#22C55E" }} />
              <Text>Loading...</Text>
            </Space>
          </Card>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}

