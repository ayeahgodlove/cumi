"use client";

import { useToken } from "@hooks/shared/token.hook";
import { Show, TextField } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography } from "antd";

const { Title } = Typography;

export default function CategoryShow() {
  const { token } = useToken();
  const { queryResult } = useShow({
    meta: {
      headers: {
        authorization: `Bearer ${token}`,
      },
    },
  });
  const { data, isLoading } = queryResult;

  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Title level={5}>{"ID"}</Title>
      <TextField value={record?.id ?? ""} />
      <Title level={5}>{"Slug"}</Title>
      <TextField value={record?.slug} />
      <Title level={5}>{"Name"}</Title>
      <TextField value={record?.name} />
    </Show>
  );
}
