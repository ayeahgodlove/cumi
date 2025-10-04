"use client";

import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import RichTextEditor from "@components/shared/rich-text-editor";
import ImageUploadField from "@components/shared/image-upload-field.component";
import { ICategory } from "@domain/models/category";
import { ITag } from "@domain/models/tag";
import { Edit, useForm, useSelect } from "@refinedev/antd";
import {
  Col,
  Form,
  Input,
  Row,
  Select,
  Space,
  Typography,
} from "antd";

export default function BlogPostEdit() {
  const { formProps, saveButtonProps, queryResult } = useForm({});

  const { queryResult: categoryData, selectProps: categoryProps } =
    useSelect<ICategory>({
      resource: "categories",
    });
  const { queryResult: tagData, selectProps: tagProps } = useSelect<ITag>({
    resource: "tags",
  });

  const categories = categoryData?.data || [];
  const tags = tagData?.data || [];

  return (
    <>
      <PageBreadCrumbs items={["Blog Posts", "Lists", "Edit"]} />
      <Edit saveButtonProps={saveButtonProps}>
        <Form {...formProps} layout="vertical" form={formProps.form} size="large">
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

          <ImageUploadField
            name="imageUrl"
            label="Featured Image"
            required={true}
            form={formProps.form}
            initialImageUrl={queryResult?.data?.data?.imageUrl}
          />
        </Form>
      </Edit>
    </>
  );
}
