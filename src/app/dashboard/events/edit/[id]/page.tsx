"use client";

import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import ImageUploadField from "@components/shared/image-upload-field.component";
import { ITag } from "@domain/models/tag";
import { Edit, useForm, useSelect } from "@refinedev/antd";
import {
  Col,
  Form,
  Input,
  Row,
  DatePicker,
  Select,
} from "antd";
import dayjs from "dayjs";

export default function EventEdit() {
  const { formProps, saveButtonProps, queryResult } = useForm({});

  const { queryResult: tagData } = useSelect<ITag>({
    resource: "tags",
  });

  const tags = tagData.data;

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
              <ImageUploadField
                name="imageUrl"
                label="Event Image"
                required={true}
                form={formProps.form}
                initialImageUrl={queryResult?.data?.data?.imageUrl}
                maxSize={5 * 1024 * 1024}
              />
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
