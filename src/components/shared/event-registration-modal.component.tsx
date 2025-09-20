"use client";

import React, { useState } from "react";
import {
  Modal,
  Form,
  Card,
  Row,
  Col,
  Space,
  Typography,
  Input,
  Button,
  message,
} from "antd";
import {
  CalendarOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { IEvent } from "@domain/models/event.model";
import { useSession } from "next-auth/react";
import PhoneNumberInput from "@components/shared/phone-number-input.component";
import { validatePhoneNumber } from "@utils/country-codes";

const { Title, Text } = Typography;

interface EventRegistrationModalProps {
  visible: boolean;
  onCancel: () => void;
  event: IEvent | null;
  onSuccess?: () => void;
}

export const EventRegistrationModal: React.FC<EventRegistrationModalProps> = ({
  visible,
  onCancel,
  event,
  onSuccess,
}) => {
  const { data: session } = useSession();
  const [form] = Form.useForm();
  const [isRegistering, setIsRegistering] = useState(false);

  const handleRegistrationSubmit = async (values: any) => {
    try {
      if (!event || !session?.user?.id) {
        message.error("Please log in to register for events");
        return;
      }

      setIsRegistering(true);

      const registrationData = {
        eventId: event.id,
        userId: session.user.id,
        name: values.name,
        email: values.email,
        phone: values.phone,
        countryCode: values.countryCode || 'CM',
        company: values.company,
        dietaryRequirements: values.dietaryRequirements,
        additionalNotes: values.additionalNotes,
        // Set admin-controlled defaults
        status: "pending",
        paymentStatus: event.isFree ? "paid" : "pending",
        paymentAmount: event.isFree ? 0 : event.entryFee,
      };

      const response = await fetch("/api/event-registrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registrationData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      message.success("Successfully registered for the event!");
      form.resetFields();
      onCancel();
      onSuccess?.();
    } catch (error) {
      console.error("Registration error:", error);
      message.error(
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again."
      );
    } finally {
      setIsRegistering(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (!event) return null;

  return (
    <Modal
      title={`Register for ${event.title}`}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <Card style={{ backgroundColor: 'white', border: 'none' }}>
        <Card size="small" style={{ marginBottom: 24, backgroundColor: 'white' }}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <img
                src={event.imageUrl || "/img/design-3.jpg"}
                alt={event.title}
                style={{
                  width: "100%",
                  height: 150,
                  objectFit: "cover",
                  borderRadius: 8,
                }}
              />
            </Col>
            <Col span={24}>
              <Space direction="vertical" size="small">
                <Title level={4} style={{ margin: 0 }}>
                  {event.title}
                </Title>
                <Space>
                  <CalendarOutlined />
                  <Text>
                    {formatDate(event.eventDate.toString())}
                  </Text>
                </Space>
                <Space>
                  <EnvironmentOutlined />
                  <Text>{event.location || 'TBA'}</Text>
                </Space>
              </Space>
            </Col>
          </Row>
        </Card>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleRegistrationSubmit}
          initialValues={{
            name: session?.user?.name || "",
            email: session?.user?.email || "",
          }}
          size="large"
        >
        <Form.Item
          name="name"
          label="Full Name"
          rules={[
            { required: true, message: "Please enter your full name" },
          ]}
        >
          <Input placeholder="Enter your full name" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email Address"
          rules={[
            { required: true, message: "Please enter your email" },
            { type: "email", message: "Please enter a valid email" },
          ]}
        >
          <Input placeholder="Enter your email address" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Phone Number"
          rules={[
            { required: true, message: "Please enter your phone number" },
            {
              validator: (_, value) => {
                if (!value) return Promise.resolve();
                const countryCode = form.getFieldValue('countryCode') || 'CM';
                if (validatePhoneNumber(countryCode, value)) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Please enter a valid phone number"));
              },
            },
          ]}
        >
          <PhoneNumberInput
            placeholder="Enter your phone number"
            showMoneyServices={true}
            onCountryCodeChange={(countryCode) => {
              form.setFieldValue('countryCode', countryCode);
            }}
          />
        </Form.Item>

        <Form.Item name="company" label="Company/Organization">
          <Input placeholder="Enter your company or organization" />
        </Form.Item>

        <Form.Item name="dietaryRequirements" label="Dietary Requirements">
          <Input.TextArea 
            placeholder="Any dietary restrictions or special requirements" 
            rows={2}
          />
        </Form.Item>

        <Form.Item name="additionalNotes" label="Additional Notes">
          <Input.TextArea 
            placeholder="Any additional information or special requests" 
            rows={2}
          />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button 
              type="primary" 
              htmlType="submit"
              loading={isRegistering}
            >
              {isRegistering ? 'Registering...' : 'Complete Registration'}
            </Button>
            <Button onClick={onCancel}>
              Cancel
            </Button>
          </Space>
        </Form.Item>
        </Form>
      </Card>
    </Modal>
  );
};

export default EventRegistrationModal;
