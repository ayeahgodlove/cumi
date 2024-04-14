"use client";

import { Edit, useForm } from "@refinedev/antd";
import { Col, DatePicker, Form, Input, Row, Upload } from "antd";

export default function CategoryEdit() {
  const { formProps, saveButtonProps } = useForm({});

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          name={"title"}
          label="Title"
          required={true}
          rules={[
            { required: true, message: "This field is a required field" },
          ]}
          style={{ marginBottom: 10 }}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={"icon"}
          label="Icon"
          required={true}
          rules={[
            { required: true, message: "This field is a required field" },
          ]}
          style={{ marginBottom: 10 }}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={"description"}
          label="Description"
          required={true}
          rules={[
            { required: true, message: "This field is a required field" },
          ]}
          style={{ marginBottom: 15 }}
        >
          <Input.TextArea />
        </Form.Item>
        <Row gutter={[8, 8]}>
          <Col xs={24} md={12}>
            <Form.Item
              name={"eventDate"}
              label="Event Date"
              required={true}
              rules={[
                { required: true, message: "This field is a required field" },
              ]}
              style={{ marginRight: 10 }}
            >
              <DatePicker
                placeholder="Enter event date"
                name="eventDate"
                format={"DD/MM/YYYY"}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name={"location"}
              label="Location"
              required={true}
              rules={[
                { required: true, message: "This field is a required field" },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Edit>
  );
}
