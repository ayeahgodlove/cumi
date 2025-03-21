"use client";

import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import { BASE_URL_UPLOADS_MEDIA } from "@constants/api-url";
import { ICategory } from "@domain/models/category";
import { IMedia } from "@domain/models/media.model";
import { Edit, useForm, useSelect } from "@refinedev/antd";
import { Col, Form, Image, Input, Row, Select, Space, Typography } from "antd";

export default function CourseEdit() {
  const { formProps, saveButtonProps, form } = useForm({});
  const { queryResult: mediaData, selectProps: mediaSelectProps } =
    useSelect<IMedia>({
      resource: "media",
    });
  const { queryResult: categoryData, selectProps } = useSelect<ICategory>({
    resource: "categories",
  });

  const categories = categoryData.data;

  const media = mediaData.data;
  return (
    <>
      <PageBreadCrumbs items={["Courses", "Lists", "Edit"]} />
      <Edit saveButtonProps={saveButtonProps}>
        <Form {...formProps} layout="vertical">
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
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              placeholder="Select image"
              size="large"
            />
          </Form.Item>
        </Form>
      </Edit>
    </>
  );
}
