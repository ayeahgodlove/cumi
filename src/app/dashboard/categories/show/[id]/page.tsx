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
      <PageBreadCrumbs items={["Categories", "Lists", "Details"]} />
      <Show isLoading={isLoading}>
        <Title level={5}>{"ID"}</Title>
        <TextField value={record?.id ?? ""} />
        <Title level={5}>{"Slug"}</Title>
        <TextField value={record?.slug} />
        <Title level={5}>{"Name"}</Title>
        <TextField value={record?.name} />
      </Show>
    </>
  );
}
