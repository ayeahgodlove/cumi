"use client";

import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import { modules } from "@components/shared/react-quil-config";
import { BASE_URL_UPLOADS_MEDIA } from "@constants/api-url";
import { ICategory } from "@domain/models/category";
import { IMedia } from "@domain/models/media.model";
import { ITag } from "@domain/models/tag";
import { Create, useForm, useSelect } from "@refinedev/antd";
import { Col, Form, Image, Input, Row, Select, Space, Typography } from "antd";
import dynamic from "next/dynamic";

// import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export default function BlogPostCreate() {
  const { formProps, saveButtonProps } = useForm({});

  const { queryResult: mediaData, selectProps: mediaSelectProps } =
    useSelect<IMedia>({
      resource: "media",
    });

  const { queryResult: categoryData, selectProps } = useSelect<ICategory>({
    resource: "categories",
  });
  const { queryResult: tagData } = useSelect<ITag>({
    resource: "tags",
  });

  const categories = categoryData.data;
  const tags = tagData.data;
  const media = mediaData.data;

  return (
    <>
      <PageBreadCrumbs items={["Blog Posts", "Lists", "Create"]} />
      <Create saveButtonProps={saveButtonProps}>
        <Form {...formProps} layout="vertical">
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
            {/* <Input.TextArea rows={5} /> */}
            <ReactQuill
              modules={modules}
              theme="snow"
              onChange={(html) =>
                formProps.form?.setFieldValue("content", html)
              }
              placeholder="Enter content..."
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
                            src={`${BASE_URL_UPLOADS_MEDIA}/${d.imageUrl}`}
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
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              placeholder="Select image"
              size="large"
            />
          </Form.Item>
        </Form>
      </Create>
    </>
  );
}
