"use client";

import {
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import { BaseRecord, useCustom } from "@refinedev/core";
import { format } from "@utils/format";
import { Space, Table } from "antd";

export default function CategoryList() {
  const { tableProps, tableQueryResult } = useTable({
    syncWithLocation: true,
  });

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column
          dataIndex="id"
          title={"ID"}
          render={(value, record, index) =>
            format.twoChar((index + 1).toString())
          }
        />
        <Table.Column dataIndex="title" title={"Title"} />
        <Table.Column
          dataIndex="icon"
          title={"Icon"}
          render={(_, record: BaseRecord) => <>{record.icon as React.ReactNode}</>}
        />
        <Table.Column dataIndex="description" title={"Description"} />
        <Table.Column
          title={"Actions"}
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
  );
}
