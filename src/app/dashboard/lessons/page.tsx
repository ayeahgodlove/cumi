"use client";

import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import {
  BASE_URL_UPLOADS_MEDIA,
} from "@constants/api-url";
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
          <Table.Column dataIndex="author" title={"Author"} />
          <Table.Column dataIndex="duration" title={"Duration"} />
          <Table.Column dataIndex="difficulty" title={"Difficulty"} />
          
          {/* New Lesson Fields */}
          <Table.Column
            dataIndex="lessonOrder"
            title={"Order"}
            render={(value) => <Badge count={value || 1} style={{ backgroundColor: "#52c41a" }} />}
          />
          
          <Table.Column
            dataIndex="status"
            title={"Status"}
            render={(value) => {
              const colorMap = {
                draft: 'orange',
                published: 'green',
                archived: 'gray'
              };
              return <Tag color={colorMap[value as keyof typeof colorMap] || 'default'}>{value}</Tag>;
            }}
          />
          
          <Table.Column
            dataIndex="lessonType"
            title={"Type"}
            render={(value) => {
              const colorMap = {
                video: 'red',
                text: 'blue',
                audio: 'purple',
                practical: 'green',
                discussion: 'orange',
                assignment: 'cyan'
              };
              return <Tag color={colorMap[value as keyof typeof colorMap] || 'default'}>{value}</Tag>;
            }}
          />
          
          <Table.Column
            dataIndex="durationMinutes"
            title={"Duration (min)"}
            render={(value) => value ? `${value} min` : '-'}
          />
          
          <Table.Column
            dataIndex="isFreePreview"
            title={"Free Preview"}
            render={(value) => (
              <Tag color={value ? "green" : "default"}>
                {value ? "Yes" : "No"}
              </Tag>
            )}
          />
          
          <Table.Column
            dataIndex="language"
            title={"Language"}
            render={(value) => value ? <Tag>{value}</Tag> : '-'}
          />
          
          <Table.Column
            dataIndex="rating"
            title={"Rating"}
            render={(value) => value ? `${value}/5` : '-'}
          />
          
          <Table.Column
            dataIndex="imageUrl"
            title={"Image"}
            render={(value, record: any) => (
              <Image
                src={`${BASE_URL_UPLOADS_MEDIA}/${record.imageUrl}`}
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
