"use client";

import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import { useToken } from "@hooks/shared/token.hook";
import { Create, useForm } from "@refinedev/antd";
import { Form, Input } from "antd";

export default function CategoryCreate() {
  const { formProps, saveButtonProps } = useForm({});

  return (
    <>
      <PageBreadCrumbs items={["Tags", "Lists", "Create"]} />
      <Create saveButtonProps={saveButtonProps}>
        <Form {...formProps} layout="vertical">
          <Form.Item
            label={"Name"}
            name={["name"]}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Create>
    </>
  );
}
