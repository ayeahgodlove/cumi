"use client";

import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Upload, message } from "antd";
import { useUpload, deleteUploadedFile, getImageUrlFromEvent } from "@hooks/shared/upload.hook";
import { useEffect, useState } from "react";

export default function MediaEdit() {
  const { formProps, saveButtonProps, queryResult } = useForm({});
  const [initialImageUrl, setInitialImageUrl] = useState<string>("");
  
  const { fileList, setFileList, handleUploadChange, beforeUpload, handleRemove } = useUpload({
    maxSize: 1024 * 1024, // 1MB
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
    form: formProps.form,
    fieldName: 'imageUrl',
    onSuccess: (response) => {
      // Update form with the uploaded file URL
      formProps.form?.setFieldsValue({
        imageUrl: response.url
      });
    },
    onError: (error) => {
      message.error(error);
    }
  });

  // Set initial file list when data loads
  useEffect(() => {
    if (queryResult?.data?.data?.imageUrl) {
      const imageUrl = queryResult.data.data.imageUrl;
      setInitialImageUrl(imageUrl);
      
      // Create file list item for existing image
      const existingFile = {
        uid: '-1',
        name: imageUrl.split('/').pop() || 'image',
        status: 'done',
        url: imageUrl,
        response: { url: imageUrl }
      };
      setFileList([existingFile]);
    }
  }, [queryResult?.data?.data?.imageUrl, setFileList]);


  const handleRemoveWithCleanup = async (file: any) => {
    // If removing existing file, delete it from server
    if (file.url === initialImageUrl && initialImageUrl) {
      const deleted = await deleteUploadedFile(initialImageUrl);
      if (deleted) {
        message.success('File deleted successfully');
      } else {
        message.warning('File removed from form but may still exist on server');
      }
    }
    
    // Use the hook's handleRemove for uploaded files
    return await handleRemove(file);
  };

  return (
    <>
      <PageBreadCrumbs items={["Media", "Lists", "Edit"]} />
      <Edit saveButtonProps={saveButtonProps}>
        <Form {...formProps} layout="vertical" form={formProps.form}>
          <Form.Item
            label={"Title"}
            name={["title"]}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            name="imageUrl"
            label="Upload Image"
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
              <p className="ant-upload-text">Drag & drop a file in this area</p>
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
