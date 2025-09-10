"use client";

import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import RichTextEditor from "@components/shared/rich-text-editor";
import { ICategory } from "@domain/models/category";
import { ICourse } from "@domain/models/course";
import { Create, useForm, useSelect } from "@refinedev/antd";
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
  Switch,
} from "antd";
import { useUpload, getImageUrlString } from "@hooks/shared/upload.hook";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function LessonCreate() {
  const { formProps, saveButtonProps } = useForm({});
  const searchParams = useSearchParams();
  const courseId = searchParams.get('courseId');
  const { queryResult: courseData, selectProps: courseSelectProps } =
    useSelect<ICourse>({
      resource: "courses",
    });
  const { queryResult: categoryData, selectProps } = useSelect<ICategory>({
    resource: "categories",
  });

  const categories = categoryData?.data?.data || [];
  const courses = courseData?.data?.data || [];

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

  // Pre-populate courseId if provided in URL
  useEffect(() => {
    if (courseId && formProps.form) {
      formProps.form.setFieldsValue({
        courseId: courseId
      });
    }
  }, [courseId, formProps.form]);

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
  return (
    <>
      <PageBreadCrumbs items={["Lessons", "Lists", "Create"]} />
      <Create saveButtonProps={saveButtonProps}>
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
                      ? courses.map((d) => {
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
                  >
                    <Input
                      size="large"
                      name="difficulty"
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              {/* New Lesson Fields */}
              <Row gutter={[8, 8]}>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="durationMinutes"
                    label="Duration (Minutes)"
                    style={{ marginBottom: 5 }}
                  >
                    <InputNumber
                      size="large"
                      style={{ width: "100%" }}
                      min={1}
                      placeholder="e.g., 30"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="lessonOrder"
                    label="Lesson Order"
                    style={{ marginBottom: 5 }}
                  >
                    <InputNumber
                      size="large"
                      style={{ width: "100%" }}
                      min={1}
                      defaultValue={1}
                      placeholder="e.g., 1"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="status"
                    label="Status"
                    style={{ marginBottom: 5 }}
                  >
                    <Select size="large" defaultValue="draft">
                      <Select.Option value="draft">Draft</Select.Option>
                      <Select.Option value="published">Published</Select.Option>
                      <Select.Option value="archived">Archived</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[8, 8]}>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="lessonType"
                    label="Lesson Type"
                    style={{ marginBottom: 5 }}
                  >
                    <Select size="large" defaultValue="text">
                      <Select.Option value="video">Video</Select.Option>
                      <Select.Option value="text">Text</Select.Option>
                      <Select.Option value="audio">Audio</Select.Option>
                      <Select.Option value="practical">Practical</Select.Option>
                      <Select.Option value="discussion">Discussion</Select.Option>
                      <Select.Option value="assignment">Assignment</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="estimatedCompletionTime"
                    label="Est. Completion Time (min)"
                    style={{ marginBottom: 5 }}
                  >
                    <InputNumber
                      size="large"
                      style={{ width: "100%" }}
                      min={1}
                      placeholder="e.g., 45"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="authorName"
                    label="Author Name"
                    style={{ marginBottom: 5 }}
                    rules={[
                      {
                        required: true,
                        message: "Author name is required",
                      },
                    ]}
                  >
                    <Input size="large" placeholder="Author name" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[8, 8]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="videoUrl"
                    label="Video URL"
                    style={{ marginBottom: 5 }}
                  >
                    <Input size="large" placeholder="https://..." />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="audioUrl"
                    label="Audio URL"
                    style={{ marginBottom: 5 }}
                  >
                    <Input size="large" placeholder="https://..." />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[8, 8]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="downloadMaterials"
                    label="Download Materials URL"
                    style={{ marginBottom: 5 }}
                  >
                    <Input size="large" placeholder="https://..." />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="language"
                    label="Language"
                    style={{ marginBottom: 5 }}
                  >
                    <Select size="large" placeholder="Select language">
                      <Select.Option value="french">French</Select.Option>
                      <Select.Option value="english">English</Select.Option>
                      <Select.Option value="both">Both</Select.Option>
                      <Select.Option value="fulfulde">Fulfulde</Select.Option>
                      <Select.Option value="ewondo">Ewondo</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[8, 8]}>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="isFreePreview"
                    label="Free Preview"
                    valuePropName="checked"
                    style={{ marginBottom: 5 }}
                  >
                    <Switch size="default" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="requiresCompletion"
                    label="Requires Completion"
                    valuePropName="checked"
                    style={{ marginBottom: 5 }}
                  >
                    <Switch size="default" defaultChecked />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="rating"
                    label="Rating"
                    style={{ marginBottom: 5 }}
                  >
                    <InputNumber
                      size="large"
                      style={{ width: "100%" }}
                      min={1}
                      max={5}
                      placeholder="1-5"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="practicalExamples"
                label="Practical Examples"
                style={{ marginBottom: 5 }}
              >
                <Input.TextArea
                  size="large"
                  rows={3}
                  placeholder="Local/Cameroon-specific examples..."
                />
              </Form.Item>

              <Form.Item
                name="resourcesNeeded"
                label="Resources Needed"
                style={{ marginBottom: 5 }}
              >
                <Input.TextArea
                  size="large"
                  rows={3}
                  placeholder="Required materials or tools..."
                />
              </Form.Item>
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
                  onRemove={handleRemove}
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
                      ? categories.map((d) => {
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
      </Create>
    </>
  );
}
