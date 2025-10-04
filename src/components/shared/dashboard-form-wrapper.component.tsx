"use client";

import React from "react";
import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import { Create, Edit, useForm } from "@refinedev/antd";
import { Form } from "antd";

interface DashboardFormWrapperProps {
  mode: "create" | "edit";
  breadcrumbItems: string[];
  children: React.ReactNode;
  resource?: string;
  onSuccess?: () => void;
}

export const DashboardFormWrapper: React.FC<DashboardFormWrapperProps> = ({
  mode,
  breadcrumbItems,
  children,
  resource,
  onSuccess,
}) => {
  const { formProps, saveButtonProps } = useForm({
    resource,
    onMutationSuccess: onSuccess,
  });

const FormComponent = mode === "create" ? Create : Edit;

return (
    <>
      <PageBreadCrumbs items={breadcrumbItems} />
      <FormComponent saveButtonProps={saveButtonProps}>
        <Form {...formProps} layout="vertical" form={formProps.form}>
          {children}
        </Form>
      </FormComponent>
    </>
  );
};

export default DashboardFormWrapper;
