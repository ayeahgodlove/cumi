"use client";

import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Switch, InputNumber } from "antd";

export default function RoleEdit() {
  const { formProps, saveButtonProps } = useForm({});

  return (
    <>
      <PageBreadCrumbs items={["Roles", "Edit"]} />
      <Edit saveButtonProps={saveButtonProps}>
        <Form {...formProps} layout="vertical">
          <Form.Item
            label="Role Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Role name is required",
              },
            ]}
          >
            <Input placeholder="Enter role name (e.g., admin, user, moderator)" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[
              {
                required: true,
                message: "Description is required",
              },
            ]}
          >
            <Input.TextArea 
              rows={4} 
              placeholder="Enter role description" 
            />
          </Form.Item>

          <Form.Item
            label="Priority Level"
            name="priority"
            rules={[
              {
                required: true,
                message: "Priority level is required",
              },
            ]}
          >
            <InputNumber 
              min={1} 
              max={100} 
              placeholder="Enter priority level (1-100)" 
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            label="Permissions"
            name="permissions"
          >
            <Input.TextArea 
              rows={3} 
              placeholder="Enter permissions (comma-separated)" 
            />
          </Form.Item>

          <Form.Item
            label="Active Status"
            name="isActive"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Form>
      </Edit>
    </>
  );
}
