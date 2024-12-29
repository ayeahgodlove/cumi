"use client";
import { AppNav } from "@components/nav/nav.component";
import SpinnerList from "@components/shared/spinner-list";
import { Button, Col, Divider, Empty, Layout, Row, Spin } from "antd";
import { Suspense, useState, useTransition } from "react";
import { motion } from "framer-motion";
import { postAPI } from "@store/api/post_api";
import { SortPostsType } from "@domain/models/shared/sort.model";
import BlogPostItem from "@components/blog_post/blog_post_item";
import SearchPosts from "@components/blog_post/containers/SearchPosts";
import SortPosts from "@components/blog_post/containers/SortPosts";
import BannerComponent from "@components/banner/banner.component";
import { AppFooter } from "@components/footer/footer";
import { AppFootnote } from "@components/footnote/footnote";
import PostSidebar from "@components/blog_post/containers/PostSidebar";
import { categoryAPI } from "@store/api/category_api";
import { tagAPI } from "@store/api/tag_api";
import { userAPI } from "@store/api/user_api";

const { Content } = Layout;
export default function IndexPage() {
  const [searchTitle, setSearchTitle] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<SortPostsType>();
  const [isPending, startTransition] = useTransition();
  const [openFilter, setOpenFilter] = useState<boolean>(false);

  const {
    data: posts,
    error,
    isLoading,
    isFetching,
  } = postAPI.useFetchAllPostsQuery({
    searchTitle: searchTitle,
    sortBy: sortOrder,
  });

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

  const onChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    startTransition(() => {
      // Mark updates as transitions
      setSearchTitle(event.target.value);
    });
  };

  const handleSortOrderChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSortOrder(event.target.value as SortPostsType);
  };

  return (
    <Suspense fallback={<Spin size="large" />}>
      <div className="container-fluid mt-3" style={{ width: "100%" }}>
        {/* navigation bar */}
        <AppNav logoPath="/" />
      </div>

      {/* banner */}
      <BannerComponent
        breadcrumbs={[{ label: "Blog Posts", uri: "blog_posts" }]}
        pageTitle="Blog Posts"
      />

      <div className="container mb-5">
        <Row justify="space-between">
          <Col span={12} style={{ alignSelf: "center" }}>
            <SortPosts
              sortOrderValue={sortOrder}
              sortOrderChange={handleSortOrderChange}
            />
          </Col>
          <Col span={12} style={{ textAlign: "right" }}>
            <SearchPosts search={onChangeSearch} />
          </Col>
        </Row>
        <Divider />

        {error && <h1>Something wrong...</h1>}

        <Content>
          {(isLoading || isFetching) && (
            <motion.div
              className="box"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <SpinnerList />
            </motion.div>
          )}
          {posts && posts.length ? (
            <div className="row justify-content-center align-items-start">
              <div className="col-12 col-md-8">
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                  {posts?.map((post) => (
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
                        initial={{ opacity: 0, y: "-5%" }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <BlogPostItem
                          users={isFetchUser || isLoadingUser ? [] : users}
                          categories={
                            isFetchCategory || isLoadingCategory
                              ? []
                              : categories
                          }
                          post={post}
                        />
                      </motion.div>
                    </Col>
                  ))}
                </Row>
              </div>
              <div className="col-12 col-md-4">
                <PostSidebar
                  posts={isLoading || isFetching ? [] : posts}
                  tags={isFetchTag || isLoadingTag ? [] : tags}
                  // allCategories={isFetchCategory || isLoadingCategory ? [] : posts.map(p => p.categoryId)}
                  categories={
                    isFetchCategory || isLoadingCategory ? [] : categories
                  }
                />
              </div>
            </div>
          ) : (
            <Col span={24}>
              <div className="empty-wrap">
                <Empty />
              </div>
            </Col>
          )}
        </Content>
      </div>

      <AppFooter logoPath="/" />
      <AppFootnote />
    </Suspense>
  );
}
