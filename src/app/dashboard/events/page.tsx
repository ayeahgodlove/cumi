"use client";

import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import { BASE_URL_UPLOADS_EVENTS, BASE_URL_UPLOADS_MEDIA } from "@constants/api-url";
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

export default function CategoryList() {
  const { tableProps, tableQueryResult } = useTable({
    syncWithLocation: true,
  });

  return (
    <>
      <PageBreadCrumbs items={["Events", "Lists"]} />
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
          {/* <Table.Column dataIndex="description" title={"Description"} /> */}
          <Table.Column
            dataIndex="eventDate"
            title={"Event Date"}
            render={(value) => format.date(value)}
          />
          <Table.Column dataIndex="location" title={"Location"} />
          <Table.Column
            dataIndex="imageUrl"
            title={"Image"}
            render={(value, record: any) => (
              <Image
                src={`${BASE_URL_UPLOADS_MEDIA}/${value}`}
                alt={record?.title}
                height={100}
                width={100}
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
