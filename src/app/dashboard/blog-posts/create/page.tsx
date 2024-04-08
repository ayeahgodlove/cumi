"use client";

import { PlusOutlined } from "@ant-design/icons";
import { modules } from "@components/shared/react-quil-config";
import { useUpload } from "@hooks/shared/upload.hook";
import { Create, useForm, useSelect } from "@refinedev/antd";
import { Form, Input, Select, Upload } from "antd";
import ReactQuill from "react-quill";

export default function BlogPostCreate() {
  const { formProps, saveButtonProps } = useForm({});
  const { fileList, onChangeUpload, onRemove, beforeUpload, progress } =
  useUpload();

const uploadButton = (
  <button style={{ border: 0, background: "none" }} type="button">
    <PlusOutlined />
    <div style={{ marginTop: 8 }}>Upload</div>
  </button>
);

  const { selectProps: categorySelectProps } = useSelect({
    resource: "categories",
  });

  return (
    <Create saveButtonProps={saveButtonProps}>
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
              {fileList.length >1 ? null : uploadButton}
            </Upload>
          </>
        </Form.Item>
        <Form.Item
          label={"Title"}
          name={["title"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          style={{ marginBottom: 3 }}
          rules={[
            {
              required: true,
              message: "Description is required",
            },
          ]}
        >
          <Input.TextArea />
        </Form.Item>

        <Form.Item
          label={"Content"}
          name="content"
          rules={[
            {
              required: true,
            },
          ]}
        >
          {/* <Input.TextArea rows={5} /> */}
          <ReactQuill
            modules={modules}
            theme="snow"
            onChange={(html) => formProps.form?.setFieldValue("content", html)}
            placeholder="Enter content..."
          />
        </Form.Item>
        <Form.Item
          label={"Category"}
          name={["category", "id"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select {...categorySelectProps} />
        </Form.Item>
        <Form.Item
          label={"Status"}
          name={["status"]}
          initialValue={"draft"}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            defaultValue={"draft"}
            options={[
              { value: "draft", label: "Draft" },
              { value: "published", label: "Published" },
              { value: "rejected", label: "Rejected" },
            ]}
            style={{ width: 120 }}
          />
        </Form.Item>
      </Form>
    </Create>
  );
}
