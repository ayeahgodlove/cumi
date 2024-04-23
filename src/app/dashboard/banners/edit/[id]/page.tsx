"use client";

import { PlusOutlined } from "@ant-design/icons";
import { useUpload } from "@hooks/shared/upload.hook";
import { Edit, useForm } from "@refinedev/antd";
import { upload } from "@utils/upload";
import { Form, Input, Typography, Upload } from "antd";
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
            formData.append("image", fileList[0] as any);
            const response = await upload("banners", formData);
            form.setFieldValue("image", response);
            return response;
          }, [form, fileList,formData])}
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
        <Form.Item
          name={"image"}
          label="Image"
          required={true}
          rules={[
            { required: true, message: "This field is a required field" },
          ]}
          style={{ marginBottom: 10 }}
        >
          <Input disabled={true} />
        </Form.Item>
      </Form>
    </Edit>
  );
}
