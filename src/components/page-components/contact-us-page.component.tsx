"use client";

import React, { useState } from "react";
import { Form, Input, Button, message, Card, Row, Col } from "antd";
import BannerComponent from "@components/banner/banner.component";
import { AppFooter } from "@components/footer/footer";
import { AppFootnote } from "@components/footnote/footnote";
import { AppNav } from "@components/nav/nav.component";
import { useTranslation } from "@contexts/translation.context";

const { TextArea } = Input;

export default function ContactUsPageComponent() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const response = await fetch("/api/contact-messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send message");
      }

      message.success("Message sent successfully! We'll get back to you soon.");
      form.resetFields();
    } catch (error) {
      console.error("Error sending message:", error);
      message.error(
        error instanceof Error
          ? error.message
          : "Failed to send message. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container-fluid mt-3" style={{ width: "100%", backgroundColor: "white" }}>
        <AppNav logoPath="/" />
      </div>
      
      {/* Banner */}
      <BannerComponent
        breadcrumbs={[{ label: t('nav.contact_us'), uri: "contact_us" }]}
        pageTitle={t('nav.contact_us')}
      />

      <section className="py-5" style={{ backgroundColor: "white" }}>
        <div className="container">
          <Row justify="center">
            <Col xs={24} lg={16}>
              <Card
                style={{
                  backgroundColor: "white",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  borderRadius: "12px",
                }}
              >
                <div className="text-center mb-4">
                  <h2 className="mb-3">Get In Touch</h2>
                  <p className="text-muted">
                    Have a project in mind? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
                  </p>
                </div>

                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleSubmit}
                  size="large"
                >
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="name"
                        label={t('contact.full_name')}
                        rules={[
                          { required: true, message: "Please enter your full name" },
                          { min: 2, message: "Name must be at least 2 characters" },
                        ]}
                      >
                        <Input placeholder="John Doe" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="email"
                        label={t('contact.working_mail')}
                        rules={[
                          { required: true, message: "Please enter your email" },
                          { type: "email", message: "Please enter a valid email" },
                        ]}
                      >
                        <Input placeholder="john.doe@email.com" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="phone"
                        label="Phone Number"
                        rules={[
                          { pattern: /^[\+]?[1-9][\d]{0,15}$/, message: "Please enter a valid phone number" },
                        ]}
                      >
                        <Input placeholder="+1234567890" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="subject"
                        label="Subject"
                        rules={[
                          { required: true, message: "Please enter a subject" },
                          { min: 5, message: "Subject must be at least 5 characters" },
                        ]}
                      >
                        <Input placeholder="Project Inquiry" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    name="message"
                    label={t('contact.anything_else')}
                    rules={[
                      { required: true, message: "Please enter your message" },
                      { min: 10, message: "Message must be at least 10 characters" },
                    ]}
                  >
                    <TextArea
                      rows={6}
                      placeholder={t('contact.message_placeholder')}
                      showCount
                      maxLength={1000}
                    />
                  </Form.Item>

                  <Form.Item className="text-center">
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      size="large"
                      style={{
                        backgroundColor: "#1890ff",
                        borderColor: "#1890ff",
                        borderRadius: "8px",
                        padding: "0 40px",
                        height: "48px",
                      }}
                    >
                      {t('contact.submit')}
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      <AppFooter logoPath="/" />
      <AppFootnote />
    </>
  );
}
