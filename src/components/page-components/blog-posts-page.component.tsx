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
import { useTranslation } from "@contexts/translation.context";

const { Content } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

export default function BlogPostsPageComponent() {
  const { t } = useTranslation();
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

  const loading = isLoadingCategory || isFetchCategory || isLoadingTag || isFetchTag || isLoadingUser || isFetchUser;

  return (
    <ErrorBoundary>
      <PageLayout
        showBanner={true}
        bannerTitle={t("blog.title")}
        bannerBreadcrumbs={[{ label: t("blog.breadcrumb"), uri: "blog_posts" }]}
      >

      <div className="container py-5 mb-5">
        {error && <h1>{t("blog.something_wrong")}</h1>}

        {loading ? (
          <div style={{ minHeight: "50vh", display: "flex", justifyContent: "center", alignItems: "center", padding: '20px' }}>
            <Card style={{ padding: '40px', borderRadius: '16px', textAlign: 'center', maxWidth: '400px' }}>
              <Spin size="large" />
              <div style={{ marginTop: '16px', fontSize: '16px', color: '#666' }}>{t("blog.loading_content")}</div>
            </Card>
          </div>
        ) : (
          <>
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
            searchPlaceholder={t("blog.search_placeholder")}
            filters={[
              {
                label: t("blog.sort_by"),
                key: "sort",
                options: [
                  { label: t("blog.title_sort"), value: "title" },
                  { label: t("blog.date_sort"), value: "createdAt" },
                  { label: t("blog.published_date_sort"), value: "publishedAt" }
                ],
                value: sortOrder || "",
                onChange: (value: string) => setSortOrder(value as SortPostsType),
                placeholder: t("blog.sort_by")
              }
            ]}
            resultsCount={posts?.length || 0}
            resultsLabel={t("blog.articles_found")}
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
              <LoadingSpinner tip={t("blog.loading_articles")} />
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
                        {t("blog.no_articles_title")}
                      </Title>
                      <Text type="secondary" style={{ fontSize: '16px' }}>
                        {t("blog.no_articles_desc")}
                      </Text>
                    </div>
                  }
                />
              </Card>
            </Col>
          )}
        </div>
          </>
        )}
      </div>
      </PageLayout>
    </ErrorBoundary>
  );
}
