"use client";
import PageContent from "@components/shared/page-content/index";
import BlogPostItem from "@components/blog_post/blog_post_item";
import { AppFooter } from "@components/footer/footer";
import { AppFootnote } from "@components/footnote/footnote";
import { AppNav } from "@components/nav/nav.component";
import CommentSection from "@components/comment/CommentSection";
import ImageFallback from "@components/shared/image-fallback";
import Share from "@components/shared/share";
import { BASE_URL_UPLOADS_MEDIA } from "@constants/api-url";
import { ITag } from "@domain/models/tag";
import { bannerAPI } from "@store/api/banner_api";
import { categoryAPI } from "@store/api/category_api";
import { postAPI } from "@store/api/post_api";
import { tagAPI } from "@store/api/tag_api";
import { userAPI } from "@store/api/user_api";
import { format } from "@utils/format";
import { postInteractionAPI } from "@store/api/post-interaction_api";
import slugify from "slugify";
import { useSession } from "next-auth/react";
import { Layout, Spin, Card, Row, Col, Typography, Avatar, Tag, Space, Divider, Button, App } from "antd";
import Link from "next/link";
import { FaRegClock, FaRegFolder, FaRegUserCircle, FaEye, FaHeart, FaShareAlt } from "react-icons/fa";
import { LikeOutlined, DislikeOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

interface BlogPostDetailPageComponentProps {
  slug: string;
}

export default function BlogPostDetailPageComponent({ slug }: BlogPostDetailPageComponentProps) {
  const { data: session } = useSession();
  const { message } = App.useApp();
  const {
    data: post,
    isLoading,
    isFetching,
  } = postAPI.useGetSinglePostBySlugQuery(slug);

  const {
    data: posts,
    isLoading: isLoadingPosts,
    isFetching: isFetchingPosts,
  } = postAPI.useFetchAllPostsQuery({
    searchTitle: "",
  });
  const {
    data: banners,
    isLoading: isLoadingBaner,
    isFetching: isFetchBaner,
  } = bannerAPI.useFetchAllBannersQuery(1);

  const {
    data: categories,
    isLoading: isLoadingCategory,
    isFetching: isFetchCategory,
  } = categoryAPI.useFetchAllCategoriesQuery(1);

  const { data: users } = userAPI.useFetchAllUsersQuery(1);

  const {
    data: user,
    isLoading: isLoadingUser,
    isFetching: isFetchUser,
  } = userAPI.useGetSingleUserQuery(post ? post.authorId : "");

  const {
    data: tags,
    isLoading: isLoadingTag,
    isFetching: isFetchingTag,
  } = tagAPI.useFetchAllTagsQuery(1);
  const similarPosts = post
    ? posts?.filter((p) => p.categoryId === post.categoryId)
    : [];

  const category = categories?.find((c) => c.id === post?.categoryId);

  // Redux Toolkit Query hooks for post interactions
  const {
    data: postStatsData,
    isLoading: loadingStats,
  } = postInteractionAPI.useGetPostStatsQuery(
    { postId: post?.id || '', userId: session?.user?.id },
    { skip: !post?.id }
  );

  // Provide default values for postStats
  const postStats = postStatsData || {
    likesCount: 0,
    dislikesCount: 0,
    userInteraction: null as 'like' | 'dislike' | null
  };

  const [handlePostInteraction] = postInteractionAPI.useHandlePostInteractionMutation();

  // Handle post like/dislike
  const handlePostLikeDislike = async (action: 'like' | 'dislike') => {
    if (!session?.user?.id) {
      message.error("Please log in to interact with posts");
      return;
    }

    if (!post?.id) return;

    try {
      await handlePostInteraction({ postId: post.id, action }).unwrap();
      message.success(`${action === 'like' ? 'Liked' : 'Disliked'} post successfully!`);
    } catch (error: any) {
      console.error("Error updating post interaction:", error);
      message.error(error?.data?.message || "Failed to update interaction");
    }
  };

  if (
    isLoadingCategory ||
    isFetchCategory ||
    isLoading ||
    isFetching ||
    isLoadingUser ||
    isFetchUser ||
    isFetchBaner ||
    isLoadingBaner ||
    isLoadingPosts ||
    isFetchingPosts ||
    isLoadingTag ||
    isFetchingTag
  ) {
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
  return (
    <>
      <div className="container-fluid" style={{ width: "100%" }}>
        {/* navigation bar */}
        <AppNav logoPath="/" />
        <PageContent
          title={post?.title}
          banner={banners ? (banners.length > 0 ? banners[0].image : "") : ""}
          breadcrumb={[
            {
              title: "Blog Posts",
              link: "/blog_posts",
            },
            {
              title: "Details",
            },
          ]}
        />
        <Content>
          <section className="section pt-4">
            <div className="container">
              <Row justify="center">
                <Col xs={24} lg={20}>
                  {post && (
                    <Card
                      style={{
                        borderRadius: "16px",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                        border: "none",
                        overflow: "hidden",
                      }}
                      styles={{ body: { padding: 0 } }}
                    >
                      {/* Hero Image */}
                      <div style={{ position: "relative", overflow: "hidden" }}>
                        <ImageFallback
                          src={`${BASE_URL_UPLOADS_MEDIA}/${post.imageUrl}`}
                          height={400}
                          width={1200}
                          alt={post?.title}
                          style={{
                            width: "100%",
                            height: "400px",
                            objectFit: "cover",
                            transition: "transform 0.3s ease",
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.3) 100%)",
                          }}
                        />
                      </div>

                      {/* Content */}
                      <div style={{ padding: "2rem" }}>
                        {/* Post Meta */}
                        <div style={{ marginBottom: "1.5rem" }}>
                          <Space wrap size="middle">
                            <Space>
                              <Avatar
                                src={user?.profileImage}
                                icon={<FaRegUserCircle />}
                                size="small"
                              />
                              <Link href={`/authors/${slugify(`${user?.username}`)}`}>
                                <Text strong style={{ color: "#1890ff" }}>
                                  {user?.username}
                                </Text>
                              </Link>
                            </Space>
                            
                            <Space>
                              <FaRegFolder style={{ color: "#52c41a" }} />
                              <Link href={`/categories/${category?.slug}`}>
                                <Text style={{ color: "#52c41a" }}>
                                  {category?.name}
                                </Text>
                              </Link>
                            </Space>
                            
                            <Space>
                              <FaRegClock style={{ color: "#faad14" }} />
                              <Text type="secondary">
                                {format.date(post.publishedAt)}
                              </Text>
                            </Space>
                          </Space>
                        </div>

                        {/* Title */}
                        <Title level={1} style={{ 
                          marginBottom: "1rem",
                          fontSize: "2.5rem",
                          fontWeight: "700",
                          lineHeight: "1.2",
                          color: "#1a1a1a"
                        }}>
                          {post?.title}
                        </Title>

                        {/* Description */}
                        {post?.description && (
                          <Paragraph
                            style={{
                              fontSize: "1.2rem",
                              color: "#666",
                              marginBottom: "2rem",
                              lineHeight: "1.6",
                            }}
                          >
                            {post.description}
                          </Paragraph>
                        )}

                        <Divider style={{ margin: "2rem 0" }} />

                        {/* Content */}
                        <div
                          style={{
                            fontSize: "1.1rem",
                            lineHeight: "1.8",
                            color: "#333",
                          }}
                          dangerouslySetInnerHTML={{
                            __html: post?.content as any,
                          }}
                        />

                        <Divider style={{ margin: "2rem 0" }} />

                        {/* Post Interactions */}
                        <div style={{ marginBottom: "2rem", padding: "1rem", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
                          <Row justify="space-between" align="middle">
                            <Col>
                              <Space size="large">
                                <Button
                                  type="text"
                                  icon={<LikeOutlined />}
                                  style={{ 
                                    color: postStats.userInteraction === 'like' ? "#1890ff" : "#666",
                                    backgroundColor: postStats.userInteraction === 'like' ? "#e6f7ff" : "transparent"
                                  }}
                                  onClick={() => handlePostLikeDislike('like')}
                                  disabled={!session?.user?.id}
                                >
                                  {postStats.likesCount} Likes
                                </Button>
                                <Button
                                  type="text"
                                  icon={<DislikeOutlined />}
                                  style={{ 
                                    color: postStats.userInteraction === 'dislike' ? "#ff4d4f" : "#666",
                                    backgroundColor: postStats.userInteraction === 'dislike' ? "#fff2f0" : "transparent"
                                  }}
                                  onClick={() => handlePostLikeDislike('dislike')}
                                  disabled={!session?.user?.id}
                                >
                                  {postStats.dislikesCount} Dislikes
                                </Button>
                              </Space>
                            </Col>
                            <Col>
                              <Text type="secondary" style={{ fontSize: "0.9rem" }}>
                                {postStats.likesCount + postStats.dislikesCount} total interactions
                              </Text>
                            </Col>
                          </Row>
                        </div>

                        {/* Tags */}
                        <div style={{ marginBottom: "2rem" }}>
                          <Space wrap>
                            {tags?.map((tag: ITag) => (
                              <Tag
                                key={tag.id}
                                style={{
                                  borderRadius: "20px",
                                  padding: "4px 12px",
                                  fontSize: "0.9rem",
                                  border: "1px solid #d9d9d9",
                                  background: "#fafafa",
                                }}
                              >
                                <Link
                                  href={`/tags/${slugify(tag.name)}`}
                                  style={{ color: "#1890ff" }}
                                >
                                  #{tag.name}
                                </Link>
                              </Tag>
                            ))}
                          </Space>
                        </div>

                        {/* Share Section */}
                        <Card
                          style={{
                            borderRadius: "12px",
                            background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                            border: "none",
                          }}
                          bodyStyle={{ padding: "1.5rem" }}
                        >
                          <Row align="middle" justify="space-between">
                            <Col>
                              <Space>
                                <FaShareAlt style={{ color: "#1890ff", fontSize: "1.2rem" }} />
                                <Text strong style={{ fontSize: "1.1rem" }}>
                                  Share this article
                                </Text>
                              </Space>
                            </Col>
                            <Col>
                              <Share
                                className="nav social-icons"
                                title={post?.title as any}
                                description={post?.description}
                                slug={post?.slug!}
                              />
                            </Col>
                          </Row>
                        </Card>
                      </div>
                    </Card>
                  )}

                  {/* Comments Section */}
                  {post && (
                    <div style={{ marginTop: "2rem" }}>
                      <CommentSection 
                        postId={post.id} 
                        postTitle={post.title}
                        postSlug={post.slug}
                      />
                    </div>
                  )}
                </Col>
              </Row>

              {/* Related Posts Section */}
              {similarPosts && similarPosts.length > 0 && (
                <section style={{ marginTop: "4rem" }}>
                  <Row justify="center">
                    <Col xs={24} lg={20}>
                      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                        <Title level={2} style={{ 
                          fontSize: "2rem",
                          fontWeight: "600",
                          color: "#1a1a1a",
                          marginBottom: "0.5rem"
                        }}>
                          Related Articles
                        </Title>
                        <Text type="secondary" style={{ fontSize: "1.1rem" }}>
                          Discover more insights and stories
                        </Text>
                      </div>
                      
                      <Row gutter={[24, 24]}>
                        {similarPosts?.map((post) => (
                          <Col xs={24} md={12} lg={8} key={post.slug}>
                            {/* <Card
                              hoverable
                              style={{
                                borderRadius: "12px",
                                boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                                border: "none",
                                height: "100%",
                                transition: "all 0.3s ease",
                              }}
                              bodyStyle={{ padding: "1.5rem" }}
                            > */}
                              <BlogPostItem
                                users={isFetchUser || isLoadingUser ? [] : users}
                                categories={
                                  isFetchCategory || isLoadingCategory ? [] : categories || []
                                }
                                post={post}
                              />
                            {/* </Card> */}
                          </Col>
                        ))}
                      </Row>
                    </Col>
                  </Row>
                </section>
              )}
            </div>
          </section>
        </Content>
      </div>
      <AppFooter logoPath="/" />
      <AppFootnote />
    </>
  );
}
