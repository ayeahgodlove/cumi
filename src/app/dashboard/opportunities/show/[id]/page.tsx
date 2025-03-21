"use client";

import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import { BASE_URL_UPLOADS_MEDIA } from "@constants/api-url";
import { DateField, ImageField, Show, TextField } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography } from "antd";

const { Title } = Typography;

export default function OpportunityShow() {
  const { queryResult } = useShow({});
  const { data, isLoading } = queryResult;

  const record = data?.data;

  return (
    <>
      <PageBreadCrumbs items={["Blog Posts", "Lists", "Details"]} />
      <Show isLoading={isLoading}>
        <Title level={5}>{"ID"}</Title>
        <TextField value={record?.id ?? ""} />
        <Title level={5}>{"Title"}</Title>
        <TextField value={record?.title} />
        <Title level={5}>{"Content"}</Title>
        {/* <MarkdownField value={record?.content} /> */}
        <div
          style={{ padding: 10, background: "#f2f2f2" }}
          dangerouslySetInnerHTML={{
            __html: record?.content,
          }}
        />
        <Title level={5}>{"Status"}</Title>
        <TextField value={record?.status} />
        <Title level={5}>{"CreatedAt"}</Title>
        <DateField value={record?.createdAt} />
        <ImageField
          imageTitle={record?.title}
          value={`${BASE_URL_UPLOADS_MEDIA}/${record?.imageUrl}`}
        />
      </Show>
    </>
  );
}
