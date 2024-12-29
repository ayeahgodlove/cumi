"use client";

import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import { modules } from "@components/shared/react-quil-config";
import { API_URL_UPLOADS_MEDIA } from "@constants/api-url";
import { ICategory } from "@domain/models/category";
import { ICourse } from "@domain/models/course";
import { IMedia } from "@domain/models/media.model";
import { Create, useForm, useSelect } from "@refinedev/antd";
import {
  Button,
  Col,
  Form,
  Image,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Typography,
} from "antd";
import dynamic from "next/dynamic";
// import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";


const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export default function LessonCreate() {
  const { formProps, saveButtonProps } = useForm({});
  const { queryResult: courseData, selectProps: courseSelectProps } =
    useSelect<ICourse>({
      resource: "courses",
    });
  const { queryResult: categoryData, selectProps } = useSelect<ICategory>({
    resource: "categories",
  });
  const { queryResult: mediaData, selectProps: mediaSelectProps } =
    useSelect<IMedia>({
      resource: "media",
    });

  const categories = categoryData.data;
  const courses = courseData.data;
  const media = mediaData.data;
  return (
    <>
      <PageBreadCrumbs items={["Lessons", "Lists", "Create"]} />
      <Create saveButtonProps={saveButtonProps}>
        <Form {...formProps} layout="vertical">
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
                    courses
                      ? courses.data.map((d) => {
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
                ]}
                style={{ marginBottom: 10 }}
              >
                <Select
                  {...mediaSelectProps}
                  showSearch
                  options={
                    media
                      ? media.data.map((d) => {
                          return {
                            label: d.title,
                            value: d.imageUrl,
                            emoji: (
                              <Image
                                src={`${API_URL_UPLOADS_MEDIA}/${d.imageUrl}`}
                                alt={d?.title}
                                height={50}
                                width={60}
                              />
                            ),
                            desc: (
                              <Typography.Title level={5}>
                                {d.title}
                              </Typography.Title>
                            ),
                          };
                        })
                      : []
                  }
                  optionRender={(option) => (
                    <Space>
                      <span role="img" aria-label={option.data.label}>
                        {option.data.emoji}
                      </span>
                      {option.data.desc}
                    </Space>
                  )}
                  filterOption={(input: any, option: any) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  placeholder="Select image"
                  size="large"
                />
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
            <ReactQuill
              modules={modules}
              theme="snow"
              onChange={(html) =>
                formProps.form?.setFieldValue("content", html)
              }
              placeholder="Enter content..."
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
                    categories
                      ? categories.data.map((d) => {
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
