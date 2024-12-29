"use client";

import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import { Show, TextField } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography } from "antd";

const { Title } = Typography;

export default function QuizShow() {
  const { queryResult } = useShow({});
  const { data, isLoading } = queryResult;

  const record = data?.data;

  return (
    <>
      <PageBreadCrumbs items={["Quizes", "Lists", "Details"]} />
      <Show isLoading={isLoading}>
        <Title level={5}>{"ID"}</Title>
        <TextField value={record?.id ?? ""} />
        <Title level={5}>{"Question"}</Title>
        <TextField value={record?.question} />
        <Title level={5}>{"Answers"}</Title>
        {record?.answers.map((ans: any, index: number) => (
          <TextField key={index} value={ans} />
        ))}
        <Title level={5}>{"Correct Answer"}</Title>
        <TextField value={record?.answers[record?.correctAnswerIndex]} />
      </Show>
    </>
  );
}
