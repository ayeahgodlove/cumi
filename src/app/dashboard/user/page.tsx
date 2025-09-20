"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Col,
  Row,
  Card,
  Statistic,
  Typography,
  Space,
  Tag,
  Button,
  Spin,
  Tabs,
  Tooltip,
  Avatar,
  Divider,
  Badge,
  Image,
  Modal,
  Descriptions,
  Rate,
  Form,
  Input,
  Select,
  DatePicker,
  Switch,
  InputNumber,
} from "antd";
import {
  BookOutlined,
  CalendarOutlined,
  EyeOutlined,
  UserOutlined,
  HeartOutlined,
  HeartFilled,
  CheckCircleOutlined,
  ClockCircleOutlined,
  StarOutlined,
  TeamOutlined,
  EnvironmentOutlined,
  ReadOutlined,
} from "@ant-design/icons";
import { useSession } from "next-auth/react";
import { useTranslation } from "@contexts/translation.context";
import { statsAPI } from "@store/api/stats_api";
import { postInteractionAPI } from "@store/api/post-interaction_api";
import { courseEnrollmentAPI } from "@store/api/course-enrollment_api";
import { useTable } from "@refinedev/antd";
import { BaseRecord, useNotification } from "@refinedev/core";
import { format } from "@utils/format";
import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";
import EnhancedBreadcrumb from "@components/shared/enhanced-breadcrumb/enhanced-breadcrumb.component";

const { Title, Text } = Typography;

export default function UserDashboard() {
  const { data: session, status } = useSession();
  const { t } = useTranslation();
  
  // Course enrollment state
  const [enrollingCourse, setEnrollingCourse] = useState<string | null>(null);
  const [likingPost, setLikingPost] = useState<string | null>(null);
  const [registeringEvent, setRegisteringEvent] = useState<string | null>(null);
  
  // Modal states
  const [courseModalVisible, setCourseModalVisible] = useState(false);
  const [postModalVisible, setPostModalVisible] = useState(false);
  const [eventModalVisible, setEventModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  
  // Enrollment modal states
  const [enrollmentModalVisible, setEnrollmentModalVisible] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  
  // Event registration modal states
  const [eventRegistrationModalVisible, setEventRegistrationModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  
  // State management for interactions
  const [enrolledCourses, setEnrolledCourses] = useState<Set<string>>(new Set());
  const [registeredEvents, setRegisteredEvents] = useState<Set<string>>(new Set());
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  const router = useRouter();
  const { open } = useNotification();
  const [enrollmentForm] = Form.useForm();
  const [eventRegistrationForm] = Form.useForm();

  // RTK Query hooks
  const [handlePostInteraction] =
    postInteractionAPI.useHandlePostInteractionMutation();
  
  // Get user's existing post interactions to initialize liked posts state
  const { 
    data: userInteractions, 
    isLoading: isLoadingInteractions,
    error: interactionsError,
    refetch: refetchInteractions 
  } = postInteractionAPI.useGetUserPostInteractionsQuery(
    session?.user?.id || "", 
    { skip: !session?.user?.id }
  ) as { 
    data: any[] | any | undefined, 
    isLoading: boolean,
    error: any,
    refetch: () => void 
  };

  // Get user's existing course enrollments to initialize enrolled courses state
  const { 
    data: userEnrollments, 
    isLoading: isLoadingEnrollments,
    error: enrollmentsError,
    refetch: refetchEnrollments 
  } = courseEnrollmentAPI.useGetCourseEnrollmentsByUserQuery(
    session?.user?.id || "", 
    { skip: !session?.user?.id }
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

  // Initialize liked posts from user's existing interactions
  useEffect(() => {
    if (userInteractions) {
      // Handle both array response and object response with data property
      const interactions = Array.isArray(userInteractions) ? userInteractions : userInteractions?.data || [];
      
      if (Array.isArray(interactions)) {
        const likedPostIds = interactions
          .filter((interaction: any) => interaction.action === 'like')
          .map((interaction: any) => interaction.postId);
        
        setLikedPosts(new Set(likedPostIds));
      }
    } else if (interactionsError) {
      // If there's an error loading interactions, start with empty set
      setLikedPosts(new Set());
    }
  }, [userInteractions, interactionsError, isLoadingInteractions]);

  // Initialize enrolled courses from user's existing enrollments
  useEffect(() => {
    if (userEnrollments) {
      // Handle both array response and object response with data property
      const enrollments = Array.isArray(userEnrollments) ? userEnrollments : (userEnrollments as any)?.data || [];
      
      if (Array.isArray(enrollments)) {
        const enrolledCourseIds = enrollments
          .filter((enrollment: any) => enrollment.status === 'active' || enrollment.status === 'completed')
          .map((enrollment: any) => enrollment.courseId);
        
        setEnrolledCourses(new Set(enrolledCourseIds));
      }
    } else if (enrollmentsError) {
      // If there's an error loading enrollments, start with empty set
      setEnrolledCourses(new Set());
    }
  }, [userEnrollments, enrollmentsError, isLoadingEnrollments]);

  // Handle course enrollment - show modal
  const handleEnrollCourse = (courseId: string, courseTitle: string) => {
    if (!session?.user?.id) {
      open?.({
        type: "error",
        message: "Authentication Required",
        description: "Please log in to enroll in courses.",
      });
      return;
    }
    
    // Check if already enrolled
    if (enrolledCourses.has(courseId)) {
      open?.({
        type: "success",
        message: "Already Enrolled",
        description: "You are already enrolled in this course! 📚",
      });
      return;
    }
    
    const coursesData = Array.isArray(coursesQueryResult.data) 
      ? coursesQueryResult.data 
      : coursesQueryResult.data?.data || [];
    const course = coursesData.find((c: any) => c.id === courseId);
    setSelectedCourse(course);
    setEnrollmentModalVisible(true);
    
    // Pre-fill form with course data
    enrollmentForm.setFieldsValue({
      courseId,
      userId: session.user.id,
      studentPhone: (session.user as any).phoneNumber || "",
      certificateName: (session.user as any).fullName || session.user.name || "",
      certificateLanguage: "both",
      preferredContact: "whatsapp",
    });
  };
  
  // Submit enrollment form
  const handleEnrollmentSubmit = async (values: any) => {
    setEnrollingCourse(selectedCourse?.id);
    try {
      const response = await fetch("/api/enrollments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          id: nanoid(20),
          enrollmentDate: new Date(),
          // Set admin-controlled defaults
          status: "active",
          paymentStatus: selectedCourse?.isFree ? "free" : "pending",
        }),
      });

      const result = await response.json();

      if (result.success) {
        open?.({
          type: "success",
          message: "Enrollment Successful!",
          description: result.roleUpdated 
            ? `Successfully enrolled in "${selectedCourse?.title}"! Your role has been updated to student.`
            : `Successfully enrolled in "${selectedCourse?.title}"!`,
        });
        
        // Update local state
        setEnrolledCourses(prev => new Set([...prev, selectedCourse?.id]));
        
        // If role was updated, refresh the page to update session and UI
        if (result.roleUpdated) {
          setTimeout(() => {
            window.location.reload();
          }, 2000); // Give user time to read the success message
        }
        
        // Close modal and refresh data
        setEnrollmentModalVisible(false);
        enrollmentForm.resetFields();
        coursesQueryResult.refetch();
        refetchEnrollments();
      } else {
        if (response.status === 409 || result.message?.includes("already enrolled")) {
          // Handle duplicate enrollment from backend - update local state
          setEnrolledCourses(prev => new Set([...prev, selectedCourse?.id]));
          open?.({
            type: "success",
            message: "Already Enrolled",
            description: "You are already enrolled in this course! 📚",
          });
        } else {
          open?.({
            type: "error",
            message: "Enrollment Failed",
            description: result.message || "Failed to enroll in course.",
          });
        }
      }
    } catch (error) {
      console.error("Enrollment error:", error);
      open?.({
        type: "error",
        message: "Enrollment Failed",
        description: "Failed to enroll in course. Please try again.",
      });
    } finally {
      setEnrollingCourse(null);
    }
  };

  // Handle event registration - show modal
  const handleRegisterEvent = (eventId: string, eventTitle: string) => {
    if (!session?.user?.id) {
      open?.({
        type: "error",
        message: "Authentication Required",
        description: "Please log in to register for events.",
      });
      return;
    }
    
    const eventsData = Array.isArray(eventsQueryResult.data) 
      ? eventsQueryResult.data 
      : eventsQueryResult.data?.data || [];
    const event = eventsData.find((e: any) => e.id === eventId);
    setSelectedEvent(event);
    setEventRegistrationModalVisible(true);
    
    // Pre-fill form with event data
    eventRegistrationForm.setFieldsValue({
      eventId,
      userId: session.user.id,
      name: (session.user as any).fullName || session.user.name || "",
      email: session.user.email || "",
      phone: (session.user as any).phoneNumber || "",
      paymentAmount: event?.isFree ? 0 : event?.entryFee,
    });
  };
  
  // Submit event registration form
  const handleEventRegistrationSubmit = async (values: any) => {
    setRegisteringEvent(selectedEvent?.id);
    try {
      const response = await fetch("/api/event-registrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          id: nanoid(20),
          registrationDate: new Date(),
          // Set admin-controlled defaults
          status: "pending",
          paymentStatus: selectedEvent?.isFree ? "paid" : "pending",
        }),
      });

      const result = await response.json();

      if (result.success) {
        open?.({
          type: "success",
          message: "Registration Successful!",
          description: `Successfully registered for "${selectedEvent?.title}"!`,
        });
        
        // Update local state
        setRegisteredEvents(prev => new Set([...prev, selectedEvent?.id]));
        
        // Close modal and refresh data
        setEventRegistrationModalVisible(false);
        eventRegistrationForm.resetFields();
        eventsQueryResult.refetch();
      } else {
        if (response.status === 409) {
          open?.({
            type: "error",
            message: "Already Registered",
            description: "You are already registered for this event.",
          });
        } else {
          open?.({
            type: "error",
            message: "Registration Failed",
            description: result.message || "Failed to register for event.",
          });
        }
      }
    } catch (error) {
      console.error("Event registration error:", error);
      open?.({
        type: "error",
        message: "Registration Failed",
        description: "Failed to register for event. Please try again.",
      });
    } finally {
      setRegisteringEvent(null);
    }
  };

  // Handle post like
  const handleLikePost = async (postId: string, postTitle: string) => {
    if (!session?.user?.id) {
      open?.({
        type: "error",
        message: "Authentication Required",
        description: "Please log in to like posts.",
      });
      return;
    }
    
    // Check if already liked - prevent double-clicking
    if (likedPosts.has(postId)) {
      open?.({
        type: "success",
        message: "Already Liked",
        description: "You have already liked this post! ❤️",
      });
      return;
    }

    // Check if currently liking this post - prevent rapid clicking
    if (likingPost === postId) {
      return;
    }

    setLikingPost(postId);
    try {
      await handlePostInteraction({ postId, action: "like" }).unwrap();
      
      // Update local state immediately for better UX
      setLikedPosts(prev => new Set([...prev, postId]));
      
      open?.({
        type: "success",
        message: "Post Liked! ❤️",
        description: `Successfully liked "${postTitle.length > 50 ? postTitle.substring(0, 50) + '...' : postTitle}"`,
      });
      
      // Refresh data to get updated like counts and interactions
      postsQueryResult.refetch();
      refetchInteractions();
    } catch (error: any) {
      console.error("Post interaction error:", error);
      
      // Handle different error types with better user feedback
      if (error?.status === 409 || error?.data?.isDuplicate) {
        // Handle duplicate like from backend - update local state to stay in sync
        setLikedPosts(prev => new Set([...prev, postId]));
        open?.({
          type: "success",
          message: "Already Liked",
          description: error?.data?.message || "You have already liked this post! ❤️",
        });
      } else if (error?.data?.status === 503 || error?.status === 503) {
        open?.({
          type: "success",
          message: "Feature Coming Soon",
          description: "Post interactions feature is coming soon! 👍",
        });
      } else if (error?.data?.status === 401 || error?.status === 401) {
        open?.({
          type: "error",
          message: "Authentication Required",
          description: "Please log in to like posts.",
        });
      } else if (error?.data?.message?.includes("doesn't exist") || error?.message?.includes("doesn't exist")) {
        open?.({
          type: "success",
          message: "Feature Setup in Progress",
          description: "Post interactions feature is being set up. Please try again later! 🚀",
        });
      } else {
        open?.({
          type: "error",
          message: "Unable to Like Post",
          description: "There was an issue liking this post. Please try again.",
        });
      }
    } finally {
      setLikingPost(null);
    }
  };

  // Handle view course
  const handleViewCourse = (course: any) => {
    setSelectedItem(course);
    setCourseModalVisible(true);
  };
  
  // Handle navigate to full course
  const handleNavigateToCourse = (courseId: string, courseSlug?: string) => {
    if (courseSlug) {
      router.push(`/courses/${courseSlug}`);
    } else {
      router.push(`/courses/${courseId}`);
    }
  };

  // Handle view post
  const handleViewPost = (post: any) => {
    setSelectedItem(post);
    setPostModalVisible(true);
  };
  
  // Handle navigate to full post
  const handleNavigateToPost = (postId: string, postSlug?: string) => {
    if (postSlug) {
      router.push(`/blog_posts/${postSlug}`);
    } else {
      router.push(`/blog_posts/${postId}`);
    }
  };

  // Handle view event
  const handleViewEvent = (event: any) => {
    setSelectedItem(event);
    setEventModalVisible(true);
  };
  
  // Handle navigate to full event
  const handleNavigateToEvent = (eventId: string, eventSlug?: string) => {
    if (eventSlug) {
      router.push(`/events/${eventSlug}`);
    } else {
      router.push(`/events/event/${eventId}`);
    }
  };

  // Course card renderer
  const renderCourseCards = (courses: readonly any[]) => {
    if (!courses || courses.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
          <BookOutlined style={{ fontSize: 48, marginBottom: 16 }} />
          <div>No courses available</div>
        </div>
      );
    }

    return (
      <Row gutter={[16, 16]}>
        {courses.map((course: any) => {
          const isEnrolled = course.enrollmentStatus === "enrolled" || enrolledCourses.has(course.id);
          return (
            <Col xs={24} sm={12} md={8} lg={6} key={course.id}>
              <Card
                hoverable
                style={{
                  backgroundColor: "white",
                  borderRadius: "12px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  border: "none",
                  minHeight: "350px",
                  display: "flex",
                  flexDirection: "column",
                }}
                cover={
                  <div style={{ height: 120, overflow: 'hidden', position: 'relative' }}>
                    <Image
                      alt={course.title}
                      src={course.imageUrl || '/api/placeholder/300/120'}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      preview={false}
                    />
                    <div style={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      backgroundColor: 'rgba(0,0,0,0.7)',
                      borderRadius: '4px',
                      padding: '2px 6px'
                    }}>
                      {course.isFree ? (
                        <Tag color="green" style={{ margin: 0, fontSize: '10px' }}>Free</Tag>
                      ) : (
                        <span style={{ color: 'white', fontSize: '10px' }}>
                          {course.price || 0} {course.currency || "XAF"}
                        </span>
                      )}
                    </div>
                  </div>
                }
              >
                <div style={{ padding: '12px 16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ marginBottom: 8 }}>
                      <Text strong style={{ fontSize: 14, lineHeight: 1.2 }}>
                        {course.title?.length > 40 ? `${course.title.substring(0, 40)}...` : course.title}
                      </Text>
                    </div>
                    
                    <div style={{ marginBottom: 8, minHeight: 32 }}>
                      <Text type="secondary" style={{ fontSize: 12, lineHeight: 1.3 }}>
                        {course.description?.length > 60 ? `${course.description.substring(0, 60)}...` : course.description}
                      </Text>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8, gap: 8 }}>
                      <Avatar size={16} icon={<UserOutlined />} />
                      <Text style={{ fontSize: 11 }}>{course.authorName}</Text>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <Space size={4}>
                        <StarOutlined style={{ color: '#faad14', fontSize: 12 }} />
                        <Text style={{ fontSize: 11 }}>4.5</Text>
                      </Space>
                      <Space size={4}>
                        <TeamOutlined style={{ color: '#1890ff', fontSize: 12 }} />
                        <Text style={{ fontSize: 11 }}>120</Text>
                      </Space>
                    </div>
                  </div>

                  <div style={{ marginTop: 'auto' }}>
                    <Space size={8} style={{ width: '100%' }}>
                      <Tooltip title="View course details">
                        <Button
                          icon={<EyeOutlined />}
                          size="small"
                          style={{ borderRadius: 6 }}
                          onClick={() => handleViewCourse(course)}
                        />
                      </Tooltip>
                      {isEnrolled ? (
                        <Button
                          type="primary"
                          size="small"
                          icon={<CheckCircleOutlined />}
                          disabled
                          style={{ borderRadius: 6, flex: 1 }}
                        >
                          Enrolled
                        </Button>
                      ) : (
                        <Button
                          type="primary"
                          size="small"
                          loading={enrollingCourse === course.id}
                          onClick={() => handleEnrollCourse(course.id, course.title)}
                          style={{ borderRadius: 6, flex: 1 }}
                        >
                          Enroll
                        </Button>
                      )}
                    </Space>
                  </div>
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>
    );
  };

  // Post card renderer
  const renderPostCards = (posts: readonly any[]) => {
    if (!posts || posts.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
          <ReadOutlined style={{ fontSize: 48, marginBottom: 16 }} />
          <div>No posts available</div>
        </div>
      );
    }

    return (
      <Row gutter={[16, 16]}>
        {posts.map((post: any) => (
          <Col xs={24} sm={12} md={8} lg={6} key={post.id}>
            <Card
              hoverable
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                border: "none",
                  minHeight: "300px",
                  display: "flex",
                  flexDirection: "column",
              }}
              cover={
                <div style={{ height: 100, overflow: 'hidden', position: 'relative' }}>
                  <Image
                    alt={post.title}
                    src={post.imageUrl || '/api/placeholder/300/100'}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    preview={false}
                  />
                  <div style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                  }}>
                    <Badge 
                      status={post.status === 'published' ? 'success' : post.status === 'draft' ? 'warning' : 'default'} 
                      text={post.status}
                      style={{ 
                        backgroundColor: 'rgba(255,255,255,0.9)', 
                        borderRadius: '4px', 
                        padding: '2px 6px',
                        fontSize: '10px'
                      }}
                    />
                  </div>
                </div>
              }
            >
              <div style={{ padding: '8px 0' }}>
                <div style={{ marginBottom: 8 }}>
                  <Text strong style={{ fontSize: 14, lineHeight: 1.2 }}>
                    {post.title?.length > 45 ? `${post.title.substring(0, 45)}...` : post.title}
                  </Text>
                </div>
                
                <div style={{ marginBottom: 12, minHeight: 36 }}>
                  <Text type="secondary" style={{ fontSize: 12, lineHeight: 1.3 }}>
                    {post.description?.length > 70 ? `${post.description.substring(0, 70)}...` : post.description}
                  </Text>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12, gap: 8 }}>
                  <Avatar size={16} icon={<UserOutlined />} />
                  <Text style={{ fontSize: 11 }}>{post.authorName || 'Author'}</Text>
                  <Divider type="vertical" style={{ margin: '0 4px' }} />
                  <ClockCircleOutlined style={{ fontSize: 11, color: '#999' }} />
                  <Text style={{ fontSize: 11, color: '#999' }}>
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Draft'}
                  </Text>
                </div>

                <Space size={8} style={{ width: '100%' }}>
                  <Tooltip title="Read post">
                    <Button
                      icon={<EyeOutlined />}
                      size="small"
                      style={{ borderRadius: 6 }}
                        onClick={() => handleViewPost(post)}
                    />
                  </Tooltip>
                  <Tooltip title={likedPosts.has(post.id) ? "You've already liked this post" : "Like this post"}>
                    <Button
                      icon={likedPosts.has(post.id) ? <HeartFilled /> : <HeartOutlined />}
                      size="small"
                      type={likedPosts.has(post.id) ? "primary" : "default"}
                      loading={likingPost === post.id}
                      disabled={likedPosts.has(post.id)}
                      onClick={() => handleLikePost(post.id, post.title)}
                      style={{ 
                        borderRadius: 6, 
                        flex: 1,
                        backgroundColor: likedPosts.has(post.id) ? '#ff4d4f' : undefined,
                        borderColor: likedPosts.has(post.id) ? '#ff4d4f' : undefined,
                        color: likedPosts.has(post.id) ? 'white' : undefined
                      }}
                    >
                      {likedPosts.has(post.id) ? 'Liked' : 'Like'}
                    </Button>
                  </Tooltip>
                </Space>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    );
  };

  // Event card renderer
  const renderEventCards = (events: readonly any[]) => {
    if (!events || events.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
          <CalendarOutlined style={{ fontSize: 48, marginBottom: 16 }} />
          <div>No events available</div>
        </div>
      );
    }

    return (
      <Row gutter={[16, 16]}>
        {events.map((event: any) => {
          const isRegistered = event.registrationStatus === "registered" || registeredEvents.has(event.id);
          const eventDate = event.eventDate ? new Date(event.eventDate) : null;
          const isUpcoming = eventDate && eventDate > new Date();
          
          return (
            <Col xs={24} sm={12} md={8} lg={6} key={event.id}>
              <Card
                hoverable
                style={{
                  backgroundColor: "white",
                  borderRadius: "12px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  border: "none",
                  minHeight: "350px",
                  display: "flex",
                  flexDirection: "column",
                }}
                cover={
                  <div style={{ height: 100, overflow: 'hidden', position: 'relative' }}>
                    <Image
                      alt={event.title}
                      src={event.imageUrl || '/api/placeholder/300/100'}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      preview={false}
                    />
                    <div style={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                    }}>
                      <Tag 
                        color={event.status === 'published' ? 'green' : event.status === 'cancelled' ? 'red' : event.status === 'completed' ? 'blue' : 'orange'}
                        style={{ fontSize: '10px' }}
                      >
                        {event.status}
                      </Tag>
                    </div>
                    {isUpcoming && (
                      <div style={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        backgroundColor: '#ff4d4f',
                        color: 'white',
                        borderRadius: '4px',
                        padding: '2px 6px',
                        fontSize: '10px',
                        fontWeight: 'bold'
                      }}>
                        UPCOMING
                      </div>
                    )}
                  </div>
                }
              >
                <div style={{ padding: '12px 16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ marginBottom: 8 }}>
                    <Text strong style={{ fontSize: 14, lineHeight: 1.2 }}>
                      {event.title?.length > 40 ? `${event.title.substring(0, 40)}...` : event.title}
                    </Text>
                  </div>
                  
                  <div style={{ marginBottom: 8, minHeight: 32 }}>
                    <Text type="secondary" style={{ fontSize: 12, lineHeight: 1.3 }}>
                      {event.description?.length > 60 ? `${event.description.substring(0, 60)}...` : event.description}
                    </Text>
                  </div>

                  <div style={{ marginBottom: 8 }}>
                    <Space size={4}>
                      <CalendarOutlined style={{ fontSize: 12, color: '#1890ff' }} />
                      <Text style={{ fontSize: 11 }}>
                        {eventDate ? eventDate.toLocaleDateString() : 'TBD'}
                      </Text>
                    </Space>
                  </div>

                  <div style={{ marginBottom: 12 }}>
                    <Space size={4}>
                      <EnvironmentOutlined style={{ fontSize: 12, color: '#52c41a' }} />
                      <Text style={{ fontSize: 11 }}>{event.location || 'Online'}</Text>
                    </Space>
                  </div>

                  <Space size={8} style={{ width: '100%' }}>
                    <Tooltip title="View event details">
                      <Button
                        icon={<EyeOutlined />}
                        size="small"
                        style={{ borderRadius: 6 }}
                        onClick={() => handleViewEvent(event)}
                      />
                    </Tooltip>
                    {isRegistered ? (
                      <Button
                        type="primary"
                        size="small"
                        icon={<CheckCircleOutlined />}
                        disabled
                        style={{ borderRadius: 6, flex: 1 }}
                      >
                        Registered
                      </Button>
                    ) : (
                      <Button
                        type="primary"
                        size="small"
                        loading={registeringEvent === event.id}
                        onClick={() => handleRegisterEvent(event.id, event.title)}
                        style={{ borderRadius: 6, flex: 1 }}
                      >
                        Register
                      </Button>
                    )}
                  </Space>
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>
    );
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

  // Only render user dashboard for regular users
  if (!session?.user || session.user.role !== "user") {
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

  // User-specific stats
  const userStats = [
    {
      title: "My Comments",
      value: stats.totalUserComments,
      icon: <UserOutlined />,
      color: "#722ed1",
    },
    {
      title: "My Likes",
      value: stats.totalUserLikes,
      icon: <CalendarOutlined />,
      color: "#52c41a",
    },
    {
      title: "Courses Enrolled",
      value: 0, // This would need to be fetched from course progress
      icon: <BookOutlined />,
      color: "#1890ff",
    },
    {
      title: "Events Attended",
      value: 0, // This would need to be fetched from event attendance
      icon: <CalendarOutlined />,
      color: "#13c2c2",
    },
  ];


  const tabItems = [
    {
      key: "courses",
      label: "Available Courses",
      children: (
        <div ref={coursesTableRef}>
          <div style={{ marginBottom: 16 }}>
            <Title level={4}>Browse Courses</Title>
            <Text type="secondary">
              Discover and enroll in courses to expand your knowledge
            </Text>
          </div>
          {renderCourseCards([...(coursesTableProps.dataSource || [])])}
        </div>
      ),
    },
    {
      key: "posts",
      label: "Blog Posts",
      children: (
        <div ref={postsTableRef}>
          <div style={{ marginBottom: 16 }}>
            <Title level={4}>Latest Posts</Title>
            <Text type="secondary">
              Read and interact with educational content
            </Text>
          </div>
          {renderPostCards([...(postsTableProps.dataSource || [])])}
        </div>
      ),
    },
    {
      key: "events",
      label: "Events",
      children: (
        <div ref={eventsTableRef}>
          <div style={{ marginBottom: 16 }}>
            <Title level={4}>Upcoming Events</Title>
            <Text type="secondary">
              Register for educational events and workshops
            </Text>
          </div>
          {renderEventCards([...(eventsTableProps.dataSource || [])])}
        </div>
      ),
    },
  ];

  return (
    <div>
      <EnhancedBreadcrumb
        items={[{ title: "User Dashboard" }]}
        showBackButton
      />

      <Title level={2}>User Dashboard</Title>
      
      {/* User Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Title level={4}>Your Activity</Title>
        </Col>
        {userStats.map((stat, index) => (
          <Col sm={6} md={6} span={24} key={index}>
            <Card
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

      {/* Content Browsing Tabs */}
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

      {/* Course View Modal */}
      <Modal
        title="Course Details"
        open={courseModalVisible}
        onCancel={() => {
          setCourseModalVisible(false);
          setSelectedItem(null);
        }}
        footer={[
          <Button key="close-course" onClick={() => setCourseModalVisible(false)} size="large">
            Close
          </Button>,
          <Button
            key="view-full-course"
            type="primary"
            onClick={() => {
              handleNavigateToCourse(selectedItem?.id, selectedItem?.slug);
              setCourseModalVisible(false);
            }}
            size="large"
          >
            View Full Course
          </Button>,
        ]}
        width={800}
      >
        {selectedItem && (
          <Card style={{ backgroundColor: 'white', border: 'none' }}>
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col xs={24} md={8}>
                <Image
                  src={selectedItem.imageUrl || '/api/placeholder/300/200'}
                  alt={selectedItem.title}
                  style={{ borderRadius: 8, width: '100%' }}
                />
              </Col>
              <Col xs={24} md={16}>
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <div>
                    <Title level={3} style={{ marginBottom: 8 }}>
                      {selectedItem.title}
                    </Title>
                    <Text type="secondary">by {selectedItem.authorName}</Text>
                  </div>
                  
                  <div>
                    <Space size="large">
                      <div>
                        <Rate disabled defaultValue={4.5} style={{ fontSize: 16 }} />
                        <Text style={{ marginLeft: 8 }}>4.5 (120 reviews)</Text>
                      </div>
                      <Tag color={selectedItem.isFree ? "green" : "blue"}>
                        {selectedItem.isFree ? "Free" : `${selectedItem.price || 0} ${selectedItem.currency || "XAF"}`}
                      </Tag>
                    </Space>
                  </div>
                  
                  <div>
                    <Text strong>Status: </Text>
                    <Tag color={selectedItem.status === 'published' ? 'green' : 'orange'}>
                      {selectedItem.status}
                    </Tag>
                  </div>
                </Space>
              </Col>
            </Row>
            
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Description">
                {selectedItem.description}
              </Descriptions.Item>
              <Descriptions.Item label="Level">
                {selectedItem.level || 'Beginner'}
              </Descriptions.Item>
              <Descriptions.Item label="Duration">
                {selectedItem.durationWeeks || 4} weeks
              </Descriptions.Item>
              <Descriptions.Item label="Language">
                {selectedItem.language || 'English'}
              </Descriptions.Item>
              <Descriptions.Item label="Students Enrolled">
                {selectedItem.currentStudents || 0} / {selectedItem.maxStudents || 'Unlimited'}
              </Descriptions.Item>
              <Descriptions.Item label="Certificate Available">
                {selectedItem.certificateAvailable ? 'Yes' : 'No'}
              </Descriptions.Item>
              <Descriptions.Item label="Created">
                {selectedItem.createdAt ? new Date(selectedItem.createdAt).toLocaleDateString() : '-'}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        )}
      </Modal>

      {/* Post View Modal */}
      <Modal
        title="Post Details"
        open={postModalVisible}
        onCancel={() => {
          setPostModalVisible(false);
          setSelectedItem(null);
        }}
        footer={[
          <Button key="close-post" onClick={() => setPostModalVisible(false)} size="large">
            Close
          </Button>,
          <Tooltip key="like-tooltip" title={selectedItem && likedPosts.has(selectedItem.id) ? "You've already liked this post" : "Like this post"}>
            <Button
              key="like-post"
              type={selectedItem && likedPosts.has(selectedItem.id) ? "primary" : "default"}
              icon={selectedItem && likedPosts.has(selectedItem.id) ? <HeartFilled /> : <HeartOutlined />}
              loading={likingPost === selectedItem?.id}
              disabled={selectedItem && likedPosts.has(selectedItem.id)}
              onClick={() => {
                if (selectedItem) {
                  handleLikePost(selectedItem.id, selectedItem.title);
                }
              }}
              style={{
                backgroundColor: selectedItem && likedPosts.has(selectedItem.id) ? '#ff4d4f' : undefined,
                borderColor: selectedItem && likedPosts.has(selectedItem.id) ? '#ff4d4f' : undefined,
                color: selectedItem && likedPosts.has(selectedItem.id) ? 'white' : undefined
              }}
              size="large"
            >
              {selectedItem && likedPosts.has(selectedItem.id) ? 'Liked' : 'Like Post'}
            </Button>
          </Tooltip>,
          <Button
            key="read-full-post"
            type="primary"
            onClick={() => {
              handleNavigateToPost(selectedItem?.id, selectedItem?.slug);
              setPostModalVisible(false);
            }}
            size="large"
          >
            Read Full Post
          </Button>,
        ]}
        width={700}
      >
        {selectedItem && (
          <Card style={{ backgroundColor: 'white', border: 'none' }}>
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col xs={24} md={8}>
                <Image
                  src={selectedItem.imageUrl || '/api/placeholder/300/200'}
                  alt={selectedItem.title}
                  style={{ borderRadius: 8, width: '100%' }}
                />
              </Col>
              <Col xs={24} md={16}>
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <div>
                    <Title level={3} style={{ marginBottom: 8 }}>
                      {selectedItem.title}
                    </Title>
                    <Text type="secondary">by {selectedItem.authorName || 'Author'}</Text>
                  </div>
                  
                  <div>
                    <Tag color={selectedItem.status === 'published' ? 'green' : selectedItem.status === 'draft' ? 'orange' : 'default'}>
                      {selectedItem.status}
                    </Tag>
                  </div>
                  
                  <div>
                    <Text type="secondary">
                      Published: {selectedItem.publishedAt ? new Date(selectedItem.publishedAt).toLocaleDateString() : 'Draft'}
                    </Text>
                  </div>
                </Space>
              </Col>
            </Row>
            
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Description">
                {selectedItem.description}
              </Descriptions.Item>
              <Descriptions.Item label="Content Preview">
                <div style={{ maxHeight: 200, overflow: 'auto' }}>
                  {selectedItem.content ? (
                    <div dangerouslySetInnerHTML={{ 
                      __html: selectedItem.content.substring(0, 500) + (selectedItem.content.length > 500 ? '...' : '') 
                    }} />
                  ) : (
                    'No content preview available'
                  )}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Category">
                {selectedItem.categoryId || 'Uncategorized'}
              </Descriptions.Item>
              <Descriptions.Item label="Created">
                {selectedItem.createdAt ? new Date(selectedItem.createdAt).toLocaleDateString() : '-'}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        )}
      </Modal>

      {/* Event View Modal */}
      <Modal
        title="Event Details"
        open={eventModalVisible}
        onCancel={() => {
          setEventModalVisible(false);
          setSelectedItem(null);
        }}
        footer={[
          <Button key="close-event" onClick={() => setEventModalVisible(false)} size="large">
            Close
          </Button>,
          selectedItem && selectedItem.registrationStatus !== "registered" && (
            <Button
              key="register-event"
              type="primary"
              loading={registeringEvent === selectedItem?.id}
              onClick={() => {
                if (selectedItem) {
                  handleRegisterEvent(selectedItem.id, selectedItem.title);
                  setEventModalVisible(false);
                }
              }}
              size="large"
            >
              Register Now
            </Button>
          ),
          <Button
            key="view-full-event"
            type="primary"
            onClick={() => {
              handleNavigateToEvent(selectedItem?.id, selectedItem?.slug);
              setEventModalVisible(false);
            }}
            size="large"
          >
            View Full Event
          </Button>,
        ].filter(Boolean)}
        width={800}
      >
        {selectedItem && (
          <Card style={{ backgroundColor: 'white', border: 'none' }}>
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col xs={24} md={8}>
                <Image
                  src={selectedItem.imageUrl || '/api/placeholder/300/200'}
                  alt={selectedItem.title}
                  style={{ borderRadius: 8, width: '100%' }}
                />
              </Col>
              <Col xs={24} md={16}>
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <div>
                    <Title level={3} style={{ marginBottom: 8 }}>
                      {selectedItem.title}
                    </Title>
                    <Text type="secondary">Organized by {selectedItem.userId}</Text>
                  </div>
                  
                  <div>
                    <Space>
                      <Tag color={selectedItem.status === 'published' ? 'green' : selectedItem.status === 'cancelled' ? 'red' : selectedItem.status === 'completed' ? 'blue' : 'orange'}>
                        {selectedItem.status}
                      </Tag>
                      {selectedItem.isFree ? (
                        <Tag color="green">Free Event</Tag>
                      ) : (
                        <Tag color="blue">{selectedItem.entryFee || 0} {selectedItem.currency || "XAF"}</Tag>
                      )}
                    </Space>
                  </div>
                  
                  <div>
                    <Space direction="vertical" size="small">
                      <div>
                        <CalendarOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                        <Text strong>Date: </Text>
                        <Text>{selectedItem.eventDate ? new Date(selectedItem.eventDate).toLocaleDateString() : 'TBD'}</Text>
                      </div>
                      <div>
                        <EnvironmentOutlined style={{ marginRight: 8, color: '#52c41a' }} />
                        <Text strong>Location: </Text>
                        <Text>{selectedItem.location || 'Online'}</Text>
                      </div>
                    </Space>
                  </div>
                </Space>
              </Col>
            </Row>
            
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Description">
                {selectedItem.description}
              </Descriptions.Item>
              <Descriptions.Item label="Event Duration">
                {selectedItem.eventDate && selectedItem.eventEndDate ? (
                  `${new Date(selectedItem.eventDate).toLocaleString()} - ${new Date(selectedItem.eventEndDate).toLocaleString()}`
                ) : (
                  selectedItem.eventDate ? new Date(selectedItem.eventDate).toLocaleString() : 'TBD'
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Target Audience">
                {selectedItem.targetAudience || 'General Public'}
              </Descriptions.Item>
              <Descriptions.Item label="Language">
                {selectedItem.language || 'English'}
              </Descriptions.Item>
              <Descriptions.Item label="Max Attendees">
                {selectedItem.maxAttendees || 'Unlimited'}
              </Descriptions.Item>
              <Descriptions.Item label="Current Attendees">
                {selectedItem.currentAttendees || 0}
              </Descriptions.Item>
              <Descriptions.Item label="Registration Required">
                {selectedItem.registrationRequired ? 'Yes' : 'No'}
              </Descriptions.Item>
              <Descriptions.Item label="Registration Deadline">
                {selectedItem.registrationDeadline ? new Date(selectedItem.registrationDeadline).toLocaleDateString() : 'No deadline'}
              </Descriptions.Item>
              <Descriptions.Item label="Requirements">
                {selectedItem.requirements || 'None'}
              </Descriptions.Item>
              <Descriptions.Item label="Contact">
                {selectedItem.contactEmail || selectedItem.contactPhone || 'Contact organizer'}
              </Descriptions.Item>
              <Descriptions.Item label="Created">
                {selectedItem.createdAt ? new Date(selectedItem.createdAt).toLocaleDateString() : '-'}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        )}
      </Modal>

      {/* Enrollment Modal */}
      <Modal
        title="Course Enrollment"
        open={enrollmentModalVisible}
        onCancel={() => {
          setEnrollmentModalVisible(false);
          setSelectedCourse(null);
          enrollmentForm.resetFields();
        }}
        footer={null}
        width={900}
      >
        {selectedCourse && (
          <Card style={{ backgroundColor: 'white', border: 'none' }}>
            <div style={{ marginBottom: 24 }}>
              <Title level={4}>{selectedCourse.title}</Title>
              <Text type="secondary">by {selectedCourse.authorName}</Text>
              <div style={{ marginTop: 8 }}>
                <Tag color={selectedCourse.isFree ? "green" : "blue"}>
                  {selectedCourse.isFree ? "Free Course" : `${selectedCourse.price || 0} ${selectedCourse.currency || "XAF"}`}
                </Tag>
              </div>
            </div>

            <Form
              form={enrollmentForm}
              layout="vertical"
              onFinish={handleEnrollmentSubmit}
              size="large"
            >
              <Form.Item name="courseId" style={{ display: 'none' }}>
                <Input type="hidden" />
              </Form.Item>
              
              <Form.Item name="userId" style={{ display: 'none' }}>
                <Input type="hidden" />
              </Form.Item>


              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Student Phone"
                    name="studentPhone"
                    rules={[{ required: true, message: "Please enter your phone number" }]}
                  >
                    <Input placeholder="+237 xxx xxx xxx" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Emergency Contact"
                    name="emergencyContact"
                  >
                    <Input placeholder="Emergency contact name and phone" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Education Level"
                    name="educationLevel"
                  >
                    <Select placeholder="Select your education level">
                      <Select.Option value="primary">Primary</Select.Option>
                      <Select.Option value="secondary">Secondary</Select.Option>
                      <Select.Option value="university">University</Select.Option>
                      <Select.Option value="professional">Professional</Select.Option>
                      <Select.Option value="other">Other</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Preferred Contact Method"
                    name="preferredContact"
                  >
                    <Select placeholder="How should we contact you?">
                      <Select.Option value="whatsapp">WhatsApp</Select.Option>
                      <Select.Option value="sms">SMS</Select.Option>
                      <Select.Option value="call">Phone Call</Select.Option>
                      <Select.Option value="email">Email</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Study Schedule"
                    name="studySchedule"
                  >
                    <Select placeholder="When do you prefer to study?">
                      <Select.Option value="morning">Morning</Select.Option>
                      <Select.Option value="afternoon">Afternoon</Select.Option>
                      <Select.Option value="evening">Evening</Select.Option>
                      <Select.Option value="weekend">Weekend</Select.Option>
                      <Select.Option value="flexible">Flexible</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Internet Access"
                    name="internetAccess"
                  >
                    <Select placeholder="What type of internet access do you have?">
                      <Select.Option value="high_speed">High Speed Internet</Select.Option>
                      <Select.Option value="mobile_data">Mobile Data</Select.Option>
                      <Select.Option value="limited">Limited Access</Select.Option>
                      <Select.Option value="cybercafe">Cybercafe</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="Motivation"
                name="motivation"
                rules={[{ required: true, message: "Please tell us why you want to take this course" }]}
              >
                <Input.TextArea
                  rows={3}
                  placeholder="Why do you want to take this course? What do you hope to achieve?"
                />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Certificate Name"
                    name="certificateName"
                  >
                    <Input placeholder="Name to appear on certificate" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Certificate Language"
                    name="certificateLanguage"
                  >
                    <Select placeholder="Certificate language preference">
                      <Select.Option value="english">English</Select.Option>
                      <Select.Option value="french">French</Select.Option>
                      <Select.Option value="both">Both Languages</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              {!selectedCourse?.isFree && (
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="Payment Method"
                      name="paymentMethod"
                    >
                      <Select placeholder="How will you pay?">
                        <Select.Option value="mobile_money">Mobile Money</Select.Option>
                        <Select.Option value="bank_transfer">Bank Transfer</Select.Option>
                        <Select.Option value="cash">Cash</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Amount to Pay"
                      name="amountPaid"
                    >
                      <InputNumber
                        min={0}
                        style={{ width: '100%' }}
                        placeholder={`Course fee: ${selectedCourse?.price || 0} XAF`}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              )}

              <Form.Item>
                <Space>
                  <Button
                    onClick={() => {
                      setEnrollmentModalVisible(false);
                      setSelectedCourse(null);
                      enrollmentForm.resetFields();
                    }}
                    size="large"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={enrollingCourse === selectedCourse?.id}
                    size="large"
                  >
                    Enroll Now
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        )}
      </Modal>

      {/* Event Registration Modal */}
      <Modal
        title="Event Registration"
        open={eventRegistrationModalVisible}
        onCancel={() => {
          setEventRegistrationModalVisible(false);
          setSelectedEvent(null);
          eventRegistrationForm.resetFields();
        }}
        footer={null}
        width={800}
      >
        {selectedEvent && (
          <Card style={{ backgroundColor: 'white', border: 'none' }}>
            <div style={{ marginBottom: 24 }}>
              <Title level={4}>{selectedEvent.title}</Title>
              <div style={{ marginTop: 8 }}>
                <Space>
                  <Tag color="blue">
                    <CalendarOutlined /> {selectedEvent.eventDate ? new Date(selectedEvent.eventDate).toLocaleDateString() : 'TBD'}
                  </Tag>
                  <Tag color="green">
                    <EnvironmentOutlined /> {selectedEvent.location || 'Online'}
                  </Tag>
                  {selectedEvent.isFree ? (
                    <Tag color="green">Free Event</Tag>
                  ) : (
                    <Tag color="orange">{selectedEvent.entryFee || 0} {selectedEvent.currency || "XAF"}</Tag>
                  )}
                </Space>
              </div>
            </div>

            <Form
              form={eventRegistrationForm}
              layout="vertical"
              onFinish={handleEventRegistrationSubmit}
              size="large"
            >
              <Form.Item name="eventId" style={{ display: 'none' }}>
                <Input type="hidden" />
              </Form.Item>
              
              <Form.Item name="userId" style={{ display: 'none' }}>
                <Input type="hidden" />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Full Name"
                    name="name"
                    rules={[{ required: true, message: "Please enter your full name" }]}
                  >
                    <Input placeholder="Your full name for the event" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Email Address"
                    name="email"
                    rules={[
                      { required: true, message: "Please enter your email" },
                      { type: 'email', message: 'Please enter a valid email' }
                    ]}
                  >
                    <Input placeholder="your.email@example.com" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Phone Number"
                    name="phone"
                    rules={[{ required: true, message: "Please enter your phone number" }]}
                  >
                    <Input placeholder="+237 xxx xxx xxx" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Company/Organization"
                    name="company"
                  >
                    <Input placeholder="Your company or organization (optional)" />
                  </Form.Item>
                </Col>
              </Row>


              {!selectedEvent?.isFree && (
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="Payment Method"
                      name="paymentMethod"
                    >
                      <Select placeholder="How will you pay?">
                        <Select.Option value="mobile_money">Mobile Money</Select.Option>
                        <Select.Option value="bank_transfer">Bank Transfer</Select.Option>
                        <Select.Option value="cash">Cash</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Payment Amount"
                      name="paymentAmount"
                    >
                      <InputNumber
                        min={0}
                        style={{ width: '100%' }}
                        placeholder={`Entry fee: ${selectedEvent?.entryFee || 0} XAF`}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              )}

              <Form.Item
                label="Dietary Requirements"
                name="dietaryRequirements"
              >
                <Input.TextArea
                  rows={2}
                  placeholder="Any dietary restrictions or requirements (optional)"
                />
              </Form.Item>

              <Form.Item
                label="Additional Notes"
                name="additionalNotes"
              >
                <Input.TextArea
                  rows={3}
                  placeholder="Any special requirements, questions, or additional information..."
                />
              </Form.Item>

              <Form.Item>
                <Space>
                  <Button
                    onClick={() => {
                      setEventRegistrationModalVisible(false);
                      setSelectedEvent(null);
                      eventRegistrationForm.resetFields();
                    }}
                    size="large"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={registeringEvent === selectedEvent?.id}
                    size="large"
                  >
                    Register Now
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        )}
      </Modal>
    </div>
  );
}
