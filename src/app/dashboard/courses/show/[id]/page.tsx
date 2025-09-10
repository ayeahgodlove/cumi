"use client";

import React, { useState } from "react";
import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import { BASE_URL_UPLOADS_MEDIA } from "@constants/api-url";
import { useShow } from "@refinedev/core";
import {
  Card,
  Row,
  Col,
  Typography,
  Tag,
  Space,
  Button,
  Table,
  Avatar,
  Progress,
  Divider,
  Statistic,
  Badge,
  Tooltip,
  Modal,
  Form,
  Select,
  DatePicker,
  message,
} from "antd";
import {
  BookOutlined,
  UserOutlined,
  PlayCircleOutlined,
  QuestionCircleOutlined,
  EditOutlined,
  ArrowLeftOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useList, useCreate, useUpdate, useDelete } from "@refinedev/core";
import { ICourse } from "@domain/models/course";
import { IEnrollment } from "@domain/models/enrollment";
import { ILesson } from "@domain/models/lesson";
import { IQuiz } from "@domain/models/quiz";
import { IUser } from "@domain/models/user";
import dayjs from "dayjs";

const { Title, Text } = Typography;

export default function CourseShow() {
  const router = useRouter();
  const [isEnrollmentModalVisible, setIsEnrollmentModalVisible] =
    useState(false);
  const [editingEnrollment, setEditingEnrollment] =
    useState<IEnrollment | null>(null);
  const [form] = Form.useForm();

  const { queryResult } = useShow<ICourse>({});
  const { data, isLoading } = queryResult;
  const course = data?.data;

  // Fetch related data
  const { data: enrollmentsData, refetch: refetchEnrollments } =
    useList<IEnrollment>({
      resource: "enrollments",
      filters: course
        ? [
            {
              field: "courseId",
              operator: "eq",
              value: course.id,
            },
          ]
        : [],
    });

  const { data: lessonsData } = useList<ILesson>({
    resource: "lessons",
    filters: course
      ? [
          {
            field: "courseId",
            operator: "eq",
            value: course.id,
          },
        ]
      : [],
  });

  const { data: quizesData } = useList<IQuiz>({
    resource: "quizes",
    filters: lessonsData?.data
      ? [
          {
            field: "lessonId",
            operator: "in",
            value: lessonsData.data.map((lesson) => lesson.id),
          },
        ]
      : [],
  });

  const { data: usersData } = useList<IUser>({
    resource: "users",
  });

  const enrollments = enrollmentsData?.data || [];
  const lessons = lessonsData?.data || [];
  const quizes = quizesData?.data || [];
  const users = usersData?.data || [];

  // Create enrollment mutation
  const { mutate: createEnrollment } = useCreate();

  // Update enrollment mutation
  const { mutate: updateEnrollment } = useUpdate();

  // Delete enrollment mutation
  const { mutate: deleteEnrollment } = useDelete();

  const handleCreateEnrollment = () => {
    setEditingEnrollment(null);
    form.resetFields();
    setIsEnrollmentModalVisible(true);
  };

  const handleEditEnrollment = (enrollment: IEnrollment) => {
    setEditingEnrollment(enrollment);
    form.setFieldsValue({
      userId: enrollment.userId,
      enrollmentDate: dayjs(enrollment.enrollmentDate),
      completionDate: dayjs(enrollment.completionDate),
    });
    setIsEnrollmentModalVisible(true);
  };

  const handleDeleteEnrollment = (enrollmentId: string) => {
    deleteEnrollment(
      {
        resource: "enrollments",
        id: enrollmentId,
      },
      {
        onSuccess: () => {
          message.success("Enrollment deleted successfully");
          refetchEnrollments();
        },
        onError: () => {
          message.error("Failed to delete enrollment");
        },
      }
    );
  };

  const handleEnrollmentSubmit = async () => {
    try {
      const values = await form.validateFields();

      const enrollmentData = {
        ...values,
        courseId: course?.id,
        enrollmentDate: values.enrollmentDate.format("YYYY-MM-DD"),
        completionDate: values.completionDate.format("YYYY-MM-DD"),
      };

      if (editingEnrollment) {
        updateEnrollment(
          {
            resource: "enrollments",
            id: editingEnrollment.id,
            values: enrollmentData,
          },
          {
            onSuccess: () => {
              message.success("Enrollment updated successfully");
              setIsEnrollmentModalVisible(false);
              refetchEnrollments();
            },
            onError: () => {
              message.error("Failed to update enrollment");
            },
          }
        );
      } else {
        createEnrollment(
          {
            resource: "enrollments",
            values: enrollmentData,
          },
          {
            onSuccess: () => {
              message.success("Enrollment created successfully");
              setIsEnrollmentModalVisible(false);
              refetchEnrollments();
            },
            onError: () => {
              message.error("Failed to create enrollment");
            },
          }
        );
      }
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  // Calculate statistics
  const activeEnrollments = enrollments.filter((e) => {
    const enrollmentDate = new Date(e.enrollmentDate);
    const completionDate = new Date(e.completionDate);
    const now = new Date();
    return now >= enrollmentDate && now < completionDate;
  }).length;

  const completedEnrollments = enrollments.filter((e) => {
    const completionDate = new Date(e.completionDate);
    const now = new Date();
    return now >= completionDate;
  }).length;

  const completionRate =
    enrollments.length > 0
      ? (completedEnrollments / enrollments.length) * 100
      : 0;

  const enrollmentColumns = [
    {
      title: "Student",
      dataIndex: "userId",
      key: "userId",
      render: (userId: string) => {
        const user = users.find((u) => u.id === userId);
        return (
          <Space>
            <Avatar icon={<UserOutlined />} />
            <Text strong>{user?.fullName || "Unknown User"}</Text>
          </Space>
        );
      },
    },
    {
      title: "Enrollment Date",
      dataIndex: "enrollmentDate",
      key: "enrollmentDate",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Completion Date",
      dataIndex: "completionDate",
      key: "completionDate",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Status",
      key: "status",
      render: (record: IEnrollment) => {
        const enrollmentDate = new Date(record.enrollmentDate);
        const completionDate = new Date(record.completionDate);
        const now = new Date();

        let status = "Pending";
        let color = "orange";

        if (now >= completionDate) {
          status = "Completed";
          color = "green";
        } else if (now >= enrollmentDate) {
          status = "In Progress";
          color = "blue";
        }

        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: IEnrollment) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditEnrollment(record)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteEnrollment(record.id)}
          />
        </Space>
      ),
    },
  ];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <PageBreadCrumbs items={["Dashboard", "LMS", "Course Details"]} />

      <div
        style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}
      >
        {/* Header Section */}
        <Card style={{ marginBottom: 24, borderRadius: 12 }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Space>
                <Button
                  icon={<ArrowLeftOutlined />}
                  onClick={() => router.push("/dashboard/lms")}
                >
                  Back to LMS
                </Button>
                <Divider type="vertical" />
                <Title level={2} style={{ margin: 0 }}>
                  <BookOutlined style={{ marginRight: 8, color: "#1890ff" }} />
                  {course?.title || "Course Details"}
                </Title>
              </Space>
            </Col>
            <Col>
              <Space>
                <Button
                  icon={<EditOutlined />}
                  onClick={() =>
                    router.push(`/dashboard/courses/edit/${course?.id}`)
                  }
                >
                  Edit Course
                </Button>
                <Button
                  type="primary"
                  icon={<PlayCircleOutlined />}
                  onClick={() =>
                    router.push(`/dashboard/courses/${course?.id}/lessons`)
                  }
                >
                  Manage Lessons
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        <Row gutter={[16, 16]}>
          {/* Course Information */}
          <Col xs={24} lg={16}>
            <Card
              title="Course Information"
              style={{ borderRadius: 12, marginBottom: 16 }}
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Title level={4}>{course?.title}</Title>
                  <Text type="secondary">{course?.description}</Text>
                </Col>
                <Col xs={24} md={12}>
                  {course?.imageUrl && (
                    <img
                      src={`${BASE_URL_UPLOADS_MEDIA}/${course.imageUrl}`}
                      alt={course.title}
                      style={{
                        width: "100%",
                        height: 200,
                        objectFit: "cover",
                        borderRadius: 8,
                      }}
                    />
                  )}
                </Col>
              </Row>
            </Card>

            {/* Course Statistics */}
            <Card title="Course Statistics" style={{ borderRadius: 12 }}>
              <Row gutter={[16, 16]}>
                <Col xs={12} sm={6}>
                  <Statistic
                    title="Total Enrollments"
                    value={enrollments.length}
                    prefix={<TeamOutlined style={{ color: "#1890ff" }} />}
                    valueStyle={{ color: "#1890ff" }}
                  />
                </Col>
                <Col xs={12} sm={6}>
                  <Statistic
                    title="Active Students"
                    value={activeEnrollments}
                    prefix={<UserOutlined style={{ color: "#52c41a" }} />}
                    valueStyle={{ color: "#52c41a" }}
                  />
                </Col>
                <Col xs={12} sm={6}>
                  <Statistic
                    title="Completed"
                    value={completedEnrollments}
                    prefix={<TrophyOutlined style={{ color: "#faad14" }} />}
                    valueStyle={{ color: "#faad14" }}
                  />
                </Col>
                <Col xs={12} sm={6}>
                  <Statistic
                    title="Completion Rate"
                    value={Math.round(completionRate)}
                    suffix="%"
                    prefix={
                      <ClockCircleOutlined style={{ color: "#722ed1" }} />
                    }
                    valueStyle={{ color: "#722ed1" }}
                  />
                </Col>
              </Row>
              <Progress
                percent={Math.round(completionRate)}
                strokeColor={{
                  "0%": "#108ee9",
                  "100%": "#87d068",
                }}
                style={{ marginTop: 16 }}
              />
            </Card>
          </Col>

          {/* Course Content Overview */}
          <Col xs={24} lg={8}>
            <Card
              title="Course Content"
              style={{ borderRadius: 12, marginBottom: 16 }}
            >
              <Space
                direction="vertical"
                style={{ width: "100%" }}
                size="middle"
              >
                <Card
                  hoverable
                  onClick={() =>
                    router.push(`/dashboard/courses/${course?.id}/lessons`)
                  }
                  style={{ borderRadius: 8, border: "2px solid #1890ff20" }}
                >
                  <Row align="middle" gutter={12}>
                    <Col>
                      <PlayCircleOutlined
                        style={{ fontSize: 24, color: "#1890ff" }}
                      />
                    </Col>
                    <Col flex={1}>
                      <Text strong style={{ color: "#1890ff" }}>
                        Lessons
                      </Text>
                      <br />
                      <Text type="secondary">
                        {lessons.length} lessons available
                      </Text>
                    </Col>
                    <Col>
                      <Badge
                        count={lessons.length}
                        style={{ backgroundColor: "#1890ff" }}
                      />
                    </Col>
                  </Row>
                </Card>

                <Card
                  hoverable
                  onClick={() => router.push(`/dashboard/quizes`)}
                  style={{ borderRadius: 8, border: "2px solid #722ed120" }}
                >
                  <Row align="middle" gutter={12}>
                    <Col>
                      <QuestionCircleOutlined
                        style={{ fontSize: 24, color: "#722ed1" }}
                      />
                    </Col>
                    <Col flex={1}>
                      <Text strong style={{ color: "#722ed1" }}>
                        Quizzes
                      </Text>
                      <br />
                      <Text type="secondary">
                        {quizes.length} quizzes available
                      </Text>
                    </Col>
                    <Col>
                      <Badge
                        count={quizes.length}
                        style={{ backgroundColor: "#722ed1" }}
                      />
                    </Col>
                  </Row>
                </Card>
              </Space>
            </Card>

            {/* Quick Actions */}
            <Card title="Quick Actions" style={{ borderRadius: 12 }}>
              <Space
                direction="vertical"
                style={{ width: "100%" }}
                size="middle"
              >
                <Button
                  type="primary"
                  icon={<UserOutlined />}
                  onClick={handleCreateEnrollment}
                  block
                >
                  Enroll Student
                </Button>
                <Button
                  icon={<PlayCircleOutlined />}
                  onClick={() =>
                    router.push(`/dashboard/courses/${course?.id}/lessons`)
                  }
                  block
                >
                  Manage Lessons
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>

        {/* Enrollments Management */}
        <Card
          title={
            <span>
              <TeamOutlined style={{ marginRight: 8, color: "#1890ff" }} />
              Student Enrollments ({enrollments.length})
            </span>
          }
          style={{ marginTop: 16, borderRadius: 12 }}
          extra={
            <Button
              type="primary"
              icon={<UserOutlined />}
              onClick={handleCreateEnrollment}
            >
              Enroll Student
            </Button>
          }
        >
          <Table
            columns={enrollmentColumns}
            dataSource={enrollments}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            size="middle"
          />
        </Card>

        {/* Enrollment Modal */}
        <Modal
          title={editingEnrollment ? "Edit Enrollment" : "Enroll Student"}
          open={isEnrollmentModalVisible}
          onOk={handleEnrollmentSubmit}
          onCancel={() => setIsEnrollmentModalVisible(false)}
          width={500}
        >
          <Form form={form} layout="vertical" requiredMark={false}>
            <Form.Item
              name="userId"
              label="Student"
              rules={[{ required: true, message: "Please select a student" }]}
            >
              <Select
                placeholder="Select a student"
                showSearch
                options={users.map((user) => ({
                  label: user.fullName,
                  value: user.id,
                }))}
              />
            </Form.Item>

            <Form.Item
              name="enrollmentDate"
              label="Enrollment Date"
              rules={[
                { required: true, message: "Please select enrollment date" },
              ]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              name="completionDate"
              label="Expected Completion Date"
              rules={[
                { required: true, message: "Please select completion date" },
              ]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  );
}
