"use client";

import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import { Show, useShow } from "@refinedev/antd";
import { DateField, NumberField, TextField } from "@refinedev/antd";
import { Tag, Typography } from "antd";

const { Title } = Typography;

export default function EnrollmentShow() {
  const { queryResult } = useShow({});
  const { data, isLoading } = queryResult;
  const record = data?.data;

  return (
    <>
      <PageBreadCrumbs items={["Enrollments", "Lists", "Show"]} />
      <Show isLoading={isLoading}>
        <Title level={5}>{"ID"}</Title>
        <NumberField value={record?.id ?? ""} />
        <Title level={5}>{"User ID"}</Title>
        <TextField value={record?.userId} />
        <Title level={5}>{"Course ID"}</Title>
        <TextField value={record?.courseId} />
        <Title level={5}>{"Enrollment Date"}</Title>
        <DateField value={record?.enrollmentDate} />
        <Title level={5}>{"Completion Date"}</Title>
        <DateField value={record?.completionDate} />
        <Title level={5}>{"Status"}</Title>
        {record?.enrollmentDate && record?.completionDate && (
          <Tag
            color={
              new Date(record.completionDate) <= new Date()
                ? "green"
                : new Date(record.enrollmentDate) <= new Date()
                ? "blue"
                : "orange"
            }
          >
            {new Date(record.completionDate) <= new Date()
              ? "Completed"
              : new Date(record.enrollmentDate) <= new Date()
              ? "In Progress"
              : "Pending"}
          </Tag>
        )}
      </Show>
    </>
  );
}
