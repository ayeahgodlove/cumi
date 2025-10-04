"use client";

import EnhancedBreadcrumb from "@components/shared/enhanced-breadcrumb/enhanced-breadcrumb.component";
import {
  DateField,
  DeleteButton,
  EditButton,
  List,
  MarkdownField,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import { BaseRecord, useMany } from "@refinedev/core";
import { format } from "@utils/format";
import { Image, Space, Table } from "antd";

export default function BlogPostList() {
  const { tableProps } = useTable({
    syncWithLocation: true,
  });

  const { data: categoryData, isLoading: categoryIsLoading } = useMany({
    resource: "categories",
    ids:
      Array.isArray(tableProps?.dataSource)
        ? tableProps.dataSource
            .map((item) => item?.category?.id)
            .filter(Boolean)
        : [],
    queryOptions: {
      enabled: !!tableProps?.dataSource && Array.isArray(tableProps.dataSource),
    },
  });

  return (
    <>
      <EnhancedBreadcrumb
        items={[
          { title: "Blog Posts" },
          { title: "Lists" }
        ]}
        showBackButton={false}
        // backButtonText="Back to Dashboard"
      />
      <List>
        <Table 
          {...tableProps} 
          
          // dataSource={Array.isArray(tableProps?.dataSource) ? tableProps.dataSource : []}
          rowKey="id"
        >
          <Table.Column
            dataIndex="id"
            title={"ID"}
            render={(value, record, index) =>
              format.twoChar((index + 1).toString())
            }
          />
          <Table.Column dataIndex="title" title={"Title"} />
          <Table.Column
            dataIndex="imageUrl"
            title={"Image"}
            render={(value, record: any) => (
              <Image
                src={record.imageUrl}
                alt={record?.title}
                height={100}
                width={100}
              />
            )}
          />
          <Table.Column
            dataIndex={"categoryId"}
            title={"Category"}
            render={(value) =>
              categoryIsLoading ? (
                <>Loading...</>
              ) : categoryData ? (
                categoryData.data.find((item) => item.id === value)?.name
              ) : (
                "Not found"
              )
            }
          />
          <Table.Column dataIndex="status" title={"Status"} />
          <Table.Column
            dataIndex={["createdAt"]}
            title={"Created at"}
            render={(value: any) => <DateField value={value} />}
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

