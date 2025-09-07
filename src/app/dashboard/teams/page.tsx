"use client";

import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import { BASE_URL_UPLOADS_MEDIA } from "@constants/api-url";
import {
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import { BaseRecord } from "@refinedev/core";
import { format } from "@utils/format";
import { Avatar, Space, Table, Tag } from "antd";

export default function TeamList() {
  const { tableProps } = useTable({
    syncWithLocation: true,
  });

  return (
    <>
      <PageBreadCrumbs items={["Team", "Lists"]} />
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
                size={50}
              />
            )}
          />
          <Table.Column dataIndex="name" title={"Name"} />
          <Table.Column dataIndex="role" title={"Role"} />
          <Table.Column dataIndex="position" title={"Position"} />
          <Table.Column
            dataIndex="skills"
            title={"Skills"}
            render={(value: string[]) => (
              <Space wrap>
                {value?.slice(0, 3).map((skill, index) => (
                  <Tag key={index} color="blue">{skill}</Tag>
                ))}
                {value?.length > 3 && <Tag color="default">+{value.length - 3}</Tag>}
              </Space>
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
