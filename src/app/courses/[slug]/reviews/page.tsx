"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Layout,
  Card,
  Typography,
  Button,
  Row,
  Col,
  Rate,
  Progress,
  Space,
  List,
  Avatar,
  Tag,
  Empty,
  Spin,
  Alert,
  Modal,
  Form,
  Input,
  Select,
  Checkbox,
  Statistic,
  Divider,
} from "antd";
import {
  StarOutlined,
  UserOutlined,
  TeamOutlined,
  LeftOutlined,
  CheckCircleOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import { reviewAPI, ICourseReviewsResponse, IReviewResponse, IReviewRequest } from "@/store/api/review_api";
import { courseAPI } from "@/store/api/course_api";

const { Title, Text } = Typography;
const { Content } = Layout;

export default function CourseReviewsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [reviewVisible, setReviewVisible] = useState(false);
  const [reviewForm] = Form.useForm();

  const courseSlug = params.slug as string;

  // Get course data by slug
  const { data: course } = courseAPI.useGetSingleCourseBySlugQuery(courseSlug);
  const courseId = course?.id;

  // Get course reviews
  const { data: courseReviews, isLoading: reviewsLoading, refetch: refetchReviews } = reviewAPI.useGetCourseReviewsQuery({
    courseId: courseId || "",
    userId: session?.user?.id,
    includeStats: true,
  }, {
    skip: !courseId,
  });

  const [createReview] = reviewAPI.useCreateReviewMutation();
  const [updateReview] = reviewAPI.useUpdateReviewMutation();
  const [deleteReview] = reviewAPI.useDeleteReviewMutation();
  const [markHelpful] = reviewAPI.useMarkReviewHelpfulMutation();

  const handleSubmitReview = async (values: any) => {
    if (!session?.user?.id || !courseId) return;

    try {
      const reviewData: IReviewRequest = {
        courseId,
        rating: values.rating,
        title: values.title,
        comment: values.comment,
        pros: values.pros,
        cons: values.cons,
        wouldRecommend: values.wouldRecommend ?? true,
        difficulty: values.difficulty,
        instructorRating: values.instructorRating,
        contentQuality: values.contentQuality,
        valueForMoney: values.valueForMoney,
        completionPercentage: 100, // Assume completed if writing review
        isAnonymous: values.isAnonymous ?? false,
        language: values.language || 'english',
      };

      if (courseReviews?.userReview) {
        await updateReview({ ...reviewData, id: courseReviews.userReview.id }).unwrap();
      } else {
        await createReview(reviewData).unwrap();
      }

      setReviewVisible(false);
      reviewForm.resetFields();
      refetchReviews();
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const handleMarkHelpful = async (reviewId: string) => {
    try {
      await markHelpful(reviewId).unwrap();
      refetchReviews();
    } catch (error) {
      console.error("Error marking review helpful:", error);
    }
  };

  if (!course) {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Content style={{ padding: "24px" }}>
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <Spin size="large" />
            <div style={{ marginTop: "16px" }}>Loading course...</div>
          </div>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <Content style={{ padding: "24px" }}>
        {/* Header */}
        <div style={{ marginBottom: "24px" }}>
          <Button 
            icon={<LeftOutlined />}
            onClick={() => router.back()}
            style={{ marginBottom: "16px" }}
          >
            Back to Course
          </Button>
          
          <Card style={{ borderRadius: "12px" }}>
            <Row gutter={24} align="middle">
              <Col xs={24} md={6}>
                <img
                  src={course.imageUrl || "/api/placeholder/200/150"}
                  alt={course.title}
                  style={{ 
                    width: "100%", 
                    borderRadius: "8px",
                    aspectRatio: "4/3",
                    objectFit: "cover"
                  }}
                />
              </Col>
              <Col xs={24} md={18}>
                <Title level={2} style={{ margin: 0, marginBottom: "8px" }}>
                  {course.title}
                </Title>
                <Text type="secondary" style={{ fontSize: "16px", display: "block", marginBottom: "16px" }}>
                  {course.description}
                </Text>
                
                {courseReviews?.stats && (
                  <div style={{ marginBottom: "16px" }}>
                    <Rate 
                      disabled 
                      value={courseReviews.stats.averageRating} 
                      allowHalf 
                      style={{ fontSize: "20px" }} 
                    />
                    <Text strong style={{ marginLeft: "12px", fontSize: "18px" }}>
                      {courseReviews.stats.averageRating.toFixed(1)}
                    </Text>
                    <Text style={{ marginLeft: "8px", color: "#666" }}>
                      ({courseReviews.stats.totalReviews} reviews)
                    </Text>
                  </div>
                )}

                <Space>
                  <Button 
                    type="primary"
                    icon={<StarOutlined />}
                    onClick={() => setReviewVisible(true)}
                    style={{
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      border: "none"
                    }}
                  >
                    {courseReviews?.userReview ? "Update Review" : "Write Review"}
                  </Button>
                </Space>
              </Col>
            </Row>
          </Card>
        </div>

        {/* Reviews Statistics */}
        {courseReviews?.stats && (
          <Card style={{ marginBottom: "24px", borderRadius: "12px" }}>
            <Title level={4}>Review Statistics</Title>
            <Row gutter={16}>
              <Col xs={12} sm={6}>
                <Statistic 
                  title="Total Reviews" 
                  value={courseReviews.stats.totalReviews}
                  prefix={<TeamOutlined />}
                />
              </Col>
              <Col xs={12} sm={6}>
                <Statistic 
                  title="Average Rating" 
                  value={courseReviews.stats.averageRating.toFixed(1)}
                  prefix={<StarOutlined />}
                  suffix="/ 5"
                />
              </Col>
              <Col xs={24} sm={12}>
                <div style={{ marginTop: "16px" }}>
                  <Text strong>Rating Distribution</Text>
                  {[5, 4, 3, 2, 1].map(rating => {
                    const count = courseReviews.stats?.ratingDistribution?.[rating] || 0;
                    const percentage = (courseReviews.stats?.totalReviews || 0) > 0 
                      ? (count / (courseReviews.stats?.totalReviews || 1)) * 100 
                      : 0;
                    
                    return (
                      <div key={rating} style={{ display: "flex", alignItems: "center", marginTop: "8px" }}>
                        <Text style={{ width: "20px" }}>{rating}</Text>
                        <StarOutlined style={{ color: "#faad14", marginRight: "8px" }} />
                        <Progress 
                          percent={percentage} 
                          showInfo={false} 
                          style={{ flex: 1, marginRight: "8px" }}
                          strokeColor="#faad14"
                        />
                        <Text style={{ width: "40px", textAlign: "right" }}>{count}</Text>
                      </div>
                    );
                  })}
                </div>
              </Col>
            </Row>
          </Card>
        )}

        {/* Reviews List */}
        <Card style={{ borderRadius: "12px" }}>
          <div style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Title level={4} style={{ margin: 0 }}>All Reviews</Title>
            <Button 
              type="primary"
              icon={<StarOutlined />}
              onClick={() => setReviewVisible(true)}
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                border: "none"
              }}
            >
              {courseReviews?.userReview ? "Update Review" : "Write Review"}
            </Button>
          </div>

          {reviewsLoading ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <Spin size="large" />
              <div style={{ marginTop: "16px" }}>Loading reviews...</div>
            </div>
          ) : courseReviews?.reviews && courseReviews.reviews.length > 0 ? (
            <List
              dataSource={courseReviews.reviews}
              renderItem={(review: IReviewResponse) => (
                <List.Item
                  style={{ 
                    padding: "24px", 
                    border: "1px solid #f0f0f0", 
                    borderRadius: "12px", 
                    marginBottom: "16px",
                    backgroundColor: review.id === courseReviews?.userReview?.id ? "#f0f8ff" : "white"
                  }}
                  actions={[
                    <Button
                      type="text"
                      icon={<HeartOutlined />}
                      onClick={() => handleMarkHelpful(review.id)}
                      style={{ color: "#667eea" }}
                    >
                      Helpful ({review.helpfulVotes})
                    </Button>
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        src={review.user?.avatar} 
                        icon={<UserOutlined />}
                        size={48}
                        style={{ backgroundColor: "#667eea" }}
                      />
                    }
                    title={
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                          <Text strong style={{ fontSize: "16px" }}>
                            {review.isAnonymous ? "Anonymous Student" : review.user?.name || "Student"}
                          </Text>
                          {review.id === courseReviews?.userReview?.id && (
                            <Tag color="blue">Your Review</Tag>
                          )}
                          {review.wouldRecommend && (
                            <Tag color="green">Recommends</Tag>
                          )}
                        </div>
                        <div style={{ marginBottom: "8px" }}>
                          <Rate disabled value={review.rating} style={{ fontSize: "16px" }} />
                          <Text strong style={{ marginLeft: "12px", fontSize: "18px" }}>
                            {review.title}
                          </Text>
                        </div>
                      </div>
                    }
                    description={
                      <div>
                        <Text style={{ display: "block", marginBottom: "12px", fontSize: "15px", lineHeight: 1.6 }}>
                          {review.comment}
                        </Text>
                        
                        {(review.pros || review.cons) && (
                          <Row gutter={16} style={{ marginBottom: "12px" }}>
                            {review.pros && (
                              <Col xs={24} md={12}>
                                <div style={{ 
                                  padding: "12px", 
                                  background: "#f6ffed", 
                                  borderRadius: "8px",
                                  border: "1px solid #b7eb8f"
                                }}>
                                  <Text strong style={{ color: "#52c41a", fontSize: "13px" }}>👍 Pros: </Text>
                                  <Text style={{ fontSize: "13px" }}>{review.pros}</Text>
                                </div>
                              </Col>
                            )}
                            {review.cons && (
                              <Col xs={24} md={12}>
                                <div style={{ 
                                  padding: "12px", 
                                  background: "#fff2e8", 
                                  borderRadius: "8px",
                                  border: "1px solid #ffbb96"
                                }}>
                                  <Text strong style={{ color: "#fa8c16", fontSize: "13px" }}>👎 Cons: </Text>
                                  <Text style={{ fontSize: "13px" }}>{review.cons}</Text>
                                </div>
                              </Col>
                            )}
                          </Row>
                        )}

                        <Row gutter={16} style={{ marginBottom: "12px" }}>
                          {review.instructorRating && (
                            <Col xs={8}>
                              <Text style={{ fontSize: "12px", color: "#666" }}>Instructor: </Text>
                              <Rate disabled value={review.instructorRating} style={{ fontSize: "12px" }} />
                            </Col>
                          )}
                          {review.contentQuality && (
                            <Col xs={8}>
                              <Text style={{ fontSize: "12px", color: "#666" }}>Content: </Text>
                              <Rate disabled value={review.contentQuality} style={{ fontSize: "12px" }} />
                            </Col>
                          )}
                          {review.valueForMoney && (
                            <Col xs={8}>
                              <Text style={{ fontSize: "12px", color: "#666" }}>Value: </Text>
                              <Rate disabled value={review.valueForMoney} style={{ fontSize: "12px" }} />
                            </Col>
                          )}
                        </Row>

                        <div style={{ fontSize: "11px", color: "#999" }}>
                          <Space>
                            <span>Difficulty: {review.difficulty?.replace('_', ' ') || 'Not specified'}</span>
                            <span>•</span>
                            <span>Progress: {review.completionPercentage}%</span>
                            <span>•</span>
                            <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                          </Space>
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          ) : (
            <Empty 
              description="No reviews yet. Be the first to share your experience!"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              style={{ padding: "60px 0" }}
            >
              <Button 
                type="primary"
                icon={<StarOutlined />}
                onClick={() => setReviewVisible(true)}
                style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  border: "none"
                }}
              >
                Write First Review
              </Button>
            </Empty>
          )}
        </Card>

        {/* Review Modal */}
        <Modal
          title={
            <div style={{ 
              textAlign: "center",
              padding: "16px 0",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              margin: "-24px -24px 24px -24px",
              color: "white",
              borderRadius: "8px 8px 0 0"
            }}>
              <StarOutlined style={{ marginRight: "8px", fontSize: "20px" }} />
              {courseReviews?.userReview ? "Update Your Review" : "Write a Review"}
            </div>
          }
          open={reviewVisible}
          onCancel={() => {
            setReviewVisible(false);
            reviewForm.resetFields();
          }}
          width={800}
          style={{ maxWidth: "95vw" }}
          footer={[
            <Button 
              key="cancel" 
              onClick={() => {
                setReviewVisible(false);
                reviewForm.resetFields();
              }}
              size="large"
            >
              Cancel
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={() => reviewForm.submit()}
              size="large"
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                border: "none"
              }}
            >
              {courseReviews?.userReview ? "Update Review" : "Submit Review"}
            </Button>
          ]}
        >
          <Form
            form={reviewForm}
            layout="vertical"
            onFinish={handleSubmitReview}
            initialValues={{
              rating: courseReviews?.userReview?.rating || 5,
              title: courseReviews?.userReview?.title || "",
              comment: courseReviews?.userReview?.comment || "",
              pros: courseReviews?.userReview?.pros || "",
              cons: courseReviews?.userReview?.cons || "",
              wouldRecommend: courseReviews?.userReview?.wouldRecommend ?? true,
              difficulty: courseReviews?.userReview?.difficulty || "medium",
              instructorRating: courseReviews?.userReview?.instructorRating || 5,
              contentQuality: courseReviews?.userReview?.contentQuality || 5,
              valueForMoney: courseReviews?.userReview?.valueForMoney || 5,
              isAnonymous: courseReviews?.userReview?.isAnonymous || false,
              language: courseReviews?.userReview?.language || "english",
            }}
            size="large"
          >
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Overall Rating"
                  name="rating"
                  rules={[{ required: true, message: "Please rate the course" }]}
                >
                  <Rate allowHalf style={{ fontSize: "24px" }} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Would you recommend this course?"
                  name="wouldRecommend"
                  valuePropName="checked"
                >
                  <Checkbox>Yes, I would recommend this course</Checkbox>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Review Title"
              name="title"
              rules={[
                { required: true, message: "Please enter a title" },
                { min: 3, message: "Title must be at least 3 characters" },
                { max: 255, message: "Title must be less than 255 characters" }
              ]}
            >
              <Input placeholder="Summarize your experience in a few words" />
            </Form.Item>

            <Form.Item
              label="Your Review"
              name="comment"
              rules={[
                { required: true, message: "Please write your review" },
                { min: 10, message: "Review must be at least 10 characters" },
                { max: 2000, message: "Review must be less than 2000 characters" }
              ]}
            >
              <Input.TextArea
                rows={4}
                placeholder="Share your detailed experience with this course..."
                showCount
                maxLength={2000}
              />
            </Form.Item>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="What did you like? (Pros)"
                  name="pros"
                >
                  <Input.TextArea
                    rows={3}
                    placeholder="What were the best parts of this course?"
                    maxLength={1000}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="What could be improved? (Cons)"
                  name="cons"
                >
                  <Input.TextArea
                    rows={3}
                    placeholder="What could be better about this course?"
                    maxLength={1000}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Form.Item
                  label="Course Difficulty"
                  name="difficulty"
                >
                  <Select placeholder="How difficult was this course?">
                    <Select.Option value="very_easy">Very Easy</Select.Option>
                    <Select.Option value="easy">Easy</Select.Option>
                    <Select.Option value="medium">Medium</Select.Option>
                    <Select.Option value="hard">Hard</Select.Option>
                    <Select.Option value="very_hard">Very Hard</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  label="Instructor Rating"
                  name="instructorRating"
                >
                  <Rate allowHalf />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  label="Content Quality"
                  name="contentQuality"
                >
                  <Rate allowHalf />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Form.Item
                  label="Value for Money"
                  name="valueForMoney"
                >
                  <Rate allowHalf />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  label="Review Language"
                  name="language"
                >
                  <Select>
                    <Select.Option value="english">English</Select.Option>
                    <Select.Option value="french">French</Select.Option>
                    <Select.Option value="both">Both</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  label="Privacy"
                  name="isAnonymous"
                  valuePropName="checked"
                >
                  <Checkbox>Post anonymously</Checkbox>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
}
