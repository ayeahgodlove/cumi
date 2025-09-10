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
import { Space, Table, Tag, Badge, Progress } from "antd";

export default function EnrollmentList() {
  const { tableProps } = useTable({
    syncWithLocation: true,
  });

  return (
    <>
      <PageBreadCrumbs items={["Enrollments", "Lists"]} />
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
            dataIndex="userId" 
            title={"User ID"} 
          />
          <Table.Column 
            dataIndex="courseId" 
            title={"Course ID"} 
          />
          
          {/* New Enrollment Fields */}
          <Table.Column
            dataIndex="progress"
            title={"Progress"}
            render={(value) => (
              <Progress 
                percent={value || 0} 
                size="small" 
                status={value === 100 ? "success" : "active"}
              />
            )}
          />
          
          <Table.Column
            dataIndex="paymentStatus"
            title={"Payment Status"}
            render={(value) => {
              const colorMap = {
                pending: 'orange',
                paid: 'green',
                partial: 'blue',
                free: 'cyan',
                scholarship: 'purple'
              };
              return <Tag color={colorMap[value as keyof typeof colorMap] || 'default'}>{value}</Tag>;
            }}
          />
          
          <Table.Column
            dataIndex="paymentMethod"
            title={"Payment Method"}
            render={(value) => value ? <Tag>{value}</Tag> : '-'}
          />
          
          <Table.Column
            dataIndex="amountPaid"
            title={"Amount Paid"}
            render={(value, record: any) => (
              <span>{value || 0} XAF</span>
            )}
          />
          
          <Table.Column
            dataIndex="educationLevel"
            title={"Education Level"}
            render={(value) => value ? <Tag>{value}</Tag> : '-'}
          />
          
          <Table.Column
            dataIndex="preferredContact"
            title={"Contact Method"}
            render={(value) => value ? <Tag>{value}</Tag> : '-'}
          />
          
          <Table.Column
            dataIndex="internetAccess"
            title={"Internet Access"}
            render={(value) => value ? <Tag>{value}</Tag> : '-'}
          />
          
          <Table.Column
            dataIndex="certificateIssued"
            title={"Certificate"}
            render={(value) => (
              <Tag color={value ? "green" : "default"}>
                {value ? "Issued" : "Not Issued"}
              </Tag>
            )}
          />
          
          <Table.Column
            dataIndex="enrollmentDate"
            title={"Enrollment Date"}
            render={(value) => {
              if (!value) return "-";
              const date = new Date(value);
              return date.toLocaleDateString();
            }}
          />
          
          <Table.Column
            dataIndex="completionDate"
            title={"Completion Date"}
            render={(value) => {
              if (!value) return "-";
              const date = new Date(value);
              return date.toLocaleDateString();
            }}
          />
          
          <Table.Column
            title={"Status"}
            dataIndex="status"
            render={(_, record: BaseRecord) => {
              const enrollmentDate = new Date(record.enrollmentDate);
              const completionDate = new Date(record.completionDate);
              const now = new Date();
              
              if (completionDate <= now) {
                return <Tag color="green">Completed</Tag>;
              } else if (enrollmentDate <= now) {
                return <Tag color="blue">In Progress</Tag>;
              } else {
                return <Tag color="orange">Pending</Tag>;
              }
            }}
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
