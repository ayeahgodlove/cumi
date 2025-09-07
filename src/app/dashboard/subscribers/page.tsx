"use client";

import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import {
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import { BaseRecord } from "@refinedev/core";
import { format } from "@utils/format";
import { Space, Table, Tag } from "antd";

export default function SubscribeList() {
  const { tableProps } = useTable({
    syncWithLocation: true,
  });

  return (
    <>
      <PageBreadCrumbs items={["Subscribers", "Lists"]} />
      <List>
        <Table {...tableProps} rowKey="id">
          <Table.Column
            dataIndex="id"
            title={"ID"}
            render={(value, record, index) =>
              format.twoChar((index + 1).toString())
            }
          />
          <Table.Column dataIndex="email" title={"Email"} />
          <Table.Column dataIndex="name" title={"Name"} />
          <Table.Column 
            dataIndex="isActive" 
            title={"Status"}
            render={(value: boolean) => (
              <Tag color={value ? "green" : "red"}>
                {value ? "Active" : "Inactive"}
              </Tag>
            )}
          />
          <Table.Column 
            dataIndex="subscribedAt" 
            title={"Subscribed At"}
            render={(value: string) => new Date(value).toLocaleDateString()}
          />
          <Table.Column
            title={"Actions"}
            dataIndex="actions"
            render={(_, record: BaseRecord) => (
              <Space>
                <ShowButton hideText size="small" recordItemId={record.id} />
                <DeleteButton hideText size="small" recordItemId={record.id} />
              </Space>
            )}
          />
        </Table>
      </List>
    </>
  );
}
