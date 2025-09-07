"use client";

import React, { useState } from "react";
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
  Modal,
  Form,
  message,
  Empty,
  Spin
} from "antd";
import {
  BookOutlined,
  UserOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  SearchOutlined,
  FilterOutlined,
  PlusOutlined,
  TrophyOutlined
} from "@ant-design/icons";
import { useSession } from "next-auth/react";
import { AppNav } from "@components/nav/nav.component";
import { AppFooter } from "@components/footer/footer";
import { AppFootnote } from "@components/footnote/footnote";
import { courseAPI } from "@store/api/course_api";
import { motion } from "framer-motion";
import { ICourse } from "@domain/models/course";

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;

export default function CoursesPageComponent() {
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLevel, setFilterLevel] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [enrollmentModalVisible, setEnrollmentModalVisible] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<ICourse | null>(null);
  const [enrollmentForm] = Form.useForm();

  const {
    data: courses,
    error,
    isLoading,
    isFetching,
  } = courseAPI.useFetchAllCoursesQuery({
    searchTitle: searchTerm,
    sortBy: "date",
  });

  const filteredCourses = courses?.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    // Note: ICourse doesn't have level or category properties, so we'll skip those filters for now
    return matchesSearch;
  }) || [];

  const handleEnrollCourse = (course: ICourse) => {
    setSelectedCourse(course);
    setEnrollmentModalVisible(true);
  };

  const handleEnrollmentSubmit = async (values: any) => {
    try {
      if (!selectedCourse || !session?.user?.id) {
        message.error("Please log in to enroll in courses");
        return;
      }

      const enrollmentData = {
        courseId: selectedCourse.id,
        userId: session.user.id,
        notes: values.notes,
      };

      const response = await fetch('/api/course-enrollments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(enrollmentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Enrollment failed');
      }

      message.success("Successfully enrolled in the course!");
      setEnrollmentModalVisible(false);
      enrollmentForm.resetFields();
      
      // Note: RTK Query will automatically refetch data when needed
    } catch (error) {
      console.error('Enrollment error:', error);
      message.error(error instanceof Error ? error.message : "Enrollment failed. Please try again.");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading || isFetching) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '50px',
        backgroundColor: 'white',
        minHeight: '100vh'
      }}>
        <Spin size="large" />
        <Text>Loading courses...</Text>
      </div>
    );
  }

  return (
    <>
      <div className="container-fluid mt-3" style={{ width: "100%", backgroundColor: 'white', minHeight: '100vh' }}>
        <AppNav logoPath="/" />
        
        <div className="container pb-5" style={{ marginTop: 24, backgroundColor: 'white' }}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Card style={{
                backgroundColor: "white",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                borderRadius: "12px",
                overflow: "hidden",
                marginBottom: 24,
              }}>
            <Row justify="space-between" align="middle">
              <Col>
                <Title level={2} style={{ margin: 0 }}>
                  Online Courses 📚
                </Title>
                <Text type="secondary">
                  Learn new skills with our comprehensive course library
                </Text>
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
            <Card style={{
                backgroundColor: "white",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                borderRadius: "12px",
                overflow: "hidden",
                marginBottom: 24,
              }}>
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} sm={12} md={6}>
                <Search
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  prefix={<SearchOutlined />}
                />
              </Col>
              <Col xs={24} sm={12} md={4}>
                <Select
                  placeholder="Level"
                  value={filterLevel}
                  onChange={setFilterLevel}
                  style={{ width: '100%' }}
                >
                  <Option value="all">All Levels</Option>
                  <Option value="Beginner">Beginner</Option>
                  <Option value="Intermediate">Intermediate</Option>
                  <Option value="Advanced">Advanced</Option>
                </Select>
              </Col>
              <Col xs={24} sm={12} md={4}>
                <Select
                  placeholder="Category"
                  value={filterCategory}
                  onChange={setFilterCategory}
                  style={{ width: '100%' }}
                >
                  <Option value="all">All Categories</Option>
                  <Option value="Web Development">Web Development</Option>
                  <Option value="Programming">Programming</Option>
                  <Option value="Data Science">Data Science</Option>
                  <Option value="Mobile Development">Mobile Development</Option>
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
                  Clear Filters
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
                      ease: "easeOut"
                    }}
                    whileHover={{ 
                      y: -5,
                      transition: { duration: 0.2 }
                    }}
                    style={{ height: '100%' }}
                  >
                    <Card
                    hoverable
                    style={{ 
                      backgroundColor: 'white',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      borderRadius: '12px',
                      overflow: 'hidden'
                    }}
                    cover={
                      <div style={{ position: 'relative' }}>
                        <img
                          alt={course.title}
                          src={course.imageUrl || '/img/design-3.jpg'}
                          style={{ width: '100%', height: 200, objectFit: 'cover' }}
                        />
                        <div style={{
                          position: 'absolute',
                          top: 8,
                          left: 8,
                          background: 'rgba(0,0,0,0.7)',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: 4,
                          fontSize: 12
                        }}>
                          📚 Course
                        </div>
                        <div style={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          background: 'rgba(0,0,0,0.7)',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: 4,
                          fontSize: 12
                        }}>
                          Course
                        </div>
                      </div>
                    }
                    actions={[
                      <Button 
                        type="primary"
                        icon={<BookOutlined />}
                        onClick={() => handleEnrollCourse(course)}
                      >
                        Enroll
                      </Button>,
                      <Button 
                        icon={<EyeOutlined />}
                        onClick={() => {/* Navigate to course detail */}}
                      >
                        View Details
                      </Button>
                    ]}
                  >
                    <Card.Meta
                      title={
                        <Space>
                          <Text strong>{course.title}</Text>
                          <Tag color="blue">
                            Course
                          </Tag>
                        </Space>
                      }
                      description={
                        <Space direction="vertical" size="small">
                          <Paragraph ellipsis={{ rows: 2 }}>
                            {course.description}
                          </Paragraph>
                          <Space>
                            <UserOutlined style={{ color: '#52c41a' }} />
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
        </div>
      </div>

      {/* Enrollment Modal */}
      <Modal
        title={`Enroll in ${selectedCourse?.title}`}
        open={enrollmentModalVisible}
        onCancel={() => setEnrollmentModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={enrollmentForm}
          layout="vertical"
          onFinish={handleEnrollmentSubmit}
        >
          <Form.Item
            label="Additional Notes (Optional)"
            name="notes"
          >
            <Input.TextArea 
              rows={4} 
              placeholder="Any specific learning goals or questions..."
            />
          </Form.Item>
          
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setEnrollmentModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Enroll Now
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      <AppFooter logoPath={""} />
      <AppFootnote />
    </>
  );
}