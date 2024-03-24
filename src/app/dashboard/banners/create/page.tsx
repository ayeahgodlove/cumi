"use client";

import { PlusOutlined } from "@ant-design/icons";
import { useUpload } from "@hooks/shared/upload.hook";
import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Upload } from "antd";

export default function CategoryCreate() {
  const { formProps, saveButtonProps } = useForm({});
  const {
    fileList,
    onChangeUpload,
    onRemove,
    beforeUpload,
    progress,
    handlePreview,
  } = useUpload();

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          name="image"
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
              onPreview={handlePreview}
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
          name={"subTitle"}
          label="Description"
          required={true}
          rules={[
            { required: true, message: "This field is a required field" },
          ]}
          style={{ marginBottom: 10 }}
        >
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Create>
  );
}
