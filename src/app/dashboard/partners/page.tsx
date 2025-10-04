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
import { Space, Table, Avatar } from "antd";

export default function PartnerList() {
  const { tableProps } = useTable({
    syncWithLocation: true,
  });

  const safeTableProps = {
    ...tableProps,
    dataSource: Array.isArray(tableProps?.dataSource) ? tableProps.dataSource : [],
  };

  return (
    <>
      <PageBreadCrumbs items={["Partners", "Lists"]} />
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
            dataIndex="logo"
            title={"Logo"}
            render={(value, record: any) => (
              <Avatar
                src={value || "/img/avatar.png"}
                alt={record?.name}
                size={40}
              />
            )}
          />
          <Table.Column dataIndex="name" title={"Name"} />
          {/* <Table.Column dataIndex="description" title={"Description"} /> */}
          <Table.Column dataIndex="location" title={"Location"} />
          <Table.Column dataIndex="contactPhone" title={"Contact Phone"} />
          {/* <Table.Column dataIndex="websiteLink" title={"Website"} /> */}
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

