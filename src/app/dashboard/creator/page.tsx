"use client";

import React, { useState, useRef } from "react";
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
  Spin,
  Tabs,
  message,
  Modal,
  Descriptions,
  Popconfirm,
} from "antd";
import {
  BookOutlined,
  CalendarOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SettingOutlined,
  UserOutlined,
  MessageOutlined,
  LikeOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useSession } from "next-auth/react";
import { useTranslation } from "@contexts/translation.context";
import { statsAPI } from "@store/api/stats_api";
import { commentAPI } from "@store/api/comment_api";
import { postInteractionAPI } from "@store/api/post-interaction_api";
import { eventRegistrationAPI } from "@store/api/event-registration_api";
import { useTable } from "@refinedev/antd";
import { useNotification as useCoreNotification } from "@refinedev/core";
import { BaseRecord } from "@refinedev/core";
import { format } from "@utils/format";
import { useRouter } from "next/navigation";
import CourseCreateModal from "@components/modals/CourseCreateModal";
import PostCreateModal from "@components/modals/PostCreateModal";
import EventCreateModal from "@components/modals/EventCreateModal";
import CourseManagementModal from "@components/modals/CourseManagementModal";
import EnhancedBreadcrumb from "@components/shared/enhanced-breadcrumb/enhanced-breadcrumb.component";

const { Title, Text } = Typography;

export default function CreatorDashboard() {
  const { data: session, status } = useSession();
  const { t } = useTranslation();
  const { open } = useCoreNotification();
  const router = useRouter();

  // Modal states
  const [courseModalVisible, setCourseModalVisible] = useState(false);
  const [postModalVisible, setPostModalVisible] = useState(false);
  const [eventModalVisible, setEventModalVisible] = useState(false);
  const [courseManagementVisible, setCourseManagementVisible] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [editingCourse, setEditingCourse] = useState<any>(null);

  // View modal states
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [viewModalData, setViewModalData] = useState<any>(null);
  const [viewModalType, setViewModalType] = useState<
    "course" | "post" | "event"
  >("course");

  // Management modal states
  const [eventManagementVisible, setEventManagementVisible] = useState(false);
  const [postManagementVisible, setPostManagementVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [selectedPost, setSelectedPost] = useState<any>(null);

  // API calls for management data
  const { data: eventRegistrations } = eventRegistrationAPI.useGetEventRegistrationsByEventQuery(
    selectedEvent?.id || "",
    { skip: !selectedEvent?.id }
  );

  const { data: postComments } = commentAPI.useGetCommentsByPostIdQuery(
    selectedPost?.id || "",
    { skip: !selectedPost?.id }
  );

  const { data: postStats } = postInteractionAPI.useGetPostStatsQuery(
    { postId: selectedPost?.id || '', userId: session?.user?.id },
    { skip: !selectedPost?.id }
  );

  // Table refs for focus management
  const coursesTableRef = useRef<any>(null);
  const postsTableRef = useRef<any>(null);
  const eventsTableRef = useRef<any>(null);

  // Fetch stats data
  const statsQuery = statsAPI.useGetDashboardStatsQuery(undefined, {
    skip: !session?.user,
    refetchOnMountOrArgChange: true,
  });

  const stats = statsQuery.data?.overview || {
    totalUsers: 0,
    totalPosts: 0,
    totalEvents: 0,
    totalCourses: 0,
    totalProjects: 0,
    totalOpportunities: 0,
    totalServices: 0,
    totalProfessionals: 0,
    totalBanners: 0,
    totalContactMessages: 0,
    totalSubscribers: 0,
    totalComments: 0,
    totalPostLikes: 0,
    totalCommentLikes: 0,
    totalUserLikes: 0,
    totalUserComments: 0,
    // Course-specific stats for creators
    totalCourseEnrollments: 0,
    totalCourseModules: 0,
    totalCourseAssignments: 0,
    totalCourseProgress: 0,
  };

  // Table configurations
  const {
    tableProps: coursesTableProps,
    tableQueryResult: coursesQueryResult,
  } = useTable({
    resource: "courses",
    syncWithLocation: true,
  });

  const { tableProps: postsTableProps, tableQueryResult: postsQueryResult } =
    useTable({
      resource: "posts",
      syncWithLocation: true,
    });

  const { tableProps: eventsTableProps, tableQueryResult: eventsQueryResult } =
    useTable({
      resource: "events",
      syncWithLocation: true,
    });

  // Handle successful creation
  const handleCreationSuccess = (type: "course" | "post" | "event") => {
    message.success(
      `${type.charAt(0).toUpperCase() + type.slice(1)} created successfully!`
    );

    // Refetch the appropriate table data
    switch (type) {
      case "course":
        coursesQueryResult.refetch();
        // Focus on courses table
        setTimeout(() => {
          coursesTableRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
        break;
      case "post":
        postsQueryResult.refetch();
        // Focus on posts table
        setTimeout(() => {
          postsTableRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
        break;
      case "event":
        eventsQueryResult.refetch();
        // Focus on events table
        setTimeout(() => {
          eventsTableRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
        break;
    }

    // Refetch stats
    statsQuery.refetch();
  };

  // Handle event management
  const handleEventManagement = (event: any) => {
    setSelectedEvent(event);
    setEventManagementVisible(true);
  };

  // Handle post management
  const handlePostManagement = (post: any) => {
    setSelectedPost(post);
    setPostManagementVisible(true);
  };

  // Handle comment approval
  const handleCommentApproval = async (commentId: string, isApproved: boolean) => {
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isApproved: isApproved,
        }),
      });

      if (response.ok) {
        message.success(isApproved ? 'Comment approved!' : 'Comment rejected!');
        // Refetch comments to update the table
        if (selectedPost?.id) {
          // The RTK Query will automatically refetch due to cache invalidation
        }
      } else {
        message.error('Failed to update comment status');
      }
    } catch (error) {
      console.error('Error updating comment:', error);
      message.error('Failed to update comment status');
    }
  };

  // Handle comment deletion
  const handleCommentDeletion = async (commentId: string) => {
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        message.success('Comment deleted!');
        // Refetch comments to update the table
      } else {
        message.error('Failed to delete comment');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      message.error('Failed to delete comment');
    }
  };

  // Handle view action
  const handleView = async (
    record: BaseRecord,
    type: "course" | "post" | "event"
  ) => {
    try {
      const response = await fetch(`/api/${type}s/${record.id}`);
      const data = await response.json();

      if (response.ok) {
        setViewModalData(data);
        setViewModalType(type);
        setViewModalVisible(true);
      } else {
        open?.({
          type: "error",
          message: "Error",
          description: `Failed to fetch ${type} details: ${data.message}`,
        });
      }
    } catch (error: any) {
      open?.({
        type: "error",
        message: "Error",
        description: `Failed to fetch ${type} details: ${error.message}`,
      });
    }
  };

  // Handle edit action
  const handleEdit = (
    record: BaseRecord,
    type: "course" | "post" | "event"
  ) => {
    if (type === "course") {
      setEditingCourse(record);
      setCourseModalVisible(true);
    } else {
      // For posts and events, we can implement edit modals later
      message.info(`Edit functionality for ${type}s will be implemented soon.`);
    }
  };

  // Handle delete action
  const handleDelete = async (
    record: BaseRecord,
    type: "course" | "post" | "event"
  ) => {
    try {
      const response = await fetch(`/api/${type}s/${record.id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (response.ok) {
        open?.({
          type: "success",
          message: "Success",
          description: `${
            type.charAt(0).toUpperCase() + type.slice(1)
          } deleted successfully!`,
        });

        // Refetch the appropriate table data
        switch (type) {
          case "course":
            coursesQueryResult.refetch();
            break;
          case "post":
            postsQueryResult.refetch();
            break;
          case "event":
            eventsQueryResult.refetch();
            break;
        }

        // Refetch stats
        statsQuery.refetch();
      } else {
        open?.({
          type: "error",
          message: "Error",
          description: `Failed to delete ${type}: ${data.message}`,
        });
      }
    } catch (error: any) {
      open?.({
        type: "error",
        message: "Error",
        description: `Failed to delete ${type}: ${error.message}`,
      });
    }
  };

  // Show loading while session is loading
  if (status === "loading") {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  // Only render creator dashboard for creator/student users
  if (
    !session?.user ||
    !["creator", "student"].includes(session.user.role || "")
  ) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  // Creator-specific stats
  const creatorStats = [
    {
      title: "My Courses",
      value: stats.totalCourses,
      icon: <BookOutlined />,
      color: "#52c41a",
    },
    {
      title: "Course Modules",
      value: stats.totalCourseModules,
      icon: <CalendarOutlined />,
      color: "#1890ff",
    },
    {
      title: "Course Assignments",
      value: stats.totalCourseAssignments,
      icon: <CalendarOutlined />,
      color: "#13c2c2",
    },
    {
      title: "My Posts",
      value: stats.totalPosts,
      icon: <BookOutlined />,
      color: "#722ed1",
    },
    {
      title: "Post Likes Received",
      value: stats.totalPostLikes,
      icon: <CalendarOutlined />,
      color: "#fa8c16",
    },
    {
      title: "Comment Likes Received",
      value: stats.totalCommentLikes,
      icon: <CalendarOutlined />,
      color: "#eb2f96",
    },
    {
      title: "My Comments",
      value: stats.totalUserComments,
      icon: <CalendarOutlined />,
      color: "#52c41a",
    },
  ];

  // Table columns
  const courseColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (value: any, record: any, index: number) =>
        format.twoChar((index + 1).toString()),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (value: any, record: any) => (
        <span>
          {record.isFree ? (
            <Tag color="green">Free</Tag>
          ) : (
            `${value || 0} ${record.currency || "XAF"}`
          )}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (value: string) => {
        const colorMap = {
          draft: "orange",
          published: "green",
          archived: "gray",
          suspended: "red",
        };
        return (
          <Tag color={colorMap[value as keyof typeof colorMap] || "default"}>
            {value}
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: BaseRecord) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleView(record, "course")}
            title="View Course"
          />
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record, "course")}
            title="Edit Course"
          />
          <Button
            type="primary"
            size="small"
            onClick={() => router.push(`/dashboard/courses/${record.id}`)}
            title="Manage Course"
          >
            Manage
          </Button>
          <Popconfirm
            title="Delete Course"
            description="Are you sure you want to delete this course?"
            onConfirm={() => handleDelete(record, "course")}
            okText="Yes"
            cancelText="No"
          >
            <Button
              icon={<DeleteOutlined />}
              size="small"
              danger
              title="Delete Course"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const postColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (value: any, record: any, index: number) =>
        format.twoChar((index + 1).toString()),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (value: string) => {
        const colorMap = {
          draft: "orange",
          published: "green",
          archived: "gray",
        };
        return (
          <Tag color={colorMap[value as keyof typeof colorMap] || "default"}>
            {value}
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: BaseRecord) => (
        <Space>
          <Button
            icon={<SettingOutlined />}
            size="small"
            type="primary"
            onClick={() => handlePostManagement(record)}
            title="Manage Post"
          >
            Manage
          </Button>
          <Button
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleView(record, "post")}
            title="View Post"
          />
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record, "post")}
            title="Edit Post"
          />
          <Popconfirm
            title="Delete Post"
            description="Are you sure you want to delete this post?"
            onConfirm={() => handleDelete(record, "post")}
            okText="Yes"
            cancelText="No"
          >
            <Button
              icon={<DeleteOutlined />}
              size="small"
              danger
              title="Delete Post"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const eventColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (value: any, record: any, index: number) =>
        format.twoChar((index + 1).toString()),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Event Date",
      dataIndex: "eventDate",
      key: "eventDate",
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (value: string) => {
        const colorMap = {
          draft: "orange",
          published: "green",
          cancelled: "red",
          completed: "blue",
        };
        return (
          <Tag color={colorMap[value as keyof typeof colorMap] || "default"}>
            {value}
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: BaseRecord) => (
        <Space>
          <Button
            icon={<SettingOutlined />}
            size="small"
            type="primary"
            onClick={() => handleEventManagement(record)}
            title="Manage Event"
          >
            Manage
          </Button>
          <Button
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleView(record, "event")}
            title="View Event"
          />
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record, "event")}
            title="Edit Event"
          />
          <Popconfirm
            title="Delete Event"
            description="Are you sure you want to delete this event?"
            onConfirm={() => handleDelete(record, "event")}
            okText="Yes"
            cancelText="No"
          >
            <Button
              icon={<DeleteOutlined />}
              size="small"
              danger
              title="Delete Event"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const tabItems = [
    {
      key: "courses",
      label: "Courses",
      children: (
        <div ref={coursesTableRef}>
          <div
            style={{
              marginBottom: 16,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Title level={4}>My Courses</Title>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setCourseModalVisible(true)}
            >
              Create Course
            </Button>
          </div>
          <Table
            {...coursesTableProps}
            columns={courseColumns}
            rowKey="id"
            pagination={{
              ...coursesTableProps.pagination,
              showSizeChanger: true,
              showQuickJumper: true,
            }}
          />
        </div>
      ),
    },
    {
      key: "posts",
      label: "Posts",
      children: (
        <div ref={postsTableRef}>
          <div
            style={{
              marginBottom: 16,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Title level={4}>My Posts</Title>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setPostModalVisible(true)}
            >
              Create Post
            </Button>
          </div>
          <Table
            {...postsTableProps}
            columns={postColumns}
            rowKey="id"
            pagination={{
              ...postsTableProps.pagination,
              showSizeChanger: true,
              showQuickJumper: true,
            }}
          />
        </div>
      ),
    },
    {
      key: "events",
      label: "Events",
      children: (
        <div ref={eventsTableRef}>
          <div
            style={{
              marginBottom: 16,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Title level={4}>My Events</Title>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setEventModalVisible(true)}
            >
              Create Event
            </Button>
          </div>
          <Table
            {...eventsTableProps}
            columns={eventColumns}
            rowKey="id"
            pagination={{
              ...eventsTableProps.pagination,
              showSizeChanger: true,
              showQuickJumper: true,
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <EnhancedBreadcrumb items={[]} showBackButton={false} />
      <Title level={4}>Creator Dashboard</Title>
      {/* Creator Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Title level={4}>Your Statistics</Title>
        </Col>
        {creatorStats.map((stat, index) => (
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

      {/* Content Management Tabs */}
      <Card
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          border: "none",
        }}
      >
        <Tabs defaultActiveKey="courses" items={tabItems} />
      </Card>

      {/* Modals */}
      <CourseCreateModal
        visible={courseModalVisible}
        onCancel={() => {
          setCourseModalVisible(false);
          setEditingCourse(null);
        }}
        onSuccess={() => handleCreationSuccess("course")}
        editingCourse={editingCourse}
      />

      <PostCreateModal
        visible={postModalVisible}
        onCancel={() => setPostModalVisible(false)}
        onSuccess={() => handleCreationSuccess("post")}
      />

      <EventCreateModal
        visible={eventModalVisible}
        onCancel={() => setEventModalVisible(false)}
        onSuccess={() => handleCreationSuccess("event")}
      />

      <CourseManagementModal
        visible={courseManagementVisible}
        onCancel={() => {
          setCourseManagementVisible(false);
          setSelectedCourse(null);
        }}
        courseId={selectedCourse?.id}
        courseTitle={selectedCourse?.title}
      />

      {/* View Modal */}
      <Modal
        title={`View ${
          viewModalType.charAt(0).toUpperCase() + viewModalType.slice(1)
        } Details`}
        open={viewModalVisible}
        onCancel={() => {
          setViewModalVisible(false);
          setViewModalData(null);
        }}
        footer={[
          <Button
            key="close"
            onClick={() => {
              setViewModalVisible(false);
              setViewModalData(null);
            }}
          >
            Close
          </Button>,
        ]}
        width={800}
      >
        {viewModalData && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="ID">{viewModalData.id}</Descriptions.Item>
            <Descriptions.Item label="Title">
              {viewModalData.title}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag
                color={
                  viewModalData.status === "published"
                    ? "green"
                    : viewModalData.status === "draft"
                    ? "orange"
                    : viewModalData.status === "archived"
                    ? "gray"
                    : viewModalData.status === "cancelled"
                    ? "red"
                    : viewModalData.status === "completed"
                    ? "blue"
                    : "default"
                }
              >
                {viewModalData.status}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Created At">
              {new Date(viewModalData.createdAt).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Updated At">
              {new Date(viewModalData.updatedAt).toLocaleString()}
            </Descriptions.Item>

            {/* Course-specific fields */}
            {viewModalType === "course" && (
              <>
                <Descriptions.Item label="Author">
                  {viewModalData.authorName}
                </Descriptions.Item>
                <Descriptions.Item label="Price">
                  {viewModalData.isFree ? (
                    <Tag color="green">Free</Tag>
                  ) : (
                    `${viewModalData.price || 0} ${
                      viewModalData.currency || "XAF"
                    }`
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Level">
                  {viewModalData.level}
                </Descriptions.Item>
                <Descriptions.Item label="Language">
                  {viewModalData.language}
                </Descriptions.Item>
                <Descriptions.Item label="Description" span={2}>
                  {viewModalData.description}
                </Descriptions.Item>
              </>
            )}

            {/* Post-specific fields */}
            {viewModalType === "post" && (
              <>
                <Descriptions.Item label="Excerpt" span={2}>
                  {viewModalData.description}
                </Descriptions.Item>
                <Descriptions.Item label="Content" span={2}>
                  <div
                    dangerouslySetInnerHTML={{ __html: viewModalData.content }}
                  />
                </Descriptions.Item>
              </>
            )}

            {/* Event-specific fields */}
            {viewModalType === "event" && (
              <>
                <Descriptions.Item label="Event Date">
                  {new Date(viewModalData.eventDate).toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label="Location">
                  {viewModalData.location}
                </Descriptions.Item>
                <Descriptions.Item label="Category">
                  {viewModalData.category}
                </Descriptions.Item>
                <Descriptions.Item label="Description" span={2}>
                  {viewModalData.description}
                </Descriptions.Item>
                <Descriptions.Item label="Content" span={2}>
                  <div
                    dangerouslySetInnerHTML={{ __html: viewModalData.content }}
                  />
                </Descriptions.Item>
              </>
            )}
          </Descriptions>
        )}
      </Modal>

      {/* Event Management Modal */}
      <Modal
        title={`Manage Event: ${selectedEvent?.title || 'Event'}`}
        open={eventManagementVisible}
        onCancel={() => {
          setEventManagementVisible(false);
          setSelectedEvent(null);
        }}
        footer={[
          <Button key="close-event-mgmt" onClick={() => setEventManagementVisible(false)} size="large">
            Close
          </Button>,
          <Button
            key="view-full-event-mgmt"
            type="primary"
            onClick={() => {
              if (selectedEvent?.slug) {
                router.push(`/events/${selectedEvent.slug}`);
              } else {
                router.push(`/events/${selectedEvent?.id}`);
              }
              setEventManagementVisible(false);
            }}
            size="large"
          >
            View Full Event
          </Button>,
        ]}
        width={1000}
      >
        {selectedEvent && (
          <Card style={{ backgroundColor: 'white', border: 'none' }}>
            <Row gutter={[16, 16]}>
              {/* Event Details */}
              <Col xs={24} lg={12}>
                <Card title="Event Details" style={{ backgroundColor: '#f8f9fa', marginBottom: 16 }}>
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="Title">{selectedEvent.title}</Descriptions.Item>
                    <Descriptions.Item label="Date">
                      {selectedEvent.eventDate ? new Date(selectedEvent.eventDate).toLocaleDateString() : 'TBD'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Location">{selectedEvent.location || 'Online'}</Descriptions.Item>
                    <Descriptions.Item label="Status">
                      <Tag color={selectedEvent.status === 'published' ? 'green' : selectedEvent.status === 'cancelled' ? 'red' : 'orange'}>
                        {selectedEvent.status}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Entry Fee">
                      {selectedEvent.isFree ? (
                        <Tag color="green">Free Event</Tag>
                      ) : (
                        `${selectedEvent.entryFee || 0} ${selectedEvent.currency || 'XAF'}`
                      )}
                    </Descriptions.Item>
                    <Descriptions.Item label="Max Attendees">
                      {selectedEvent.maxAttendees || 'Unlimited'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Current Attendees">
                      {selectedEvent.currentAttendees || 0}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>

                {/* Event Stats */}
                <Card title="Event Statistics" style={{ backgroundColor: '#f0f8ff' }}>
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <Statistic
                        title="Total Registrations"
                        value={eventRegistrations?.length || 0}
                        prefix={<TeamOutlined />}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title="Registration Rate"
                        value={selectedEvent.maxAttendees ? 
                          Math.round(((selectedEvent.currentAttendees || 0) / selectedEvent.maxAttendees) * 100) : 0
                        }
                        suffix="%"
                        prefix={<UserOutlined />}
                      />
                    </Col>
                  </Row>
                </Card>
              </Col>

              {/* Event Registrations Table */}
              <Col xs={24} lg={12}>
                <Card title="Event Registrations" style={{ backgroundColor: '#f0f8ff' }}>
                  <Table
                    dataSource={eventRegistrations || []}
                    columns={[
                      {
                        title: 'Name',
                        dataIndex: 'name',
                        key: 'name',
                      },
                      {
                        title: 'Email',
                        dataIndex: 'email',
                        key: 'email',
                      },
                      {
                        title: 'Phone',
                        dataIndex: 'phone',
                        key: 'phone',
                      },
                      {
                        title: 'Status',
                        dataIndex: 'status',
                        key: 'status',
                        render: (status: string) => (
                          <Tag color={status === 'confirmed' ? 'green' : status === 'cancelled' ? 'red' : 'orange'}>
                            {status}
                          </Tag>
                        ),
                      },
                      {
                        title: 'Registration Date',
                        dataIndex: 'registrationDate',
                        key: 'registrationDate',
                        render: (date: string) => new Date(date).toLocaleDateString(),
                      },
                    ]}
                    size="small"
                    pagination={{ pageSize: 5 }}
                    locale={{ emptyText: 'No registrations yet' }}
                  />
                </Card>
              </Col>
            </Row>
          </Card>
        )}
      </Modal>

      {/* Post Management Modal */}
      <Modal
        title={`Manage Post: ${selectedPost?.title || 'Post'}`}
        open={postManagementVisible}
        onCancel={() => {
          setPostManagementVisible(false);
          setSelectedPost(null);
        }}
        footer={[
          <Button key="close-post-mgmt" onClick={() => setPostManagementVisible(false)} size="large">
            Close
          </Button>,
          <Button
            key="view-full-post-mgmt"
            type="primary"
            onClick={() => {
              if (selectedPost?.slug) {
                router.push(`/blog_posts/${selectedPost.slug}`);
              } else {
                router.push(`/blog_posts/${selectedPost?.id}`);
              }
              setPostManagementVisible(false);
            }}
            size="large"
          >
            View Full Post
          </Button>,
        ]}
        width={1200}
      >
        {selectedPost && (
          <Card style={{ backgroundColor: 'white', border: 'none' }}>
            <Row gutter={[16, 16]}>
              {/* Post Details */}
              <Col xs={24} lg={8}>
                <Card title="Post Details" style={{ backgroundColor: '#f8f9fa', marginBottom: 16 }}>
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="Title">{selectedPost.title}</Descriptions.Item>
                    <Descriptions.Item label="Status">
                      <Tag color={selectedPost.status === 'published' ? 'green' : selectedPost.status === 'draft' ? 'orange' : 'default'}>
                        {selectedPost.status}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Published">
                      {selectedPost.publishedAt ? new Date(selectedPost.publishedAt).toLocaleDateString() : 'Draft'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Category">{selectedPost.categoryId || 'Uncategorized'}</Descriptions.Item>
                    <Descriptions.Item label="Description">{selectedPost.description}</Descriptions.Item>
                  </Descriptions>
                </Card>

                {/* Post Stats */}
                <Card title="Post Statistics" style={{ backgroundColor: '#f0f8ff' }}>
                  <Row gutter={[16, 16]}>
                    <Col span={24}>
                      <Statistic
                        title="Total Comments"
                        value={postComments?.length || 0}
                        prefix={<MessageOutlined />}
                      />
                    </Col>
                    <Col span={24}>
                      <Statistic
                        title="Total Likes"
                        value={postStats?.likesCount || 0}
                        prefix={<LikeOutlined />}
                      />
                    </Col>
                  </Row>
                </Card>
              </Col>

              {/* Post Comments Management */}
              <Col xs={24} lg={16}>
                <Card title="Comments Management" style={{ backgroundColor: '#f0f8ff' }}>
                  <Table
                    dataSource={postComments || []}
                    columns={[
                      {
                        title: 'User',
                        dataIndex: 'user',
                        key: 'user',
                        render: (user: any, record: any) => (
                          <Space>
                            <UserOutlined />
                            <Text>{user?.name || user?.username || record.userId}</Text>
                          </Space>
                        ),
                      },
                      {
                        title: 'Comment',
                        dataIndex: 'content',
                        key: 'content',
                        render: (content: string) => (
                          <div style={{ maxWidth: 300 }}>
                            {content?.length > 100 ? `${content.substring(0, 100)}...` : content}
                          </div>
                        ),
                      },
                      {
                        title: 'Date',
                        dataIndex: 'createdAt',
                        key: 'createdAt',
                        render: (date: string) => new Date(date).toLocaleDateString(),
                      },
                      {
                        title: 'Status',
                        dataIndex: 'isApproved',
                        key: 'isApproved',
                        render: (isApproved: boolean) => (
                          <Tag color={isApproved ? 'green' : 'orange'}>
                            {isApproved ? 'Approved' : 'Pending'}
                          </Tag>
                        ),
                      },
                      {
                        title: 'Actions',
                        key: 'actions',
                        render: (_: any, record: any) => (
                          <Space>
                            {!record.isApproved && (
                              <Button
                                type="primary"
                                size="small"
                                onClick={() => handleCommentApproval(record.id, true)}
                              >
                                Approve
                              </Button>
                            )}
                            {record.isApproved && (
                              <Button
                                size="small"
                                onClick={() => handleCommentApproval(record.id, false)}
                              >
                                Reject
                              </Button>
                            )}
                            <Popconfirm
                              title="Delete Comment"
                              description="Are you sure you want to delete this comment?"
                              onConfirm={() => handleCommentDeletion(record.id)}
                              okText="Yes"
                              cancelText="No"
                            >
                              <Button
                                danger
                                size="small"
                              >
                                Delete
                              </Button>
                            </Popconfirm>
                          </Space>
                        ),
                      },
                    ]}
                    size="small"
                    pagination={{ pageSize: 5 }}
                    locale={{ emptyText: 'No comments yet' }}
                  />
                </Card>
              </Col>
            </Row>
          </Card>
        )}
      </Modal>
    </div>
  );
}
