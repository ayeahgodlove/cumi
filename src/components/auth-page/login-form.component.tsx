"use client";
import React from "react";
import {
  Button,
  Checkbox,
  Col,
  ConfigProvider,
  Form,
  Input,
  Row,
  Space,
  Typography,
} from "antd";
import { useWindowSize } from "usehooks-ts";
import { useLogin } from "@refinedev/core";
import Link from "next/link";
import Image from "next/image";

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};
export const LoginForm = () => {
  const { width } = useWindowSize();
  const [form] = Form.useForm();
  const { isLoading, mutate: login } = useLogin();

  const onFinish = (values: any) => {
    const obj = {
      email: values.email,
      password: values.password,
    };
    login(obj);
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          fontSize: 16,
          colorPrimary: "#ba68c8",
          colorLink: "#6f137f",
        },
      }}
    >
      <Row
        align={"middle"}
        style={{ justifyContent: width > 767 ? "center" : "" }}
      >
        <Col
          span={width > 767 ? 10 : 24}
          style={{
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            src={"/11436091_4707067.svg"}
            width={width < 1024 ? 250 : 350}
            height={width < 1024 ? 250 : 350}
            alt="login picture"
          />
        </Col>
        <Col span={width > 767 ? 14 : 24}>
          <Typography.Title level={5} style={{ textAlign: "center" }}>
            My Website
          </Typography.Title>
          <Form
            layout="vertical"
            form={form}
            name="control-hooks"
            onFinish={onFinish}
            style={{ maxWidth: 600 }}
          >
            <Form.Item
              name="email"
              label="Email"
              required={true}
              rules={[
                { required: true, message: "This field is a required field" },
              ]}
              style={{ marginBottom: 20 }}
            >
              <Input placeholder="Email" />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              required={true}
              rules={[
                { required: true, message: "This field is a required field" },
              ]}
              style={{ marginBottom: 20 }}
            >
              <Input placeholder="Password" type="password" />
            </Form.Item>
            <Form.Item<FieldType>
              name="remember"
              valuePropName="checked"
              style={{ marginBottom: 20 }}
              // wrapperCol={{ offset: 8, span: 16 }}
            >
              <Checkbox>
                Remember me{" "}
                <Link href={"/auth/forgot-password"}>Forgot Your Password</Link>
              </Checkbox>
            </Form.Item>

            <Button type="primary" htmlType="submit" block disabled={isLoading}>
              Sign in
            </Button>
            <Col
              span={24}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 20,
              }}
            >
              <Space>
                <span>{`Don't have account?`} </span>
                <Link href={"/auth/signup"}>Signup</Link>
              </Space>
            </Col>
          </Form>
        </Col>
      </Row>
    </ConfigProvider>
  );
};
