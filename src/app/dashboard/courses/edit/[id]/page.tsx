"use client";

import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import { ICategory } from "@domain/models/category";
import { Edit, useForm, useSelect } from "@refinedev/antd";
import { Col, Form, Input, Row, Select, Upload, message } from "antd";
import { useUpload, getImageUrlFromEvent, getImageUrlString } from "@hooks/shared/upload.hook";
import { useEffect, useState } from "react";

export default function CourseEdit() {
  const { formProps, saveButtonProps, queryResult } = useForm({});
  const [initialImageUrl, setInitialImageUrl] = useState<string>("");

  const { queryResult: categoryData, selectProps } = useSelect<ICategory>({
    resource: "categories",
  });

  const categories = categoryData?.data || [];

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
      <PageBreadCrumbs items={["Courses", "Lists", "Edit"]} />
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
            style={{ marginBottom: 10 }}
          >
            <Input.TextArea size="large" rows={3} />
          </Form.Item>

          <Row gutter={[8, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                label={"Category"}
                name={"categoryId"}
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Select
                  showSearch
                  onChange={selectProps.onChange}
                  onSearch={selectProps.onSearch}
                  filterOption={selectProps.filterOption}
                  options={
                    Array.isArray(categories)
                      ? categories.map((d: ICategory) => {
                          return {
                            label: d.name,
                            value: d.id,
                          };
                        })
                      : []
                  }
                  placeholder="Select a related category"
                  size="large"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name={"authorName"}
                label="Author"
                required={true}
                rules={[
                  { required: true, message: "This field is a required field" },
                ]}
                style={{ marginBottom: 10 }}
              >
                <Input size="large" />
              </Form.Item>
            </Col>
          </Row>

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
              <p className="ant-upload-text">Drag & drop a course image here</p>
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
