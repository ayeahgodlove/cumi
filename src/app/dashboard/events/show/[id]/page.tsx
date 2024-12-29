"use client";

import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import { API_URL_UPLOADS_MEDIA } from "@constants/api-url";
import { ImageField, Show, TextField } from "@refinedev/antd";
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
      <PageBreadCrumbs items={["Events", "Lists", "Details"]} />
      <Show isLoading={isLoading}>
        <Title level={5}>{"ID"}</Title>
        <TextField value={record?.id ?? ""} />
        <Title level={5}>{"Title"}</Title>
        <TextField value={record?.title} />
        <Title level={5}>{"Event Date"}</Title>
        <TextField value={format.date(record?.eventDate)} />
        <Title level={5}>{"Description"}</Title>
        <TextField value={record?.description} />
        <Title level={5}>{"Image"}</Title>
        <ImageField
          imageTitle={record?.title}
          value={`${API_URL_UPLOADS_MEDIA}/${record?.imageUrl}`}
        />
      </Show>
    </>
  );
}
