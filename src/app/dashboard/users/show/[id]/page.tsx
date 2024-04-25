"use client";

import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import { Show, TextField } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography } from "antd";

const { Title } = Typography;

export default function CategoryShow() {
  const { queryResult } = useShow({});
  const { data, isLoading } = queryResult;

  const record = data?.data;

  return (
    <>
      <PageBreadCrumbs items={["Users", "Lists", "Details"]} />
      <Show isLoading={isLoading}>
        <Title level={5}>{"ID"}</Title>
        <TextField value={record?.id ?? ""} />
        <Title level={5}>{"Username"}</Title>
        <TextField value={record?.username} />
        <Title level={5}>{"Email"}</Title>
        <TextField value={record?.email} />
        <Title level={5}>{"PhoneNumber"}</Title>
        <TextField value={record?.phoneNumber} />
        <Title level={5}>{"Address"}</Title>
        <TextField value={record?.address} />
      </Show>
    </>
  );
}
