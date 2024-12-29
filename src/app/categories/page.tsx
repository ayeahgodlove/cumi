"use client";
import BannerComponent from "@components/banner/banner.component";
import CategoryContainer from "@components/blog_post/containers/category";
import { AppFooter } from "@components/footer/footer";
import { AppFootnote } from "@components/footnote/footnote";
import { AppNav } from "@components/nav/nav.component";
import { categoryAPI } from "@store/api/category_api";
import { postAPI } from "@store/api/post_api";
import { Suspense } from "react";

export default function IndexPage() {
  const {
    data: posts,
    isLoading,
    isFetching,
  } = postAPI.useFetchAllPostsQuery(1);

  const {
    data: categories,
    isLoading: isLoadingCategory,
    isFetching: isFetchCategory,
  } = categoryAPI.useFetchAllCategoriesQuery(1);
  return (
    <Suspense>
      <div className="container-fluid mt-3" style={{ width: "100%" }}>
        {/* navigation bar */}
        <AppNav logoPath="/" />
      </div>
      {/* banner */}
      <BannerComponent
        breadcrumbs={[{ label: "Categories", uri: "categories" }]}
        pageTitle="Categories"
      />

      <CategoryContainer
        posts={isLoading || isFetching ? [] : posts}
        categories={isLoadingCategory || isFetchCategory ? [] : categories}
      />

      <AppFooter logoPath="/" />
      <AppFootnote />
    </Suspense>
  );
}
