"use client";

import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Upload, message, Select } from "antd";
import { useUpload, getImageUrlFromEvent, getImageUrlString } from "@hooks/shared/upload.hook";
import { useEffect } from "react";

export default function ServiceCreate() {
  const { formProps, saveButtonProps } = useForm({});

  const { fileList, setFileList, handleUploadChange, beforeUpload, handleRemove } = useUpload({
    maxSize: 1024 * 1024, // 1MB
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
    form: formProps.form,
    fieldName: 'imageUrl',
    onSuccess: (response) => {
      // This will be handled in useEffect to prevent setState in render
    },
    onError: (error) => {
      message.error(error);
    }
  });

  // Handle form field updates in useEffect to prevent setState in render
  useEffect(() => {
    if (fileList && fileList.length > 0) {
      const imageUrl = getImageUrlString(fileList);
      if (imageUrl) {
        formProps.form?.setFieldsValue({
          imageUrl: imageUrl
        });
      }
    }
  }, [fileList, formProps.form]);
  return (
    <>
      <PageBreadCrumbs items={["Services", "Lists", "Create"]} />
      <Create saveButtonProps={saveButtonProps}>
        <Form {...formProps} layout="vertical" form={formProps.form} size="large">
          <Form.Item
            name={"title"}
            label="Title"
            required={true}
            rules={[
              { required: true, message: "This field is a required field" },
            ]}
            style={{ marginBottom: 10 }}
          >
            <Input size="large" />
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
            <Input.TextArea size="large" />
          </Form.Item>

          <Form.Item
            name={"items"}
            label="Service Items"
            tooltip="Add the specific services or features you offer. Press Enter to add each item."
            style={{ marginBottom: 15 }}
          >
            <Select
              mode="tags"
              size="large"
              placeholder="Add service items (e.g., Web Development, Mobile Apps)"
              style={{ width: '100%' }}
              tokenSeparators={[',']}
            />
          </Form.Item>

            <Form.Item
              name={"imageUrl"}
              label="Image"
              required={true}
              rules={[
                { required: true, message: "This field is a required field" },
                {
                  validator: (_, value) => {
                    // Check if we have a valid URL string
                    if (typeof value === 'string' && value.trim() !== '') {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Please upload an image'));
                  }
                }
              ]}
              style={{ marginBottom: 10 }}
            >
              <Upload.Dragger
                name="file"
                action="/api/uploads"
                listType="picture"
                maxCount={1}
                multiple={false}
                fileList={Array.isArray(fileList) ? fileList : []}
                onChange={handleUploadChange}
                beforeUpload={beforeUpload}
                onRemove={handleRemove}
              >
                <p className="ant-upload-text">Drag & drop a service image here</p>
                <p className="ant-upload-hint">
                  Support for single upload. Maximum file size: 1MB
                </p>
              </Upload.Dragger>
            </Form.Item>
        </Form>
      </Create>
    </>
  );
}
