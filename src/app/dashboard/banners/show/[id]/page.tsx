"use client";

import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import { API_URL_UPLOADS_BANNERS } from "@constants/api-url";
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
      <PageBreadCrumbs items={["Banners", "Lists", "Details"]} />
      <Show isLoading={isLoading}>
        <Title level={5}>{"ID"}</Title>
        <TextField value={record?.id ?? ""} />
        <Title level={5}>{"Title"}</Title>
        <TextField value={record?.title} />
        <Title level={5}>{"Description"}</Title>
        <TextField value={record?.subTitle} />
        <Title level={5}>{"Image"}</Title>
        <ImageField
          imageTitle={record?.title}
          value={`${API_URL_UPLOADS_BANNERS}/${record?.image}`}
        />
      </Show>
    </>
  );
}
