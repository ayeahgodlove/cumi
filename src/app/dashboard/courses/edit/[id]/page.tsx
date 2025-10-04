"use client";

import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import { ICategory } from "@domain/models/category";
import { Edit, useForm, useSelect } from "@refinedev/antd";
import { Col, Form, Input, Row, Select } from "antd";
import ImageUploadField from "@components/shared/image-upload-field.component";

export default function CourseEdit() {
  const { formProps, saveButtonProps, queryResult } = useForm({});

  const { queryResult: categoryData, selectProps } = useSelect<ICategory>({
    resource: "categories",
  });

  const categories = categoryData?.data || [];

  return (
    <>
      <PageBreadCrumbs items={["Courses", "Lists", "Edit"]} />
      <Edit saveButtonProps={saveButtonProps}>
        <Form {...formProps} layout="vertical" form={formProps.form} size="large">
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

          <ImageUploadField
            name="imageUrl"
            label="Image"
            form={formProps.form}
            required={true}
            listType="picture"
            dragger={true}
            draggerText="Drag & drop a course image here"
            draggerHint="Support for single upload. Maximum file size: 5MB"
            initialImageUrl={queryResult?.data?.data?.imageUrl}
          />
        </Form>
      </Edit>
    </>
  );
}
