"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Form, Input, Typography, Card, Row, Col, Alert } from "antd";
import Link from "next/link";
import { FaEnvelope, FaArrowLeft, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { useNotification } from "@refinedev/core";
import { AppFooter } from "@components/footer/footer";
import { AppFootnote } from "@components/footnote/footnote";
import { AppNav } from "@components/nav/nav.component";
import { isValidEmail } from "@utils/auth0-password-reset";

const { Title, Text } = Typography;

export default function ForgotPasswordComponent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState("");
  const { open } = useNotification();

const onFinish = async (values: any) => {
    setLoading(true);
    setEmail(values.email);

try {
      // Validate email format
      if (!isValidEmail(values.email)) {
        throw new Error('Please enter a valid email address');
      }

// Send password reset request to custom API
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: values.email }),
      });

      const result = await response.json();

if (response.ok) {
        setEmailSent(true);
        open?.({
          type: "success",
          message: "Password reset email sent!",
          description: result.message || "Check your email for password reset instructions.",
          key: "password-reset-success",
        });
      } else {
        throw new Error(result.error || result.message || "Failed to send reset email");
      }
    } catch (error) {
      console.error('Password reset error:', error);
      open?.({
        type: "error",
        message: "Failed to send password reset email",
        description: error instanceof Error ? error.message : "Please try again or contact support.",
        key: "password-reset-error",
      });
    } finally {
      setLoading(false);
    }
  };

const handleBackToLogin = () => {
    router.push("/login");
  };

if (emailSent) {
    return (
      <>
        <AppNav logoPath="/" />

{}
        <div
          style={{
            minHeight: "calc(100vh - 200px)",
            background: "var(--cumi-gradient-primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem 1rem",
          }}
        >
          <Row justify="center" style={{ width: "100%", maxWidth: "1200px" }}>
            <Col xs={24} sm={20} md={16} lg={12} xl={10}>
              <Card
                style={{
                  borderRadius: "20px",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                  border: "none",
                  overflow: "hidden",
                }}
                styles={{ body: { padding: "3rem 2rem" } }}
              >
                {}
                <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "50%",
                      background: "var(--cumi-gradient-primary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 1.5rem",
                      boxShadow: "var(--cumi-shadow-lg)",
                    }}
                  >
                    <FaCheckCircle style={{ fontSize: "32px", color: "white" }} />
                  </div>
                  <Title
                    level={2}
                    style={{ margin: 0, color: "#1a1a1a", fontWeight: "600" }}
                  >
                    Check Your Email
                  </Title>
                  <Text style={{ color: "#666", fontSize: "16px" }}>
                    We&apos;ve sent password reset instructions to your email
                  </Text>
                </div>

{}
                <Alert
                  message="Password Reset Email Sent"
                  description={
                    <div>
                      <p>
                        We&apos;ve sent password reset instructions to <strong>{email}</strong>
                      </p>
                      <p style={{ marginBottom: 0 }}>
                        Please check your email and follow the instructions to reset your password.
                        The link will expire in 24 hours.
                      </p>
                    </div>
                  }
                  type="success"
                  icon={<FaCheckCircle />}
                  style={{
                    marginBottom: "2rem",
                    borderRadius: "12px",
                    border: "none",
                    background: "rgba(34, 197, 94, 0.1)",
                  }}
                />

{}
                <div style={{ marginBottom: "2rem" }}>
                  <Title level={4} style={{ color: "#1a1a1a", marginBottom: "1rem" }}>
                    What&apos;s Next?
                  </Title>
                  <div style={{ color: "#666", fontSize: "14px", lineHeight: "1.6" }}>
                    <ol style={{ paddingLeft: "1.5rem", margin: 0 }}>
                      <li>Check your email inbox (and spam folder)</li>
                      <li>Click the password reset link in the email</li>
                      <li>Enter your new password</li>
                      <li>Sign in with your new password</li>
                    </ol>
                  </div>
                </div>

{}
                <div style={{ textAlign: "center" }}>
                  <Button
                    type="primary"
                    onClick={handleBackToLogin}
                    icon={<FaArrowLeft />}
                    style={{
                      height: "50px",
                      borderRadius: "12px",
                      background: "var(--cumi-gradient-primary)",
                      border: "none",
                      fontSize: "16px",
                      fontWeight: "600",
                      boxShadow: "var(--cumi-shadow-lg)",
                      transition: "all 0.3s ease",
                      marginRight: "1rem",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "var(--cumi-shadow-xl)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "var(--cumi-shadow-lg)";
                    }}
                  >
                    Back to Login
                  </Button>

<Button
                    onClick={() => {
                      setEmailSent(false);
                      setEmail("");
                    }}
                    style={{
                      height: "50px",
                      borderRadius: "12px",
                      border: "2px solid #f0f0f0",
                      background: "white",
                      color: "var(--cumi-primary)",
                      fontSize: "16px",
                      fontWeight: "600",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--cumi-primary)";
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 8px 20px rgba(34, 197, 94, 0.2)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#f0f0f0";
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    Try Different Email
                  </Button>
                </div>

{}
                <div style={{ textAlign: "center", marginTop: "2rem" }}>
                  <Text style={{ color: "#999", fontSize: "14px" }}>
                    Didn&apos;t receive the email? Check your spam folder or{" "}
                    <Link
                      href="/contact"
                      style={{
                        color: "var(--cumi-primary)",
                        textDecoration: "none",
                        fontWeight: "500",
                      }}
                    >
                      contact support
                    </Link>
                  </Text>
                </div>
              </Card>
            </Col>
          </Row>
        </div>

<AppFooter logoPath="/" />
        <AppFootnote />
      </>
    );
  }

return (
    <>
      <AppNav logoPath="/" />

{}
      <div
        style={{
          minHeight: "calc(100vh - 200px)",
          background: "var(--cumi-gradient-primary)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem 1rem",
        }}
      >
        <Row justify="center" style={{ width: "100%", maxWidth: "1200px" }}>
          <Col xs={24} sm={20} md={16} lg={12} xl={10}>
            <Card
              style={{
                borderRadius: "20px",
                boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                border: "none",
                overflow: "hidden",
              }}
              styles={{ body: { padding: "3rem 2rem" } }}
            >
              {}
              <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    background: "var(--cumi-gradient-primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1.5rem",
                    boxShadow: "var(--cumi-shadow-lg)",
                  }}
                >
                  <FaEnvelope style={{ fontSize: "24px", color: "white" }} />
                </div>
                <Title
                  level={2}
                  style={{ margin: 0, color: "#1a1a1a", fontWeight: "600" }}
                >
                  Forgot Password?
                </Title>
                <Text style={{ color: "#666", fontSize: "16px" }}>
                  Enter your email address and we&apos;ll send you a link to reset your password
                </Text>
              </div>

{}
              <Form
                name="forgotPassword"
                layout="vertical"
                onFinish={onFinish}
                size="large"
                style={{ marginTop: "2rem" }}
              >
                <Form.Item
                  label={
                    <Text strong style={{ color: "#1a1a1a", fontSize: "14px" }}>
                      Email Address
                    </Text>
                  }
                  name="email"
                  rules={[
                    { required: true, message: "Please enter your email!" },
                    { type: "email", message: "Enter a valid email!" },
                  ]}
                >
                  <Input
                    placeholder="Enter your email address"
                    disabled={loading}
                    autoComplete="email"
                    aria-label="Email address"
                    aria-required="true"
                    prefix={
                      <FaEnvelope
                        style={{
                          color: "var(--cumi-primary)",
                          fontSize: "16px",
                          marginRight: "8px",
                        }}
                      />
                    }
                    style={{
                      borderRadius: "12px",
                      border: "2px solid #f0f0f0",
                      padding: "12px 16px",
                      fontSize: "16px",
                      transition: "all 0.3s ease",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "var(--cumi-primary)";
                      e.target.style.boxShadow = "var(--cumi-shadow-sm)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#f0f0f0";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </Form.Item>

{}
                <Form.Item style={{ marginBottom: "1rem" }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    disabled={loading}
                    aria-label="Send password reset email"
                    style={{
                      width: "100%",
                      height: "50px",
                      borderRadius: "12px",
                      background: "var(--cumi-gradient-primary)",
                      border: "none",
                      fontSize: "16px",
                      fontWeight: "600",
                      boxShadow: "var(--cumi-shadow-lg)",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "var(--cumi-shadow-xl)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "var(--cumi-shadow-lg)";
                    }}
                  >
                    {loading ? "Sending..." : "Send Reset Link"}
                  </Button>
                </Form.Item>
              </Form>

{}
              <div style={{ textAlign: "center", marginTop: "2rem" }}>
                <Text style={{ color: "#666", fontSize: "16px" }}>
                  Remember your password?{" "}
                  <Link
                    href="/login"
                    style={{
                      color: "var(--cumi-primary)",
                      textDecoration: "none",
                      fontWeight: "600",
                      fontSize: "16px",
                    }}
                  >
                    Sign In
                  </Link>
                </Text>
              </div>

{}
              <div style={{ marginTop: "2rem", padding: "1.5rem", background: "rgba(34, 197, 94, 0.05)", borderRadius: "12px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", marginBottom: "1rem" }}>
                  <FaExclamationCircle style={{ color: "var(--cumi-primary)", fontSize: "16px", marginRight: "8px", marginTop: "2px" }} />
                  <Text strong style={{ color: "#1a1a1a", fontSize: "14px" }}>
                    Need Help?
                  </Text>
                </div>
                <Text style={{ color: "#666", fontSize: "14px", lineHeight: "1.5" }}>
                  If you&apos;re having trouble resetting your password, please check your spam folder or contact our support team. 
                  We&apos;re here to help you regain access to your account.
                </Text>
              </div>
            </Card>
          </Col>
        </Row>
      </div>

<AppFooter logoPath="/" />
      <AppFootnote />
    </>
  );
}
