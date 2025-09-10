"use client";

import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import { ITag } from "@domain/models/tag";
import { Edit, useForm, useSelect } from "@refinedev/antd";
import {
  Col,
  Form,
  Input,
  Row,
  DatePicker,
  Select,
  Upload,
  message,
} from "antd";
import dayjs from "dayjs";
import { useUpload, getImageUrlFromEvent, getImageUrlString } from "@hooks/shared/upload.hook";
import { useEffect, useState } from "react";

export default function EventEdit() {
  const { formProps, saveButtonProps, queryResult } = useForm({});
  const [initialImageUrl, setInitialImageUrl] = useState<string>("");

  const { queryResult: tagData } = useSelect<ITag>({
    resource: "tags",
  });

  const tags = tagData.data;

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

  // Set initial file list when data is loaded
  useEffect(() => {
    if (queryResult?.data?.data?.imageUrl) {
      const imageUrl = queryResult.data.data.imageUrl;
      setInitialImageUrl(imageUrl);
      
      // Set initial file list for display
      setFileList([{
        uid: '-1',
        name: 'current-image',
        status: 'done',
        url: imageUrl,
        response: { url: imageUrl }
      }]);
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
      <PageBreadCrumbs items={["Events", "Lists", "Edit"]} />
      <Edit saveButtonProps={saveButtonProps}>
        <Form
          {...formProps}
          layout="vertical"
          initialValues={{
            ...formProps.initialValues,
            eventDate: dayjs(formProps.initialValues?.eventDate),
          }}
        >
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
            <Input.TextArea size="large" />
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
                <DatePicker
                  placeholder="Enter event date"
                  name="eventDate"
                  format={"DD/MM/YYYY"}
                  style={{ width: "100%" }}
                  size="large"
                />
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
                <Input size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} md={24}>
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
                  <p className="ant-upload-text">Drag & drop an event image here</p>
                  <p className="ant-upload-hint">
                    Support for single upload. Maximum file size: 1MB
                  </p>
                </Upload.Dragger>
              </Form.Item>
            </Col>

            <Col xs={24} md={24}>
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
                  options={
                    tags
                      ? tags.data.map((d) => {
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
            </Col>
          </Row>
        </Form>
      </Edit>
    </>
  );
}
