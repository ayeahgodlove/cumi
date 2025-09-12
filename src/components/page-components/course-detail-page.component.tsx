"use client";

import BannerComponent from "@components/banner/banner.component";
import { AppFooter } from "@components/footer/footer";
import { AppFootnote } from "@components/footnote/footnote";
import { AppNav } from "@components/nav/nav.component";
import SpinnerList from "@components/shared/spinner-list";
import { courseAPI } from "@store/api/course_api";
import { Row, Col, Layout, Empty, Spin, Card, Typography, Button, Tag, Space, Divider, List, Progress, Table, App } from "antd";
import { motion } from "framer-motion";
import { 
  ClockCircleOutlined, 
  UserOutlined, 
  DollarOutlined, 
  BookOutlined, 
  TrophyOutlined,
  TeamOutlined,
  GlobalOutlined,
  PhoneOutlined,
  CheckCircleOutlined,
  StarOutlined,
  CalendarOutlined,
  InfoCircleOutlined
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import { message } from "antd";
import { useSession } from "next-auth/react";
import { BASE_URL_UPLOADS_MEDIA } from "@constants/api-url";
import CourseEnrollmentModal from "@components/shared/course-enrollment-modal.component";

interface ILesson {
  id: string;
  title: string;
  slug: string;
  description: string;
  durationMinutes?: number;
  lessonOrder: number;
  status: 'draft' | 'published' | 'archived';
  difficulty: string;
  createdAt: Date;
  updatedAt: Date;
}

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

interface CourseDetailPageComponentProps {
  courseSlug: string;
}

export default function CourseDetailPageComponent({ courseSlug }: CourseDetailPageComponentProps) {
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollmentLoading, setEnrollmentLoading] = useState(false);
  const [lessons, setLessons] = useState<ILesson[]>([]);
  const [lessonsLoading, setLessonsLoading] = useState(false);
  const [enrollmentModalVisible, setEnrollmentModalVisible] = useState(false);
  const { data: session } = useSession();
  const { message } = App.useApp();
  
  const {
    data: course,
    error,
    isLoading,
    isFetching,
  } = courseAPI.useGetSingleCourseBySlugQuery(courseSlug);

  // Check enrollment status when course loads
  useEffect(() => {
    const checkEnrollmentStatus = async () => {
      if (!course || !session?.user?.id) return;

      setEnrollmentLoading(true);
      try {
        const response = await fetch(`/api/course-enrollments?courseId=${course.id}`);
        if (response.ok) {
          const data = await response.json();
          setIsEnrolled(data.enrolled || false);
        }
      } catch (error) {
        console.error('Error checking enrollment status:', error);
      } finally {
        setEnrollmentLoading(false);
      }
    };

    checkEnrollmentStatus();
  }, [course, session?.user?.id]);

  // Fetch lessons when course loads
  useEffect(() => {
    const fetchLessons = async () => {
      if (!course?.id) return;

      setLessonsLoading(true);
      try {
        const response = await fetch(`/api/courses/${course.id}/lessons`);
        if (response.ok) {
          const data = await response.json();
          setLessons(data.data || []);
        }
      } catch (error) {
        console.error('Error fetching lessons:', error);
      } finally {
        setLessonsLoading(false);
      }
    };

    fetchLessons();
  }, [course?.id]);

  const handleEnroll = () => {
    if (!course) return;

    // Check if user is logged in
    if (!session?.user?.id) {
      message.error('Please log in to enroll in courses');
      return;
    }

    setEnrollmentModalVisible(true);
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
      <>
        <div className="container-fluid" style={{ width: "100%" }}>
          <AppNav logoPath="/" />
        </div>
        
        <div
          style={{
            minHeight: "65vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            padding: "2rem",
          }}
        >
          <Empty 
            description={
              <div style={{ textAlign: "center" }}>
                <Title level={3}>Course Not Found</Title>
                <Paragraph>
                  The course "{courseSlug}" could not be found.
                </Paragraph>
                <Button 
                  type="primary" 
                  onClick={() => window.history.back()}
                  style={{ marginTop: "1rem" }}
                >
                  Go Back
                </Button>
              </div>
            }
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </div>
        
        <AppFooter logoPath="/" />
        <AppFootnote />
      </>
    );
  }

  return (
    <>
      <div className="container-fluid" style={{ width: "100%" }}>
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
                      <Tag color={course.level === 'beginner' ? 'green' : course.level === 'intermediate' ? 'orange' : 'red'}>
                        {course.level?.charAt(0).toUpperCase() + course.level?.slice(1)} Level
                      </Tag>
                      <Tag color={course.isFree ? 'green' : 'blue'}>
                        {course.isFree ? 'Free' : `${course.price} ${course.currency}`}
                      </Tag>
                      <Tag color="purple">{course.language?.charAt(0).toUpperCase() + course.language?.slice(1)}</Tag>
                      {course.certificateAvailable && <Tag color="gold">Certificate Available</Tag>}
                    </Space>
                  </div>

                  {course.imageUrl && (
                    <div className="mb-4">
                      <img
                        src={`${BASE_URL_UPLOADS_MEDIA}/${course.imageUrl}`}
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

                  {/* Course Details Grid */}
                  <Row gutter={[16, 16]} className="mb-4">
                    <Col xs={24} md={12}>
                      <Card size="small" style={{ background: '#f8f9fa' }}>
                        <Space direction="vertical" size="small" style={{ width: '100%' }}>
                          <Text strong><ClockCircleOutlined /> Duration</Text>
                          <Text>{course.durationWeeks ? `${course.durationWeeks} weeks` : 'Self-paced'}</Text>
                        </Space>
                      </Card>
                    </Col>
                    <Col xs={24} md={12}>
                      <Card size="small" style={{ background: '#f8f9fa' }}>
                        <Space direction="vertical" size="small" style={{ width: '100%' }}>
                          <Text strong><TeamOutlined /> Students</Text>
                          <Text>{course.currentStudents || 0} enrolled</Text>
                          {course.maxStudents && <Text type="secondary">Max: {course.maxStudents}</Text>}
                        </Space>
                      </Card>
                    </Col>
                  </Row>

                  {/* Prerequisites */}
                  {course.prerequisites && (
                    <div className="mb-4">
                      <Title level={4}><InfoCircleOutlined /> Prerequisites</Title>
                      <Card size="small" style={{ background: '#fff7e6' }}>
                        <Paragraph>{course.prerequisites}</Paragraph>
                      </Card>
                    </div>
                  )}

                  {/* Learning Outcomes */}
                  {course.learningOutcomes && (
                    <div className="mb-4">
                      <Title level={4}><CheckCircleOutlined /> What You'll Learn</Title>
                      <Card size="small" style={{ background: '#f6ffed' }}>
                        <Paragraph>{course.learningOutcomes}</Paragraph>
                      </Card>
                    </div>
                  )}

                  {/* Target Audience */}
                  {course.targetAudience && (
                    <div className="mb-4">
                      <Title level={4}><UserOutlined /> Target Audience</Title>
                      <Card size="small" style={{ background: '#e6f7ff' }}>
                        <Tag color="blue">{course.targetAudience}</Tag>
                      </Card>
                    </div>
                  )}

                </Card>

                {/* Lessons Table */}
                <motion.div
                  className="box mt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <Card>
                    <Title level={3}><BookOutlined /> Course Lessons</Title>
                    
                    {lessonsLoading ? (
                      <div className="text-center py-4">
                        <Spin size="large" />
                        <div className="mt-2">Loading lessons...</div>
                      </div>
                    ) : lessons.length > 0 ? (
                      <Table
                        dataSource={lessons}
                        rowKey="id"
                        pagination={false}
                        size="middle"
                        className="lessons-table"
                        columns={[
                          {
                            title: '#',
                            dataIndex: 'lessonOrder',
                            key: 'lessonOrder',
                            width: 60,
                            render: (order: number) => (
                              <div className="text-center">
                                <Tag color="blue" style={{ borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  {order}
                                </Tag>
                              </div>
                            ),
                          },
                          {
                            title: 'Lesson Title',
                            dataIndex: 'title',
                            key: 'title',
                            render: (title: string, record: ILesson) => (
                              <div>
                                <Text strong style={{ fontSize: '16px' }}>{title}</Text>
                                {record.description && (
                                  <div className="mt-1">
                                    <Text type="secondary" style={{ fontSize: '14px' }}>
                                      {record.description.length > 100 
                                        ? `${record.description.substring(0, 100)}...` 
                                        : record.description
                                      }
                                    </Text>
                                  </div>
                                )}
                              </div>
                            ),
                          },
                          {
                            title: 'Duration',
                            dataIndex: 'durationMinutes',
                            key: 'duration',
                            width: 120,
                            render: (duration: number) => (
                              <div className="text-center">
                                <ClockCircleOutlined className="me-1" />
                                <Text>{duration ? `${duration} min` : 'N/A'}</Text>
                              </div>
                            ),
                          },
                          {
                            title: 'Difficulty',
                            dataIndex: 'difficulty',
                            key: 'difficulty',
                            width: 120,
                            render: (difficulty: string) => (
                              <Tag 
                                color={
                                  difficulty?.toLowerCase() === 'beginner' ? 'green' :
                                  difficulty?.toLowerCase() === 'intermediate' ? 'orange' :
                                  difficulty?.toLowerCase() === 'advanced' ? 'red' : 'default'
                                }
                              >
                                {difficulty || 'N/A'}
                              </Tag>
                            ),
                          },
                          {
                            title: 'Status',
                            dataIndex: 'status',
                            key: 'status',
                            width: 100,
                            render: (status: string) => (
                              <Tag 
                                color={
                                  status === 'published' ? 'green' :
                                  status === 'draft' ? 'orange' :
                                  status === 'archived' ? 'red' : 'default'
                                }
                              >
                                {status?.charAt(0).toUpperCase() + status?.slice(1)}
                              </Tag>
                            ),
                          },
                        ]}
                        style={{
                          background: '#fff',
                          borderRadius: '8px',
                        }}
                      />
                    ) : (
                      <Empty
                        description="No lessons available yet"
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        style={{ padding: '2rem' }}
                      />
                    )}
                  </Card>
                </motion.div>
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
                    {/* Pricing */}
                    <div>
                      <Text strong>
                        <DollarOutlined className="me-2" />
                        Price
                      </Text>
                      <div className="mt-1">
                        <Text style={{ fontSize: '18px', fontWeight: 'bold' }}>
                          {course.isFree ? (
                            <span style={{ color: '#52c41a' }}>Free</span>
                          ) : (
                            <span style={{ color: '#1890ff' }}>
                              {course.price} {course.currency}
                            </span>
                          )}
                        </Text>
                      </div>
                    </div>

                    {/* Duration */}
                    <div>
                      <Text strong>
                        <ClockCircleOutlined className="me-2" />
                        Duration
                      </Text>
                      <div className="mt-1">
                        <Text>{course.durationWeeks ? `${course.durationWeeks} weeks` : 'Self-paced'}</Text>
                      </div>
                    </div>

                    {/* Level */}
                    <div>
                      <Text strong>
                        <StarOutlined className="me-2" />
                        Level
                      </Text>
                      <div className="mt-1">
                        <Tag color={course.level === 'beginner' ? 'green' : course.level === 'intermediate' ? 'orange' : 'red'}>
                          {course.level?.charAt(0).toUpperCase() + course.level?.slice(1)}
                        </Tag>
                      </div>
                    </div>

                    {/* Language */}
                    <div>
                      <Text strong>
                        <GlobalOutlined className="me-2" />
                        Language
                      </Text>
                      <div className="mt-1">
                        <Text>{course.language?.charAt(0).toUpperCase() + course.language?.slice(1)}</Text>
                      </div>
                    </div>

                    {/* Instructor */}
                    <div>
                      <Text strong>
                        <UserOutlined className="me-2" />
                        Instructor
                      </Text>
                      <div className="mt-1">
                        <Text>{course.authorName}</Text>
                        {course.instructorContact && (
                          <div className="mt-1">
                            <Text type="secondary">
                              <PhoneOutlined /> {course.instructorContact}
                            </Text>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Students */}
                    <div>
                      <Text strong>
                        <TeamOutlined className="me-2" />
                        Students
                      </Text>
                      <div className="mt-1">
                        <Text>{course.currentStudents || 0} enrolled</Text>
                        {course.maxStudents && (
                          <div>
                            <Text type="secondary">Max: {course.maxStudents}</Text>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Certificate */}
                    {course.certificateAvailable && (
                      <div>
                        <Text strong>
                          <TrophyOutlined className="me-2" />
                          Certificate
                        </Text>
                        <div className="mt-1">
                          <Tag color="gold">Available upon completion</Tag>
                        </div>
                      </div>
                    )}

                    {/* Created Date */}
                    <div>
                      <Text strong>
                        <CalendarOutlined className="me-2" />
                        Created
                      </Text>
                      <div className="mt-1">
                        <Text>{new Date(course.createdAt).toLocaleDateString()}</Text>
                      </div>
                    </div>
                  </Space>

                  <Divider />

                  {!session?.user?.id ? (
                    <Button
                      type="primary"
                      size="large"
                      block
                      onClick={() => message.error('Please log in to enroll in courses')}
                    >
                      Log In to Enroll
                    </Button>
                  ) : isEnrolled ? (
                    <div className="text-center">
                      <Button
                        type="default"
                        size="large"
                        block
                        disabled
                        icon={<TrophyOutlined />}
                      >
                        Already Enrolled
                      </Button>
                      <div className="mt-3">
                        <Text type="success" strong>
                          ✓ You are enrolled in this course
                        </Text>
                      </div>
                    </div>
                  ) : (
                    <Button
                      type="primary"
                      size="large"
                      block
                      loading={isEnrolling || enrollmentLoading}
                      onClick={handleEnroll}
                      icon={<BookOutlined />}
                    >
                      {isEnrolling ? 'Enrolling...' : 'Enroll in Course'}
                    </Button>
                  )}

                  {!isEnrolled && session?.user?.id && (
                    <div className="mt-3 text-center">
                      <Text type="secondary">
                        Start learning today!
                      </Text>
                    </div>
                  )}
                </Card>

              </motion.div>
            </Col>
          </Row>
        </Content>
      </div>

      {/* Course Enrollment Modal */}
      <CourseEnrollmentModal
        visible={enrollmentModalVisible}
        onCancel={() => setEnrollmentModalVisible(false)}
        course={course}
        onSuccess={() => {
          // Optionally refresh data or show success message
        }}
      />

      <AppFooter logoPath="/" />
      <AppFootnote />
    </>
  );
}
