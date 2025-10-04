"use client";

import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import ImageUploadField from "@components/shared/image-upload-field.component";
import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Select } from "antd";

export default function ServiceCreate() {
  const { formProps, saveButtonProps } = useForm({});

  return (
    <>
      <PageBreadCrumbs items={["Services", "Lists", "Create"]} />
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
          <Form.Item
            name={"description"}
            label="Description"
            required={true}
            rules={[
              { required: true, message: "This field is a required field" },
            ]}
            style={{ marginBottom: 15 }}
          >
            <Input.TextArea size="large" />
          </Form.Item>

          <Form.Item
            name={"items"}
            label="Service Items"
            tooltip="Add the specific services or features you offer. Press Enter to add each item."
            style={{ marginBottom: 15 }}
          >
            <Select
              mode="tags"
              size="large"
              placeholder="Add service items (e.g., Web Development, Mobile Apps)"
              style={{ width: '100%' }}
              tokenSeparators={[',']}
            />
          </Form.Item>

            <ImageUploadField
              name="imageUrl"
              label="Service Image"
              required={true}
              form={formProps.form}
              maxSize={5 * 1024 * 1024}
            />
        </Form>
      </Create>
    </>
  );
}

