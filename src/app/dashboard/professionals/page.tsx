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
import { BASE_URL_UPLOADS_MEDIA } from "@constants/api-url";

export default function ProfessionalList() {
  const { tableProps } = useTable({
    syncWithLocation: true,
  });

  return (
    <>
      <PageBreadCrumbs items={["Professionals", "Lists"]} />
      <List>
        <Table {...tableProps} rowKey="id">
          <Table.Column
            dataIndex="id"
            title={"ID"}
            render={(value, record, index) =>
              format.twoChar((index + 1).toString())
            }
          />
          <Table.Column
            dataIndex="avatar"
            title={"Avatar"}
            render={(value, record: any) => (
              <Avatar
                src={value ? `${BASE_URL_UPLOADS_MEDIA}/${value}` : "/img/avatar.png"}
                alt={record?.name}
                size={40}
              />
            )}
          />
          <Table.Column dataIndex="name" title={"Name"} />
          <Table.Column dataIndex="title" title={"Title"} />
          <Table.Column dataIndex="company" title={"Company"} />
          <Table.Column dataIndex="location" title={"Location"} />
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
