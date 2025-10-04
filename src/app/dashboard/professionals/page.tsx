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
import { Space, Table, Tag, Avatar } from "antd";

export default function ProfessionalList() {
  const { tableProps } = useTable({
    syncWithLocation: true,
  });

  const safeTableProps = {
    ...tableProps,
    dataSource: Array.isArray(tableProps?.dataSource) ? tableProps.dataSource : [],
  };

  return (
    <>
      <PageBreadCrumbs items={["Professionals", "Lists"]} />
      <List>
        <Table {...safeTableProps} rowKey="id">
          <Table.Column
            dataIndex="id"
            title={"ID"}
            render={(value, record, index) =>
              format.twoChar((index + 1).toString())
            }
          />
          <Table.Column
            dataIndex="profileImage"
            title={"Avatar"}
            render={(value, record: any) => (
              <Avatar
                src={value || "/img/avatar.png"}
                alt={record?.title}
                size={40}
              />
            )}
          />
          <Table.Column dataIndex="title" title={"Title"} />
          <Table.Column dataIndex="position" title={"Position"} />
          <Table.Column dataIndex="email" title={"Email"} />
          <Table.Column dataIndex="location" title={"Location"} />
          <Table.Column 
            dataIndex="availability" 
            title={"Availability"}
            render={(value: string) => (
              <Tag color={
                value === "Available" ? "green" : 
                value === "Busy" ? "orange" : "red"
              }>
                {value}
              </Tag>
            )}
          />
          <Table.Column 
            dataIndex="isVerified" 
            title={"Verified"}
            render={(value: boolean) => (
              <Tag color={value ? "blue" : "default"}>
                {value ? "Verified" : "Unverified"}
              </Tag>
            )}
          />
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
    </>
  );
}
