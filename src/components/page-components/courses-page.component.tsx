"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Space,
  Button,
  Tag,
  Input,
  Select,
  App,
} from "antd";
import {
  CalendarOutlined,
  EnvironmentOutlined,
  EyeOutlined,
  SearchOutlined,
  FilterOutlined,
  BookOutlined,
} from "@ant-design/icons";
import { useSession } from "next-auth/react";
import { courseAPI } from "@store/api/course_api";
import { motion } from "framer-motion";
import { ICourse } from "@domain/models/course";
import { useTranslation } from "@contexts/translation.context";
import { useRouter } from "next/navigation";
import { 
  PageLayout, 
  LoadingSpinner, 
  SearchAndFilterBar, 
  EmptyState,
  CourseEnrollmentModal 
} from "@components/shared";

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;

export default function CoursesPageComponent() {
  const { data: session } = useSession();
  const { t } = useTranslation();
  const router = useRouter();
  const { message } = App.useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [filterLevel, setFilterLevel] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [enrollmentModalVisible, setEnrollmentModalVisible] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<ICourse | null>(null);

  const {
    data: courses,
    error,
    isLoading,
    isFetching,
  } = courseAPI.useFetchAllCoursesQuery({
    searchTitle: debouncedSearchTerm,
    sortBy: "date",
  });

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filteredCourses =
    courses?.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      // Note: ICourse doesn't have level/category properties, so we'll skip filtering for now
      return matchesSearch;
    }) || [];

  const handleEnrollCourse = (course: ICourse) => {
    // Check if user is logged in
    if (!session?.user?.id) {
      message.error('Please log in to enroll in courses');
      return;
    }

    setSelectedCourse(course);
    setEnrollmentModalVisible(true);
  };

  const formatDate = (dateString: string | Date) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  if (isLoading || isFetching) {
    return <LoadingSpinner tip="Loading courses..." />;
  }

  return (
    <PageLayout
      showBanner={true}
      bannerTitle={t("nav.courses")}
      bannerBreadcrumbs={[{ label: t("nav.courses"), uri: "courses" }]}
    >
      <div
        className="container pb-5"
        style={{ marginTop: 24, backgroundColor: "white" }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Card
            style={{
              backgroundColor: "white",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              borderRadius: "12px",
              overflow: "hidden",
              marginBottom: 24,
            }}
          >
            <Row justify="space-between" align="middle">
              <Col>
                <Title level={2} style={{ margin: 0 }}>
                  {t("courses.title")}
                </Title>
                <Text type="secondary">{t("courses.subtitle")}</Text>
              </Col>
            </Row>
          </Card>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          <Card
            style={{
              backgroundColor: "white",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              borderRadius: "12px",
              overflow: "hidden",
              marginBottom: 24,
            }}
          >
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} sm={12} md={6}>
                <Search
                  placeholder={t("courses.search_placeholder")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  prefix={<SearchOutlined />}
                />
              </Col>
              <Col xs={24} sm={12} md={4}>
                <Select
                  placeholder={t("courses.level_placeholder")}
                  value={filterLevel}
                  onChange={setFilterLevel}
                  style={{ width: "100%" }}
                >
                  <Option value="all">{t("courses.all_levels")}</Option>
                  <Option value="Beginner">{t("courses.beginner")}</Option>
                  <Option value="Intermediate">
                    {t("courses.intermediate")}
                  </Option>
                  <Option value="Advanced">{t("courses.advanced")}</Option>
                </Select>
              </Col>
              <Col xs={24} sm={12} md={4}>
                <Select
                  placeholder={t("courses.category_placeholder")}
                  value={filterCategory}
                  onChange={setFilterCategory}
                  style={{ width: "100%" }}
                >
                  <Option value="all">{t("courses.all_categories")}</Option>
                  <Option value="Web Development">
                    {t("courses.web_dev")}
                  </Option>
                  <Option value="Programming">
                    {t("courses.programming")}
                  </Option>
                  <Option value="Data Science">
                    {t("courses.data_science")}
                  </Option>
                  <Option value="Mobile Development">
                    {t("courses.mobile_dev")}
                  </Option>
                </Select>
              </Col>
              <Col xs={24} sm={12} md={4}>
                <Button
                  icon={<FilterOutlined />}
                  onClick={() => {
                    setSearchTerm("");
                    setFilterLevel("all");
                    setFilterCategory("all");
                  }}
                >
                  {t("courses.clear_filters")}
                </Button>
              </Col>
            </Row>
          </Card>
        </motion.div>

        {/* Courses Grid */}
        {filteredCourses.length === 0 ? (
          <Card>
            <Empty
              description="No courses found matching your criteria"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </Card>
        ) : (
          <Row gutter={[16, 16]}>
            {filteredCourses.map((course, index) => (
              <Col xs={24} md={12} lg={8} key={course.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                    ease: "easeOut",
                  }}
                  whileHover={{
                    y: -5,
                    transition: { duration: 0.2 },
                  }}
                  style={{ height: "100%" }}
                >
                  <Card
                    hoverable
                    style={{
                      backgroundColor: "white",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      borderRadius: "12px",
                      overflow: "hidden",
                    }}
                    cover={
                      <div style={{ position: "relative" }}>
                        <img
                          alt={course.title}
                          src={course.imageUrl || "/img/design-3.jpg"}
                          style={{
                            width: "100%",
                            height: 200,
                            objectFit: "cover",
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            top: 8,
                            left: 8,
                            background: "rgba(0,0,0,0.7)",
                            color: "white",
                            padding: "4px 8px",
                            borderRadius: 4,
                            fontSize: 12,
                          }}
                        >
                          📚 Course
                        </div>
                        <div
                          style={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            background: "rgba(0,0,0,0.7)",
                            color: "white",
                            padding: "4px 8px",
                            borderRadius: 4,
                            fontSize: 12,
                          }}
                        >
                          Course
                        </div>
                      </div>
                    }
                    actions={[
                      <Button
                        key="enroll"
                        type="primary"
                        icon={<BookOutlined />}
                        onClick={() => handleEnrollCourse(course)}
                      >
                        Enroll
                      </Button>,
                      <Button
                        key="view"
                        icon={<EyeOutlined />}
                        onClick={() => {
                          router.push(`/courses/${course.slug}`);
                        }}
                      >
                        View Details
                      </Button>,
                    ]}
                  >
                    <Card.Meta
                      title={
                        <Space>
                          <Text strong>{course.title}</Text>
                          <Tag color="green">Course</Tag>
                        </Space>
                      }
                      description={
                        <Space direction="vertical" size="small">
                          <Paragraph ellipsis={{ rows: 2 }}>
                            {course.description}
                          </Paragraph>
                          <Space>
                            <CalendarOutlined style={{ color: "#1890ff" }} />
                            <Text type="secondary">
                              {formatDate(course.createdAt)}
                            </Text>
                          </Space>
                          <Space>
                            <EnvironmentOutlined style={{ color: "#faad14" }} />
                            <Text type="secondary">{course.authorName}</Text>
                          </Space>
                        </Space>
                      }
                    />
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        )}

        {/* Course Enrollment Modal */}
        <CourseEnrollmentModal
          visible={enrollmentModalVisible}
          onCancel={() => setEnrollmentModalVisible(false)}
          course={selectedCourse}
          onSuccess={() => {
            // Optionally refresh data or show success message
          }}
        />
      </div>
    </PageLayout>
  );
}
