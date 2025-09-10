"use client";

import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import { Create, useForm } from "@refinedev/antd";
import { Form, Input } from "antd";

export default function CategoryCreate() {
  const { formProps, saveButtonProps } = useForm({});

  return (
    <>
      <PageBreadCrumbs items={["Categories", "Lists", "Create"]} />
      <Create saveButtonProps={saveButtonProps}>
        <Form {...formProps} layout="vertical" form={formProps.form}>
          <Form.Item
            label={"Name"}
            name={["name"]}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input size="large" />
          </Form.Item>
        </Form>
      </Create>
    </>
  );
}
