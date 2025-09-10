"use client";

import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Upload, message, Select } from "antd";
import { useUpload, getImageUrlFromEvent, getImageUrlString } from "@hooks/shared/upload.hook";
import { useEffect, useState } from "react";

export default function ServiceEdit() {
  const { formProps, saveButtonProps, form } = useForm({});
  const [initialImageUrl, setInitialImageUrl] = useState<string>("");

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

  // Initialize fileList with existing image when form data is loaded
  useEffect(() => {
    const currentImageUrl = formProps.form?.getFieldValue('imageUrl');
    if (currentImageUrl && typeof currentImageUrl === 'string' && currentImageUrl.trim() !== '') {
      setInitialImageUrl(currentImageUrl);
      // Convert existing image URL to fileList format
      const existingFile = {
        uid: '-1',
        name: 'existing-image',
        status: 'done',
        url: currentImageUrl,
        thumbUrl: currentImageUrl,
      };
      setFileList([existingFile]);
    }
  }, [formProps.form, setFileList]);

  // Parse existing items data when form loads
  useEffect(() => {
    const currentItems = formProps.form?.getFieldValue('items');
    if (currentItems) {
      let parsedItems = currentItems;
      
      // If items is a string, try to parse it as JSON
      if (typeof currentItems === 'string') {
        try {
          parsedItems = JSON.parse(currentItems);
        } catch (error) {
          console.warn('Failed to parse items JSON:', error);
          parsedItems = [];
        }
      }
      
      // Ensure it's an array
      if (Array.isArray(parsedItems)) {
        formProps.form?.setFieldsValue({
          items: parsedItems
        });
      }
    }
  }, [formProps.form]);

  const handleRemoveWithCleanup = async (file: any) => {
    // If removing existing file, delete it from server
    if (file.url === initialImageUrl && initialImageUrl) {
      try {
        // Extract filename from URL and delete from server
        const filename = initialImageUrl.split('/').pop();
        if (filename) {
          await fetch(`/api/uploads/${filename}`, {
            method: 'DELETE',
          });
        }
        message.success('File deleted successfully');
      } catch (error) {
        console.error('Error deleting file:', error);
        message.warning('File removed from form but may still exist on server');
      }
    }
    
    // Use the hook's handleRemove for uploaded files
    return await handleRemove(file);
  };

  return (
    <>
      <PageBreadCrumbs items={["Services", "Lists", "Edit"]} />
      <Edit saveButtonProps={saveButtonProps}>
        <Form {...formProps} layout="vertical" form={formProps.form}>
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
              onRemove={handleRemoveWithCleanup}
            >
              <p className="ant-upload-text">Drag & drop a service image here</p>
              <p className="ant-upload-hint">
                Support for single upload. Maximum file size: 1MB
              </p>
            </Upload.Dragger>
          </Form.Item>
        </Form>
      </Edit>
    </>
  );
}
