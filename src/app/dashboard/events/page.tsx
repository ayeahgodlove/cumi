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

export default function CategoryList() {
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
          { title: "Events" },
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
          <Table.Column
            dataIndex="eventDate"
            title={"Event Date"}
            render={(value) => format.date(value)}
          />
          <Table.Column dataIndex="location" title={"Location"} />
          
          {/* New Event Fields */}
          <Table.Column
            dataIndex="status"
            title={"Status"}
            render={(value) => {
              const colorMap = {
                draft: 'orange',
                published: 'green',
                cancelled: 'red',
                completed: 'blue'
              };
              return <Tag color={colorMap[value as keyof typeof colorMap] || 'default'}>{value}</Tag>;
            }}
          />
          
          <Table.Column
            dataIndex="category"
            title={"Category"}
            render={(value) => value ? <Tag>{value}</Tag> : '-'}
          />
          
          <Table.Column
            dataIndex="entryFee"
            title={"Entry Fee"}
            render={(value, record: any) => (
              <span>
                {record.isFree ? (
                  <Tag color="green">Free</Tag>
                ) : (
                  `${value || 0} XAF`
                )}
              </span>
            )}
          />
          
          <Table.Column
            dataIndex="maxAttendees"
            title={"Max Attendees"}
            render={(value, record: any) => (
              <Badge 
                count={record.currentAttendees || 0} 
                style={{ backgroundColor: "#1890ff" }}
                overflowCount={999}
              />
            )}
          />
          
          <Table.Column
            dataIndex="targetAudience"
            title={"Target Audience"}
            render={(value) => value ? <Tag>{value}</Tag> : '-'}
          />
          
          <Table.Column
            dataIndex="language"
            title={"Language"}
            render={(value) => <Tag>{value}</Tag>}
          />
          
          <Table.Column
            dataIndex="region"
            title={"Region"}
            render={(value) => value || '-'}
          />
          
          <Table.Column
            dataIndex="registrationRequired"
            title={"Registration"}
            render={(value) => (
              <Tag color={value ? "blue" : "default"}>
                {value ? "Required" : "Not Required"}
              </Tag>
            )}
          />
          
          <Table.Column
            dataIndex="imageUrl"
            title={"Image"}
            render={(value, record: any) => (
              <Image
                src={value}
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

