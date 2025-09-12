"use client";
import { ICategory } from "@domain/models/category";
import { IPost } from "@domain/models/post.model";
import { ITag } from "@domain/models/tag";
import Link from "next/link";
import { usePathname } from "next/navigation";

const PostSidebar = ({
  tags,
  categories,
  posts,
}: {
  tags: ITag[] | undefined;
  categories: ICategory[] | undefined;
  posts: IPost[] | undefined;
}) => {
  const pathname = usePathname();
  const allCategories: string[] =
    posts && posts.length > 0 ? posts.map((p) => p.categoryId) : [];
  const allTags = posts && posts.length > 0 
    ? posts.flatMap((p) => p.tags || []) 
    : [];


  return (
    <>
      {/* <!-- categories --> */}
      <div className="mb-4">
        <h5 className="mb-3">Categories</h5>
        <div className="rounded bg-light p-5">
          <ul className="navbar-nav">
            {categories?.length ? (
              categories.map((category: ICategory) => {
                const count = allCategories && Array.isArray(allCategories)
                  ? allCategories.filter((c: string) => c === category.id).length
                  : 0;

                const isActive = pathname === `/categories/${category.slug}`;

                return (
                  <li key={category.id} className="d-block mb-2">
                    <Link
                      className="fs-6 d-flex justify-content-between"
                      href={`/categories/${category.slug}`}
                      style={{
                        color: isActive ? "#81ce89" : "none",
                      }}
                    >
                      <span>{category.name}</span> <span>({count})</span>
                    </Link>
                  </li>
                );
              })
            ) : (
              <></>
            )}
          </ul>
        </div>
      </div>
      {/* <!-- tags --> */}
      <div className="mb-4">
        <h5 className="mb-3">Tags</h5>
        <div className="rounded bg-light p-4 px-5">
          <ul className="nav justify-content-start">
            {tags?.length ? (
              tags.map((tag: ITag) => {
                const count = allTags && Array.isArray(allTags) 
                  ? allTags.filter((t: any) => t.id === tag.id).length 
                  : 0;

                const isActive = pathname === `/tags/${tag.slug}`;
                return (
                  <li className="inline-block" key={tag.id}>
                    <Link
                      className={`fs-6 m-1 d-block rounded bg-white px-2 py-1`}
                      href={`/tags/${tag.slug}`}
                      style={{
                        color: isActive ? "#81ce89" : "none",
                      }}
                    >
                      <span>{tag.name}</span> <span>({count})</span>
                    </Link>
                  </li>
                );
              })
            ) : (
              <></>
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

export default PostSidebar;
