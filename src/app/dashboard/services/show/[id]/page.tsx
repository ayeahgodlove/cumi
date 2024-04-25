"use client";

import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import { Show, TextField } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { format } from "@utils/format";
import { Typography } from "antd";

const { Title } = Typography;

export default function CategoryShow() {
  const { queryResult } = useShow({});
  const { data, isLoading } = queryResult;

  const record = data?.data;

  return (
    <>
      <PageBreadCrumbs items={["Services", "Lists", "Details"]} />
      <Show isLoading={isLoading}>
        <Title level={5}>{"ID"}</Title>
        <TextField value={record?.id ?? ""} />
        <Title level={5}>{"Title"}</Title>
        <TextField value={record?.title} />
        <Title level={5}>{"Description"}</Title>
        <TextField value={record?.description} />
        <Title level={5}>{"Icon"}</Title>
        <TextField value={record?.icon} />
      </Show>
    </>
  );
}
