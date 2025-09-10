"use client";

import React from "react";
import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import {
  List,
  useTable,
  EditButton,
  ShowButton,
  DeleteButton,
} from "@refinedev/antd";
import { BaseRecord } from "@refinedev/core";
import { Table, Space, Tag } from "antd";

const SubscriberList: React.FC = () => {
  const { tableProps } = useTable({
    syncWithLocation: true,
  });

  return (
    <>
      <PageBreadCrumbs items={["Subscribers", "Lists"]} />
      <List>
        <Table {...tableProps} rowKey="id">
          <Table.Column dataIndex="id" title="ID" />
          <Table.Column dataIndex="email" title="Email" />
          <Table.Column dataIndex="name" title="Name" />
          <Table.Column
            dataIndex="isActive"
            title="Status"
            render={(value: boolean) => (
              <Tag color={value ? "green" : "red"}>
                {value ? "Active" : "Inactive"}
              </Tag>
            )}
          />
          <Table.Column dataIndex="subscribedAt" title="Subscribed At" />
          <Table.Column dataIndex="createdAt" title="Created At" />
          <Table.Column
            title="Actions"
            dataIndex="actions"
            render={(_, record: BaseRecord) => (
              <Space>
                <EditButton hideText size="small" recordItemId={record.id} />
                <ShowButton hideText size="small" recordItemId={record.id} />
                <DeleteButton hideText size="small" recordItemId={record.id} />
              </Space>
            )}
          />
        </Table>
      </List>
    </>
  );
};

export default SubscriberList;
