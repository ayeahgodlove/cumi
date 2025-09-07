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
import { Space, Table, Tag, Button } from "antd";
import { MailOutlined } from "@ant-design/icons";

export default function ContactMessageList() {
  const { tableProps } = useTable({
    syncWithLocation: true,
  });

  return (
    <>
      <PageBreadCrumbs items={["Contact Messages", "Lists"]} />
      <List>
        <Table {...tableProps} rowKey="id">
          <Table.Column
            dataIndex="id"
            title={"ID"}
            render={(value, record, index) =>
              format.twoChar((index + 1).toString())
            }
          />
          <Table.Column dataIndex="name" title={"Name"} />
          <Table.Column dataIndex="email" title={"Email"} />
          <Table.Column dataIndex="subject" title={"Subject"} />
          <Table.Column 
            dataIndex="isRead" 
            title={"Status"}
            render={(value: boolean) => (
              <Tag color={value ? "green" : "orange"}>
                {value ? "Read" : "Unread"}
              </Tag>
            )}
          />
          <Table.Column 
            dataIndex="createdAt" 
            title={"Received"}
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
