"use client";

import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import ImageUploadField from "@components/shared/image-upload-field.component";
import { Create, useForm } from "@refinedev/antd";
import { Col, Form, Input, Row } from "antd";

export default function ProjectCreate() {
  const { formProps, saveButtonProps } = useForm({});

  return (
    <>
      <PageBreadCrumbs items={["Projects", "Lists", "Create"]} />
      <Create saveButtonProps={saveButtonProps}>
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
          <Row gutter={[8, 8]}>
            <Col xs={24} md={12}>
              <Form.Item
                name={"githubUrl"}
                label="Github Url"
                required={true}
                rules={[
                  { required: true, message: "This field is a required field" },
                ]}
              >
                <Input type="website" size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name={"deployUrl"}
                label="Deploy Url"
                required={true}
                rules={[
                  { required: true, message: "This field is a required field" },
                ]}
              >
                <Input type="website" size="large" />
              </Form.Item>
            </Col>
          </Row>
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
          <Col xs={24} md={24}>
            <ImageUploadField
              name="imageUrl"
              label="Project Image"
              required={true}
              form={formProps.form}
              maxSize={5 * 1024 * 1024}
            />
          </Col>
        </Form>
      </Create>
    </>
  );
}
