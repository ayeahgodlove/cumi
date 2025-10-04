"use client";

import EnhancedBreadcrumb from "@components/shared/enhanced-breadcrumb/enhanced-breadcrumb.component";
import {
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import { BaseRecord } from "@refinedev/core";
import { format } from "@utils/format";
import { Image, Space, Table, Tag, Badge } from "antd";

export default function CourseList() {
  const { tableProps, tableQueryResult } = useTable({
    syncWithLocation: true,
  });

  const safeTableProps = {
    ...tableProps,
    dataSource: Array.isArray(tableProps?.dataSource) ? tableProps.dataSource : [],
  };

  return (
    <>
      <EnhancedBreadcrumb
        items={[
          { title: "Courses" },
          { title: "Lists" }
        ]}
        backButtonText="Back to Dashboard"
      />
      <List>
        <Table {...safeTableProps} rowKey="id">
          <Table.Column
            dataIndex="id"
            title={"ID"}
            render={(value, record, index) =>
              format.twoChar((index + 1).toString())
            }
          />
          <Table.Column dataIndex="title" title={"Title"} />
          <Table.Column dataIndex="authorName" title={"Author Name"} />
          <Table.Column dataIndex="categoryId" title={"Category"} />
          
          {/* New Course Fields */}
          <Table.Column
            dataIndex="price"
            title={"Price"}
            render={(value, record: any) => (
              <span>
                {record.isFree ? (
                  <Tag color="green">Free</Tag>
                ) : (
                  `${value || 0} ${record.currency || 'XAF'}`
                )}
              </span>
            )}
          />
          
          <Table.Column
            dataIndex="status"
            title={"Status"}
            render={(value) => {
              const colorMap = {
                draft: 'orange',
                published: 'green',
                archived: 'gray',
                suspended: 'red'
              };
              return <Tag color={colorMap[value as keyof typeof colorMap] || 'default'}>{value}</Tag>;
            }}
          />
          
          <Table.Column
            dataIndex="level"
            title={"Level"}
            render={(value) => {
              const colorMap = {
                beginner: 'blue',
                intermediate: 'orange',
                advanced: 'red'
              };
              return <Tag color={colorMap[value as keyof typeof colorMap] || 'default'}>{value}</Tag>;
            }}
          />
          
          <Table.Column
            dataIndex="language"
            title={"Language"}
            render={(value) => <Tag>{value}</Tag>}
          />
          
          <Table.Column
            dataIndex="currentStudents"
            title={"Students"}
            render={(value, record: any) => (
              <Badge 
                count={value || 0} 
                style={{ backgroundColor: "#1890ff" }}
                overflowCount={999}
              />
            )}
          />
          
          <Table.Column
            dataIndex="certificateAvailable"
            title={"Certificate"}
            render={(value) => (
              <Tag color={value ? "green" : "default"}>
                {value ? "Yes" : "No"}
              </Tag>
            )}
          />
          
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

