"use client";

import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import { ImageField, Show, TextField } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography } from "antd";

const { Title } = Typography;

export default function CategoryShow() {
  const { queryResult } = useShow({});
  const { data, isLoading } = queryResult;

  const record = data?.data;

  return (
    <>
      <PageBreadCrumbs items={["Projects", "Lists", "Details"]} />
      <Show isLoading={isLoading}>
        <Title level={5}>{"ID"}</Title>
        <TextField value={record?.id ?? ""} />
        <Title level={5}>{"Title"}</Title>
        <TextField value={record?.title} />
        <Title level={5}>{"Description"}</Title>
        <TextField value={record?.description} />
        <Title level={5}>{"Deploy Url"}</Title>
        <TextField value={record?.deployUrl} />
        <Title level={5}>{"Github Url"}</Title>
        <TextField value={record?.githubUrl} />
        <ImageField
          imageTitle={record?.title}
          value={record?.imageUrl}
        />
      </Show>
    </>
  );
}
