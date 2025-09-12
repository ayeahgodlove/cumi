"use client";
import {
  Col,
  Empty,
  Layout,
  Row,
  Spin,
  Card,
  Typography,
  Input,
  Select,
  Space,
  Tag,
  Button,
  Badge,
  Divider,
} from "antd";
import { useState } from "react";
import { motion } from "framer-motion";
import { postAPI } from "@store/api/post_api";
import { SortPostsType } from "@domain/models/shared/sort.model";
import BlogPostItem from "@components/blog_post/blog_post_item";
import PostSidebar from "@components/blog_post/containers/PostSidebar";
import { categoryAPI } from "@store/api/category_api";
import { tagAPI } from "@store/api/tag_api";
import { userAPI } from "@store/api/user_api";
import {
  SearchOutlined,
  FilterOutlined,
  SortAscendingOutlined,
  BookOutlined,
  CalendarOutlined,
  UserOutlined,
  EyeOutlined,
  LikeOutlined,
  CommentOutlined,
  ShareAltOutlined,
  FireOutlined,
  StarOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { 
  PageLayout, 
  LoadingSpinner, 
  ErrorBoundary,
  SearchAndFilterBar 
} from "@components/shared";

const { Content } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

export default function BlogPostsPageComponent() {
  const [searchTitle, setSearchTitle] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<SortPostsType>();

  const {
    data: postsResponse,
    error,
    isLoading,
    isFetching,
  } = postAPI.useFetchAllPostsQuery({
    searchTitle: searchTitle,
    sortBy: sortOrder,
    page: 1,
    limit: 10,
  });

  const posts = postsResponse || [];

  const {
    data: categories,
    isLoading: isLoadingCategory,
    isFetching: isFetchCategory,
  } = categoryAPI.useFetchAllCategoriesQuery(1);

  const {
    data: tags,
    isLoading: isLoadingTag,
    isFetching: isFetchTag,
  } = tagAPI.useFetchAllTagsQuery(1);

  const {
    data: users,
    isLoading: isLoadingUser,
    isFetching: isFetchUser,
  } = userAPI.useFetchAllUsersQuery(1);

  if (
    isLoadingCategory ||
    isFetchCategory ||
    isLoadingTag ||
    isFetchTag ||
    isLoadingUser ||
    isFetchUser
  ) {
    return <LoadingSpinner tip="Loading blog content..." />;
  }

  return (
    <ErrorBoundary>
      <PageLayout
        showBanner={true}
        bannerTitle="Our Blog"
        bannerBreadcrumbs={[{ label: "Blog Posts", uri: "blog_posts" }]}
      >

      <div className="container py-5 mb-5">
        {error && <h1>Something wrong...</h1>}

        {/* Hero Section */}
        <section 
          className="py-5"
          style={{
            background: 'linear-gradient(135deg, #22C55E 0%, #14B8A6 50%, #0EA5E9 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            marginBottom: '3rem',
            borderRadius: '40px'
          }}
        >
          <div 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
              opacity: 0.3
            }}
          />
          <div className="" style={{ position: 'relative', zIndex: 1 }}>
            <Row justify="center" align="middle">
              <Col xs={24} lg={18} className="text-center">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  {/* Floating Badge */}
                  <div style={{ 
                    position: 'relative',
                    display: 'inline-block',
                    marginBottom: '24px'
                  }}>
                    <Badge.Ribbon 
                      text="Latest Articles" 
                      color="gold"
                      style={{ 
                        fontSize: '12px',
                        fontWeight: '600',
                        letterSpacing: '0.5px'
                      }}
                    >
                      <div style={{ 
                        width: '60px', 
                        height: '60px',
                        background: 'rgba(255, 255, 255, 0.15)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backdropFilter: 'blur(10px)',
                        border: '2px solid rgba(255, 255, 255, 0.3)',
                        boxShadow: '0 8px 32px rgba(34, 197, 94, 0.2)'
                      }}>
                        <BookOutlined style={{ fontSize: '1.8rem', color: 'white' }} />
                      </div>
                    </Badge.Ribbon>
                  </div>

                  {/* Main Title */}
                  <Title 
                    level={1} 
                    style={{ 
                      color: 'white', 
                      marginBottom: '20px',
                      fontSize: '3.5rem',
                      fontWeight: '700',
                      textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                      letterSpacing: '-0.02em'
                    }}
                  >
                    Our Blog
                  </Title>

                  {/* Subtitle */}
                  <Text
                    style={{
                      fontSize: '20px',
                      color: 'rgba(255, 255, 255, 0.9)',
                      maxWidth: '700px',
                      display: 'block',
                      margin: '0 auto 32px auto',
                      lineHeight: '1.6',
                      fontWeight: '400'
                    }}
                  >
                    Discover insights, tutorials, and stories from our technology experts
                  </Text>

                  {/* Stats */}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    flexWrap: 'wrap',
                    gap: '32px',
                    marginTop: '32px'
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      background: 'rgba(255, 255, 255, 0.15)',
                      padding: '12px 20px',
                      borderRadius: '25px',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      boxShadow: '0 4px 16px rgba(34, 197, 94, 0.15)'
                    }}>
                      <CalendarOutlined style={{ fontSize: '18px', marginRight: '8px', color: 'rgba(255, 255, 255, 0.95)' }} />
                      <Text style={{ color: 'rgba(255, 255, 255, 0.95)', fontSize: '16px', fontWeight: '500' }}>
                        {posts?.length || 0} Articles
                      </Text>
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      background: 'rgba(255, 255, 255, 0.15)',
                      padding: '12px 20px',
                      borderRadius: '25px',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      boxShadow: '0 4px 16px rgba(20, 184, 166, 0.15)'
                    }}>
                      <UserOutlined style={{ fontSize: '18px', marginRight: '8px', color: 'rgba(255, 255, 255, 0.95)' }} />
                      <Text style={{ color: 'rgba(255, 255, 255, 0.95)', fontSize: '16px', fontWeight: '500' }}>
                        Expert Authors
                      </Text>
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      background: 'rgba(255, 255, 255, 0.15)',
                      padding: '12px 20px',
                      borderRadius: '25px',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      boxShadow: '0 4px 16px rgba(14, 165, 233, 0.15)'
                    }}>
                      <FireOutlined style={{ fontSize: '18px', marginRight: '8px', color: 'rgba(255, 255, 255, 0.95)' }} />
                      <Text style={{ color: 'rgba(255, 255, 255, 0.95)', fontSize: '16px', fontWeight: '500' }}>
                        Fresh Content
                      </Text>
                    </div>
                  </div>
                </motion.div>
              </Col>
            </Row>
          </div>
        </section>

        {/* Search and Filter Section */}
        <div style={{ 
          marginBottom: '2rem',
          padding: '24px',
          background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
          borderRadius: '16px',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)'
        }}>
          <SearchAndFilterBar
            searchValue={searchTitle}
            onSearchChange={setSearchTitle}
            searchPlaceholder="Search articles..."
            filters={[
              {
                label: "Sort by",
                key: "sort",
                options: [
                  { label: "Title", value: "title" },
                  { label: "Date", value: "createdAt" },
                  { label: "Published Date", value: "publishedAt" }
                ],
                value: sortOrder || "",
                onChange: (value: string) => setSortOrder(value as SortPostsType),
                placeholder: "Sort by"
              }
            ]}
            resultsCount={posts?.length || 0}
            resultsLabel="articles found"
          />
        </div>

        <div style={{ 
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          borderRadius: '20px',
          padding: '2rem',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)'
        }}>
          {(isLoading || isFetching) && (
            <div style={{ textAlign: "center", padding: "4rem 0" }}>
              <LoadingSpinner tip="Loading articles..." />
            </div>
          )}
          {posts && posts.length ? (
            <div className="row justify-content-center align-items-start">
              <div className="col-12 col-md-8">
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                  {posts?.map((post, index) => (
                    <Col
                      className="gutter-row"
                      xs={{ span: 24, offset: 0 }}
                      sm={{ span: 12, offset: 0 }}
                      lg={{ span: 12, offset: 0 }}
                      key={post.id}
                      style={{ marginBottom: 20 }}
                    >
                      <motion.div
                        className="box"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <BlogPostItem
                          users={isFetchUser || isLoadingUser ? [] : users}
                          categories={
                            isFetchCategory || isLoadingCategory
                              ? []
                              : categories || []
                          }
                          post={post}
                        />
                      </motion.div>
                    </Col>
                  ))}
                </Row>
              </div>
              <div className="col-12 col-md-4">
                <div style={{ position: "sticky", top: "2rem" }}>
                  <PostSidebar
                    posts={isLoading || isFetching ? [] : posts}
                    tags={isFetchTag || isLoadingTag ? [] : tags}
                    categories={
                      isFetchCategory || isLoadingCategory ? [] : categories || []
                    }
                  />
                </div>
              </div>
            </div>
          ) : (
            <Col span={24}>
              <Card
                style={{
                  borderRadius: "20px",
                  textAlign: "center",
                  padding: "3rem 2rem",
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                  border: '1px solid rgba(0, 0, 0, 0.05)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)'
                }}
              >
                <Empty
                  description={
                    <div>
                      <BookOutlined style={{ fontSize: '4rem', color: '#d1d5db', marginBottom: '16px' }} />
                      <Title level={4} style={{ color: "#64748b", marginBottom: '8px' }}>
                        No articles found
                      </Title>
                      <Text type="secondary" style={{ fontSize: '16px' }}>
                        Try adjusting your search criteria or check back later for new content
                      </Text>
                    </div>
                  }
                />
              </Card>
            </Col>
          )}
        </div>
      </div>
      </PageLayout>
    </ErrorBoundary>
  );
}
