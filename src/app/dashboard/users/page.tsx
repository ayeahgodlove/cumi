"use client";

import React from "react";
import {
  Col,
  Row,
  Card,
  Statistic,
  Typography,
  Space,
  Table,
  Tag,
  Button,
  Tooltip,
} from "antd";
import {
  UserOutlined,
  TeamOutlined,
  BookOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useTable } from "@refinedev/antd";
import { BaseRecord } from "@refinedev/core";
import { format } from "@utils/format";
import EnhancedBreadcrumb from "@components/shared/enhanced-breadcrumb/enhanced-breadcrumb.component";

const { Title } = Typography;

export default function UsersPage() {
  const { tableProps, tableQueryResult } = useTable({
    syncWithLocation: true,
  });

  // Mock stats for users dashboard - replace with real API call
  const userStats = [
    {
      title: "Total Users",
      value: tableQueryResult?.data?.total || 0,
      icon: <UserOutlined />,
      color: "#52c41a",
    },
    {
      title: "Active Users",
      value: tableQueryResult?.data?.data?.filter((user: any) => user.status === "active")?.length || 0,
      icon: <TeamOutlined />,
      color: "#1890ff",
    },
    {
      title: "Creators",
      value: tableQueryResult?.data?.data?.filter((user: any) => user.role === "creator")?.length || 0,
      icon: <BookOutlined />,
      color: "#722ed1",
    },
    {
      title: "Students",
      value: tableQueryResult?.data?.data?.filter((user: any) => user.role === "student")?.length || 0,
      icon: <UserOutlined />,
      color: "#13c2c2",
    },
  ];

  const userColumns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      width: 60,
      render: (value: any, record: any, index: number) => (
        <Tag color="blue" style={{ fontWeight: "bold", fontSize: 12 }}>
          {format.twoChar((index + 1).toString())}
        </Tag>
      ),
    },
    {
      title: "User",
      key: "user",
      render: (record: any) => (
        <div>
          <div style={{ fontWeight: "bold", marginBottom: 2 }}>
            {record.username || record.name}
          </div>
          <div style={{ fontSize: 11, color: "#666" }}>
            {record.email}
          </div>
        </div>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: 100,
      filters: [
        { text: "Admin", value: "admin" },
        { text: "Creator", value: "creator" },
        { text: "Student", value: "student" },
      ],
      onFilter: (value: any, record: any) => record.role === value,
      render: (value: string) => {
        const roleConfig = {
          admin: { color: "red", text: "Admin" },
          creator: { color: "purple", text: "Creator" },
          student: { color: "blue", text: "Student" },
        };
        const config = roleConfig[value as keyof typeof roleConfig] || {
          color: "default",
          text: value,
        };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: 140,
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      ellipsis: { showTitle: false },
      render: (text: string) => (
        <Tooltip title={text}>
          <span>{text || "No address"}</span>
        </Tooltip>
      ),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 140,
      sorter: (a: any, b: any) =>
        new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime(),
      render: (v: string) => (v ? new Date(v).toLocaleDateString() : "-"),
    },
    {
      title: "Actions",
      key: "actions",
      width: 200,
      render: (_: any, record: BaseRecord) => (
        <Space size="small">
          <Tooltip title="View details">
            <Button
              icon={<EyeOutlined />}
              size="small"
              ghost
              style={{ borderRadius: 8 }}
            />
          </Tooltip>
          <Tooltip title="Edit user">
            <Button
              type="primary"
              icon={<EditOutlined />}
              size="small"
              ghost
              style={{ borderRadius: 8 }}
            />
          </Tooltip>
          <Tooltip title="Delete user">
            <Button
              icon={<DeleteOutlined />}
              size="small"
              danger
              ghost
              style={{ borderRadius: 8 }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <EnhancedBreadcrumb
        items={[
          { title: "Dashboard", href: "/dashboard/creator" },
          { title: "Users" },
        ]}
        showBackButton
      />

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Title level={4}>User Statistics</Title>
        </Col>
        {userStats.map((stat, index) => (
          <Col sm={6} md={6} span={24} key={index}>
            <Card
              size="small"
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                border: "none",
              }}
            >
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={<span style={{ color: stat.color }}>{stat.icon}</span>}
                valueStyle={{ fontSize: 20 }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Users Table */}
      <Card
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          border: "none",
        }}
        title="All Users"
      >
        <Table
          {...tableProps}
          columns={userColumns}
          rowKey="id"
          size="small"
          pagination={{
            ...tableProps.pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} users`,
          }}
          scroll={{ x: 1000 }}
          rowClassName={(record, index) =>
            index % 2 === 0 ? "table-row-light" : "table-row-dark"
          }
        />
      </Card>
    </div>
  );
}
