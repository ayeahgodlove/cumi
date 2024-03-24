"use client";

import { PlusOutlined } from "@ant-design/icons";
import { useUpload } from "@hooks/shared/upload.hook";
import { Edit, useForm } from "@refinedev/antd";
import {  Col, DatePicker, Form, Input, Row, Upload } from "antd";

export default function CategoryEdit() {
  const { formProps, saveButtonProps } = useForm({});
  const { fileList, onChangeUpload, onRemove, beforeUpload, progress } =
    useUpload();

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );
  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          name="imageUrl"
          label="Upload"
          style={{ marginBottom: 15 }}
          rules={[
            {
              required: true,
              message: "Upload is required",
            },
          ]}
        >
          <>
            <Upload
              maxCount={1}
              listType="picture-card"
              beforeUpload={beforeUpload}
              onChange={onChangeUpload}
              onRemove={onRemove}
              progress={progress}
              fileList={fileList}
            >
              {fileList.length >= 8 ? null : uploadButton}
            </Upload>
          </>
        </Form.Item>

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
          name={"description"}
          label="Description"
          required={true}
          rules={[
            { required: true, message: "This field is a required field" },
          ]}
          style={{ marginBottom: 10 }}
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
              {/* <ConfigProvider locale={enUS as any}> */}
              <DatePicker
                placeholder="Enter event date"
                name="eventDate"
                format={"DD/MM/YYYY"}
                style={{ width: "100%" }}
              />
              {/* </ConfigProvider> */}
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
