"use client";

import { PlusOutlined } from "@ant-design/icons";
import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import RichTextEditor from "@components/shared/rich-text-editor";
import { ICategory } from "@domain/models/category";
import { ITag } from "@domain/models/tag";
import { Edit, useForm, useSelect } from "@refinedev/antd";
import {
  Col,
  Form,
  Input,
  message,
  Row,
  Select,
  Space,
  Typography,
  Upload,
} from "antd";
import { useUpload, deleteUploadedFile, getImageUrlFromEvent } from "@hooks/shared/upload.hook";
import { useEffect, useState } from "react";

export default function BlogPostEdit() {
  const { formProps, saveButtonProps, queryResult } = useForm({});
  const [initialImageUrl, setInitialImageUrl] = useState<string>("");

  const { queryResult: categoryData, selectProps: categoryProps } =
    useSelect<ICategory>({
      resource: "categories",
    });
  const { queryResult: tagData, selectProps: tagProps } = useSelect<ITag>({
    resource: "tags",
  });

  const categories = categoryData?.data || [];
  const tags = tagData?.data || [];

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
      <PageBreadCrumbs items={["Blog Posts", "Lists", "Edit"]} />
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
            <Input.TextArea size="large" />
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
            <RichTextEditor
              value={formProps.form?.getFieldValue("content")}
              onChange={(html) =>
                formProps.form?.setFieldValue("content", html)
              }
              placeholder="Enter content..."
              height={400}
            />
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
                  {...categoryProps}
                  showSearch
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
                    { value: "DRAFT", label: "Draft" },
                    { value: "PUBLISHED", label: "Published" },
                    { value: "REJECTED", label: "Rejected" },
                  ]}
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label={"Tags"}
            name={["tags"]}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              {...tagProps}
              showSearch
              options={
                Array.isArray(tags)
                  ? tags.map((d: any) => {
                      return {
                        label: d.name,
                        value: d.id,
                      };
                    })
                  : []
              }
              mode="tags"
              placeholder="Select related tags"
              size="large"
            />
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
            <Upload
              listType="picture-card"
              beforeUpload={beforeUpload}
              onChange={handleUploadChange}
              action="/api/uploads"
              maxCount={1}
              showUploadList={{ showPreviewIcon: true }}
              onRemove={handleRemoveWithCleanup}
              fileList={Array.isArray(fileList) ? fileList : []}
            >
              {fileList.length < 1 && (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>
        </Form>
      </Edit>
    </>
  );
}
