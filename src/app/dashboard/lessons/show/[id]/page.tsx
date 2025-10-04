"use client";

import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import { ImageField, Show, TextField } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { format } from "@utils/format";
import { Typography } from "antd";

const { Title } = Typography;

export default function LessonShow() {
  const { queryResult } = useShow({});
  const { data, isLoading } = queryResult;

  const record = data?.data;

  return (
    <>
      <PageBreadCrumbs items={["Events", "Lists", "Details"]} />
      <Show isLoading={isLoading}>
        <Title level={5}>{"Course"}</Title>
        <TextField value={record?.courseId ?? ""} />
        <Title level={5}>{"ID"}</Title>
        <TextField value={record?.id ?? ""} />
        <Title level={5}>{"Title"}</Title>
        <TextField value={record?.title} />
        <Title level={5}>{"Description"}</Title>
        <TextField value={record?.description} />
        <TextField
          value={
            <div
              dangerouslySetInnerHTML={{
                __html: record?.content,
              }}
            />
          }
        />
        <Title level={5}>{"Duration"}</Title>
        <TextField value={record?.duration} />
        <Title level={5}>{"Difficulty"}</Title>
        <TextField value={record?.difficulty} />
        <Title level={5}>{"Image"}</Title>
        <ImageField
          imageTitle={record?.title}
          value={record?.imageUrl}
        />
      </Show>
    </>
  );
}
