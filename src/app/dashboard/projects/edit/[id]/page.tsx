"use client";

import { PlusOutlined } from "@ant-design/icons";
import { useUpload } from "@hooks/shared/upload.hook";
import { Edit, useForm } from "@refinedev/antd";
import { upload } from "@utils/upload";
import { Col, Form, Input, Row, Typography, Upload } from "antd";
import { useCallback } from "react";

export default function CategoryEdit() {
  const { formProps, saveButtonProps, form } = useForm({});
  const { fileList, handlePreview, onRemove, beforeUpload, progress } =
    useUpload();

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  const formData = new FormData();
  return (
    <Edit saveButtonProps={saveButtonProps}>
      <>
        <Typography.Title level={5}>Upload Image</Typography.Title>
        <Upload
          name="image"
          maxCount={1}
          listType="picture-card"
          beforeUpload={beforeUpload}
          onRemove={onRemove}
          progress={progress}
          fileList={fileList}
          onPreview={handlePreview}
          action={useCallback(async () => {
            formData.append("imageUrl", fileList[0] as any);
            const response = await upload("projects", formData);
            form.setFieldValue("imageUrl", response);
            return response;
          }, [form, fileList])}
        >
          {fileList.length > 1 ? null : uploadButton}
        </Upload>
      </>
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
        <Row gutter={[8, 8]}>
          <Col xs={24} md={12}>
            <Form.Item
              name={"githubUrl"}
              label="Github Url"
              required={true}
              rules={[
                { required: true, message: "This field is a required field" },
              ]}
            >
              <Input type="website" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name={"deployUrl"}
              label="Deploy Url"
              required={true}
              rules={[
                { required: true, message: "This field is a required field" },
              ]}
            >
              <Input type="website" />
            </Form.Item>
          </Col>
        </Row>
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
        <Col xs={24} md={24}>
          <Form.Item
            name={"imageUrl"}
            label="Image"
            required={true}
            rules={[
              { required: true, message: "This field is a required field" },
            ]}
            style={{ marginBottom: 10 }}
          >
            <Input disabled={true} />
          </Form.Item>
        </Col>
      </Form>
    </Edit>
  );
}
