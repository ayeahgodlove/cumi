"use client";

import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import { Show } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography, Descriptions, Avatar, Tag } from "antd";
import { BASE_URL_UPLOADS_MEDIA } from "@constants/api-url";

const { Title, Text } = Typography;

export default function PartnerShow() {
  const { queryResult } = useShow();
  const { data, isLoading } = queryResult;
  const record = data?.data;

  return (
    <>
      <PageBreadCrumbs items={["Partners", "Show"]} />
      <Show isLoading={isLoading}>
        <Title level={5}>Partner Details</Title>
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Logo">
            <Avatar
              size={64}
              src={record?.logo ? `${BASE_URL_UPLOADS_MEDIA}/${record.logo}` : "/img/avatar.png"}
              alt={record?.name}
            />
          </Descriptions.Item>
          <Descriptions.Item label="Name">
            <Text strong>{record?.name}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Description">
            <Text>{record?.description}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Location">
            <Tag color="blue">{record?.location}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Contact Phone">
            <Text copyable>{record?.contactPhone}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Website Link">
            <Text copyable>
              <a href={record?.websiteLink} target="_blank" rel="noopener noreferrer">
                {record?.websiteLink}
              </a>
            </Text>
          </Descriptions.Item>
        </Descriptions>
      </Show>
    </>
  );
}
