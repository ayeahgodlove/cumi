"use client";
import PageContent from "@components/shared/page-content/index";
import BlogPostItem from "@components/blog_post/blog_post_item";
import { AppFooter } from "@components/footer/footer";
import { AppFootnote } from "@components/footnote/footnote";
import { AppNav } from "@components/nav/nav.component";
import Disqus from "@components/shared/disqus";
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
import { Col, Layout, Spin } from "antd";
import Link from "next/link";
import { Suspense } from "react";
import { FaRegClock, FaRegFolder, FaRegUserCircle } from "react-icons/fa";
import slugify from "slugify";

const { Content } = Layout;
export default function IndexPage({ params }: { params: { slug: string } }) {
  const {
    data: post,
    isLoading,
    isFetching,
  } = postAPI.useGetSinglePostBySlugQuery(params.slug);

  const { data: posts } = postAPI.useFetchAllPostsQuery({
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

  const { data: tags } = tagAPI.useFetchAllTagsQuery(1);
  const similarPosts = post
    ? posts?.filter((p) => p.categoryId === post.categoryId)
    : [];

  const category = categories?.find((c) => c.id === post?.categoryId);

  if (isLoading || isFetching) {
    <Spin size="large" style={{ height: "65vh", width: "100%" }} />;
  }
  return (
    <Suspense fallback={<Spin size="large" />}>
      <div className="container-fluid mt-3" style={{ width: "100%" }}>
        {/* navigation bar */}
        <AppNav logoPath="/../" />
        <PageContent
          title={post?.title}
          banner={banners ? (banners.length > 0 ? banners[0].image : "") : []}
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
              <div className="row justify-content-center">
                <article className="col-lg-10">
                  {post && (
                    <div className="mb-3">
                      <ImageFallback
                        src={`${BASE_URL_UPLOADS_MEDIA}/${post.imageUrl}`}
                        height={500}
                        width={1200}
                        alt={post?.title}
                        className="w-full rounded"
                      />
                    </div>
                  )}
                  {/* <h1 className="mb-2">{post?.title}</h1> */}
                  <ul className="nav mb-2">
                    <li className="me-3 inline-block">
                      <Link href={`/authors/${slugify(`${user?.username}`)}`}>
                        <FaRegUserCircle
                          className={"-mt-n1 me-2 inline-block"}
                        />
                        {user?.username}
                      </Link>
                    </li>
                    <li className="me-3 inline-block">
                      <FaRegFolder className={"-mt-n1 me-2 inline-block"} />
                      <Link href={`/categories/${category?.slug}`}>
                        {category?.name}
                      </Link>
                    </li>
                    {post && (
                      <li className="me-3 inline-block">
                        <FaRegClock className="-mt-n1 me-2 inline-block" />
                        {format.date(post.publishedAt)}
                      </li>
                    )}
                  </ul>
                  <div className="content mb-3">
                    <div
                      style={{ padding: 30, background: "#f2f2f2" }}
                      dangerouslySetInnerHTML={{
                        __html: post?.content as any,
                      }}
                    />
                  </div>
                  <div className="row justify-items-start justify-content-between">
                    <div className="mb-5 flex justify-items-center col-lg-5 mb-lg-0">
                      <h5 className="me-3">Tags :</h5>
                      <ul className="nav">
                        {tags?.map((tag: ITag) => (
                          <li key={tag.id} className="inline-block">
                            <Link
                              className="m-1 block rounded bg-light px-3 py-1"
                              href={`/tags/${slugify(tag.name)}`}
                            >
                              {tag.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex justify-items-center col-lg-4">
                      <h5 className="mr-1">Share :</h5>
                      <Share
                        className="nav social-icons"
                        title={post?.title as any}
                        description={post?.description}
                        slug={post?.slug!}
                      />
                    </div>
                  </div>
                  <Disqus className="mt-20" />
                </article>
              </div>

              {/* <!-- Related posts --> */}
              <div className="section pb-0">
                <h2 className="h3 mb-5 text-center">Related Posts</h2>
                <div className="row justify-content-center">
                  {similarPosts?.map((post) => (
                    <div key={post.slug} className="col-lg-4 mb-3">
                      <BlogPostItem
                        users={isFetchUser || isLoadingUser ? [] : users}
                        categories={
                          isFetchCategory || isLoadingCategory ? [] : categories
                        }
                        post={post}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </Content>
      </div>
      <AppFooter logoPath="/../" />
      <AppFootnote />
    </Suspense>
  );
}
