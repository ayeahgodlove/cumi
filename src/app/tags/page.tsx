"use client";
import BannerComponent from "@components/banner/banner.component";
import TagContainer from "@components/blog_post/containers/tag";
import { AppFooter } from "@components/footer/footer";
import { AppFootnote } from "@components/footnote/footnote";
import { AppNav } from "@components/nav/nav.component";
import { categoryAPI } from "@store/api/category_api";
import { postAPI } from "@store/api/post_api";
import { tagAPI } from "@store/api/tag_api";
import { Suspense } from "react";

export default function IndexPage() {
  const {
    data: posts,
    error,
    isLoading,
    isFetching,
  } = postAPI.useFetchAllPostsQuery(1);

  const {
    data: tags,
    isLoading: isLoadingTag,
    isFetching: isFetchTag,
  } = tagAPI.useFetchAllTagsQuery(1);

  return (
    <Suspense>
      <div className="container-fluid mt-3" style={{ width: "100%" }}>
        {/* navigation bar */}
        <AppNav logoPath="/" />
      </div>
      {/* banner */}
      <BannerComponent
        breadcrumbs={[{ label: "Tags", uri: "tags" }]}
        pageTitle="Tags"
      />

      <TagContainer
        posts={isLoading || isFetching ? [] : posts}
        tags={isLoadingTag || isFetchTag ? [] : tags}
      />

      <AppFooter logoPath="/" />
      <AppFootnote />
    </Suspense>
  );
}
