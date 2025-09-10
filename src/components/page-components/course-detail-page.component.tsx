"use client";

import BannerComponent from "@components/banner/banner.component";
import { AppFooter } from "@components/footer/footer";
import { AppFootnote } from "@components/footnote/footnote";
import { AppNav } from "@components/nav/nav.component";
import SpinnerList from "@components/shared/spinner-list";
import { courseAPI } from "@store/api/course_api";
import { Row, Col, Layout, Empty, Spin, Card, Typography, Button, Tag, Space, Divider, List, Progress } from "antd";
import { motion } from "framer-motion";
import { ClockCircleOutlined, UserOutlined, DollarOutlined, BookOutlined, TrophyOutlined } from "@ant-design/icons";
import { useState } from "react";
import { message } from "antd";

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

interface CourseDetailPageComponentProps {
  courseSlug: string;
}

export default function CourseDetailPageComponent({ courseSlug }: CourseDetailPageComponentProps) {
  const [isEnrolling, setIsEnrolling] = useState(false);
  
  const {
    data: course,
    error,
    isLoading,
    isFetching,
  } = courseAPI.useGetSingleCourseBySlugQuery(courseSlug);

  const handleEnroll = async () => {
    if (!course) return;
    
    setIsEnrolling(true);
    try {
      const response = await fetch('/api/course-enrollments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId: course.id,
          // Add user info if available
        }),
      });

      if (response.ok) {
        message.success('Successfully enrolled in the course!');
      } else {
        const errorData = await response.json();
        message.error(errorData.message || 'Enrollment failed');
      }
    } catch (error) {
      message.error('Enrollment failed. Please try again.');
    } finally {
      setIsEnrolling(false);
    }
  };

  if (isLoading || isFetching) {
    return (
      <div
        style={{
          minHeight: "65vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin size="large" tip="Loading..." fullscreen spinning />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div
        style={{
          minHeight: "65vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Empty description="Course not found" />
      </div>
    );
  }

  return (
    <>
      <div className="container-fluid mt-3" style={{ width: "100%" }}>
        <AppNav logoPath="/" />
      </div>

      <BannerComponent
        breadcrumbs={[
          { label: "Courses", uri: "courses" },
          { label: course.title, uri: "#" },
        ]}
        pageTitle="Course Details"
      />

      <div className="container mb-5">
        <Content>
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={16}>
              <motion.div
                className="box"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card>
                  <div className="mb-4">
                    <Title level={1}>{course.title}</Title>
                    <Space wrap>
                      <Tag color="blue">Course</Tag>
                      <Tag color="purple">All Levels</Tag>
                      <Tag color="green">Online Course</Tag>
                    </Space>
                  </div>

                  {course.imageUrl && (
                    <div className="mb-4">
                      <img
                        src={`/uploads/courses/${course.imageUrl}`}
                        alt={course.title}
                        style={{
                          width: "100%",
                          height: "400px",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                    </div>
                  )}

                  <div className="mb-4">
                    <Title level={3}>About This Course</Title>
                    <Paragraph className="fs-5">{course.description}</Paragraph>
                  </div>

                </Card>
              </motion.div>
            </Col>

            <Col xs={24} lg={8}>
              <motion.div
                className="box"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card>
                  <Title level={3}>Course Information</Title>
                  
                  <Space direction="vertical" size="large" style={{ width: "100%" }}>
                    <div>
                      <Text strong>
                        <ClockCircleOutlined className="me-2" />
                        Duration
                      </Text>
                      <div className="mt-1">
                        <Text>Self-paced</Text>
                      </div>
                    </div>

                    <div>
                      <Text strong>
                        <UserOutlined className="me-2" />
                        Instructor
                      </Text>
                      <div className="mt-1">
                        <Text>CUMI Team</Text>
                      </div>
                    </div>

                    <div>
                      <Text strong>
                        <DollarOutlined className="me-2" />
                        Price
                      </Text>
                      <div className="mt-1">
                        <Text>
                          Free
                        </Text>
                      </div>
                    </div>

                    <div>
                      <Text strong>
                        <BookOutlined className="me-2" />
                        Lessons
                      </Text>
                      <div className="mt-1">
                        <Text>
                          0 lessons
                        </Text>
                      </div>
                    </div>
                  </Space>

                  <Divider />

                  <Button
                    type="primary"
                    size="large"
                    block
                    loading={isEnrolling}
                    onClick={handleEnroll}
                  >
                    Enroll in Course
                  </Button>

                  <div className="mt-3 text-center">
                    <Text type="secondary">
                      Start learning today!
                    </Text>
                  </div>
                </Card>

              </motion.div>
            </Col>
          </Row>
        </Content>
      </div>

      <AppFooter logoPath="/" />
      <AppFootnote />
    </>
  );
}
