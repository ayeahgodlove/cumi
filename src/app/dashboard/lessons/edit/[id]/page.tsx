"use client";

import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import RichTextEditor from "@components/shared/rich-text-editor";
import { ICategory } from "@domain/models/category";
import { ICourse } from "@domain/models/course";
import { Edit, useForm, useSelect } from "@refinedev/antd";
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Upload,
  message,
} from "antd";
import { useUpload, deleteUploadedFile } from "@hooks/shared/upload.hook";
import { useEffect, useState } from "react";

export default function LessonEdit() {
  const { formProps, saveButtonProps, queryResult } = useForm({});
  const [initialImageUrl, setInitialImageUrl] = useState<string>("");

  const { queryResult: courseData, selectProps: courseSelectProps } =
    useSelect<ICourse>({
      resource: "courses",
    });

  const { queryResult: categoryData, selectProps } = useSelect<ICategory>({
    resource: "categories",
  });

  const categories = categoryData?.data || [];
  const courses = courseData?.data || [];

  const { fileList, setFileList, handleUploadChange, beforeUpload, handleRemove } = useUpload({
    maxSize: 1024 * 1024, // 1MB
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
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

  // Custom function to extract URL from file list for form submission
  const getImageUrlFromEvent = (e: any) => {
    if (Array.isArray(e)) {
      // If it's an array, get the URL from the first file
      const file = e[0];
      if (file?.response?.url) {
        return file.response.url;
      }
      if (file?.url) {
        return file.url;
      }
    }
    return undefined;
  };

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
      <PageBreadCrumbs items={["Courses", "Lists", "Edit"]} />
      <Edit saveButtonProps={saveButtonProps}>
        <Form {...formProps} layout="vertical" form={formProps.form}>
          <Row gutter={[8, 8]}>
            <Col xs={24} md={12}>
              <Form.Item
                name="title"
                label="Title"
                style={{ marginBottom: 5 }}
                rules={[
                  {
                    required: true,
                    message: "Title is required",
                  },
                ]}
              >
                <Input size="large" />
              </Form.Item>
              <Form.Item
                name="courseId"
                label="Course"
                style={{ marginBottom: 5 }}
              >
                <Select
                  {...courseSelectProps}
                  showSearch
                  filterOption={(input: any, option: any) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={
                    Array.isArray(courses)
                      ? courses.map((d: any) => {
                          return {
                            label: d.title,
                            value: d.id,
                          };
                        })
                      : []
                  }
                  placeholder="Select a related category"
                  size="large"
                />
              </Form.Item>
              <Form.Item
                name="url"
                label="Url"
                style={{ marginBottom: 5 }}
                rules={[
                  {
                    required: true,
                    message: "Url is required",
                  },
                ]}
              >
                <Input size="large" />
              </Form.Item>
              <Row gutter={[8, 8]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="duration"
                    label="Duration"
                    rules={[
                      {
                        required: true,
                        message: "duration is required",
                      },
                    ]}
                    style={{ marginBottom: 5 }}
                  >
                    <InputNumber
                      size="large"
                      name="duration"
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    name="difficulty"
                    label="Difficulty"
                    rules={[
                      {
                        required: true,
                        message: "Difficulty is required",
                      },
                    ]}
                    style={{ marginBottom: 5 }}
                  >
                    <Input
                      size="large"
                      name="difficulty"
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="description"
                label="Description"
                rules={[
                  {
                    required: true,
                    message: "Description is required",
                  },
                ]}
              >
                <Input.TextArea size="large" rows={6} />
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
                  <p className="ant-upload-text">Drag & drop a lesson image here</p>
                  <p className="ant-upload-hint">
                    Support for single upload. Maximum file size: 1MB
                  </p>
                </Upload.Dragger>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name={"content"}
            label="Content"
            rules={[
              {
                required: true,
                message: "Content is required",
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

          <Row gutter={[8, 8]} style={{ marginBottom: 15 }}>
            <Col xs={24} md={8}>
              <Form.Item
                name="category"
                label="Category"
                style={{ marginBottom: 3 }}
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
            <Col xs={24} md={8}>
              <Form.Item
                name="language"
                label="Language"
                style={{ marginBottom: 3 }}
              >
                <Select
                  size="large"
                  options={[
                    { value: "01", label: "English" },
                    { value: "02", label: "French" },
                    { value: "03", label: "Spanish" },
                  ]}
                  style={{ width: "100%" }}
                  placeholder="Type to add language"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="author"
                label="Author"
                style={{ marginBottom: 3 }}
              >
                <Input
                  name="author"
                  style={{ width: "100%" }}
                  placeholder="Type to add author"
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[8, 8]}>
            <Form.List
              name="prerequisites"
              rules={[
                {
                  validator: async (_, prerequisites) => {
                    if (!prerequisites || prerequisites.length < 1) {
                      return Promise.reject(
                        new Error("At least 1 prerequisites")
                      );
                    } else {
                      return Promise.resolve(); // Resolve the Promise when validation passes
                    }
                  },
                },
              ]}
            >
              {(fields, { add, remove }, { errors }) => (
                <Col xs={24} md={8}>
                  {fields.map((field, index) => (
                    <Form.Item
                      label={index === 0 ? "Prerequisites" : ""}
                      required={false}
                      key={field.key}
                      style={{ marginBottom: 10 }}
                    >
                      <div style={{ display: "flex" }}>
                        <Form.Item
                          {...field}
                          validateTrigger={["onChange", "onBlur"]}
                          rules={[
                            {
                              required: true,
                              whitespace: true,
                              message:
                                "Please input answer or delete this field.",
                            },
                          ]}
                          style={{ width: "100%", marginBottom: 5 }}
                        >
                          <Input size="large" placeholder="prerequisite" />
                        </Form.Item>
                        {fields.length > 1 ? (
                          <div style={{ marginLeft: 5 }}>
                            <MinusCircleOutlined
                              className="dynamic-delete-button"
                              onClick={() => remove(field.name)}
                              style={{ fontSize: 20, opacity: 0.6 }}
                            />
                          </div>
                        ) : null}
                      </div>
                    </Form.Item>
                  ))}
                  <Form.Item style={{ marginBottom: 15 }}>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      icon={<PlusOutlined />}
                      size="large"
                    >
                      Add prerequisite
                    </Button>
                    <Form.ErrorList errors={errors} />
                  </Form.Item>
                </Col>
              )}
            </Form.List>

            <Form.List
              name="objectives"
              rules={[
                {
                  validator: async (_, objectives) => {
                    if (!objectives || objectives.length < 1) {
                      return Promise.reject(new Error("At least 1 objectives"));
                    } else {
                      return Promise.resolve(); // Resolve the Promise when validation passes
                    }
                  },
                },
              ]}
            >
              {(fields, { add, remove }, { errors }) => (
                <Col xs={24} md={8}>
                  {fields.map((field, index) => (
                    <Form.Item
                      label={index === 0 ? "objectives" : ""}
                      required={false}
                      key={field.key}
                      style={{ marginBottom: 10 }}
                    >
                      <div style={{ display: "flex" }}>
                        <Form.Item
                          {...field}
                          validateTrigger={["onChange", "onBlur"]}
                          rules={[
                            {
                              required: true,
                              whitespace: true,
                              message:
                                "Please input answer or delete this field.",
                            },
                          ]}
                          style={{ width: "100%", marginBottom: 5 }}
                        >
                          <Input size="large" placeholder="objectives" />
                        </Form.Item>
                        {fields.length > 1 ? (
                          <div style={{ marginLeft: 5 }}>
                            <MinusCircleOutlined
                              className="dynamic-delete-button"
                              onClick={() => remove(field.name)}
                              style={{ fontSize: 20, opacity: 0.6 }}
                            />
                          </div>
                        ) : null}
                      </div>
                    </Form.Item>
                  ))}
                  <Form.Item style={{ marginBottom: 15 }}>
                    <Button
                      type="dashed"
                      size="large"
                      onClick={() => add()}
                      icon={<PlusOutlined />}
                    >
                      Add objective
                    </Button>
                    <Form.ErrorList errors={errors} />
                  </Form.Item>
                </Col>
              )}
            </Form.List>

            <Form.List
              name="keywords"
              rules={[
                {
                  validator: async (_, keywords) => {
                    if (!keywords || keywords.length < 1) {
                      return Promise.reject(new Error("At least 1 keywords"));
                    } else {
                      return Promise.resolve(); // Resolve the Promise when validation passes
                    }
                  },
                },
              ]}
            >
              {(fields, { add, remove }, { errors }) => (
                <Col xs={24} md={8}>
                  {fields.map((field, index) => (
                    <Form.Item
                      label={index === 0 ? "keywords" : ""}
                      required={false}
                      key={field.key}
                      style={{ marginBottom: 10 }}
                    >
                      <div style={{ display: "flex" }}>
                        <Form.Item
                          {...field}
                          validateTrigger={["onChange", "onBlur"]}
                          rules={[
                            {
                              required: true,
                              whitespace: true,
                              message:
                                "Please input answer or delete this field.",
                            },
                          ]}
                          style={{ width: "100%", marginBottom: 5 }}
                        >
                          <Input size="large" placeholder="keywords" />
                        </Form.Item>
                        {fields.length > 1 ? (
                          <div style={{ marginLeft: 5 }}>
                            <MinusCircleOutlined
                              className="dynamic-delete-button"
                              onClick={() => remove(field.name)}
                              style={{ fontSize: 20, opacity: 0.6 }}
                            />
                          </div>
                        ) : null}
                      </div>
                    </Form.Item>
                  ))}
                  <Form.Item style={{ marginBottom: 15 }}>
                    <Button
                      size="large"
                      type="dashed"
                      onClick={() => add()}
                      icon={<PlusOutlined />}
                    >
                      Add keyword
                    </Button>
                    <Form.ErrorList errors={errors} />
                  </Form.Item>
                </Col>
              )}
            </Form.List>
          </Row>
        </Form>
      </Edit>
    </>
  );
}
