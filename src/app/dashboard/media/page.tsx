"use client";

import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import { API_URL_UPLOADS_MEDIA } from "@constants/api-url";
import { useToken } from "@hooks/shared/token.hook";
// import { ICategory } from "@models/category.model";
import {
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import { BaseRecord } from "@refinedev/core";
import { format } from "@utils/format";
import { Image, Space, Table } from "antd";

export default function MediaList() {
  const { tableProps } = useTable({
    syncWithLocation: true,
  });

  return (
    <>
      <PageBreadCrumbs items={["Media", "Lists"]} />
      <List>
        <Table {...tableProps} rowKey="id">
          <Table.Column
            dataIndex="id"
            title={"ID"}
            render={(value, record, index) =>
              format.twoChar((index + 1).toString())
            }
          />
          {/* <Table.Column dataIndex="slug" title={"Slug"} /> */}
          <Table.Column dataIndex="title" title={"Title"} />
          <Table.Column
            dataIndex="imageUrl"
            title={"Image"}
            render={(value, record: any) => (
              <Image
                src={`${API_URL_UPLOADS_MEDIA}/${record.imageUrl}`}
                alt={record?.title}
                height={50}
                width={50}
              />
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
