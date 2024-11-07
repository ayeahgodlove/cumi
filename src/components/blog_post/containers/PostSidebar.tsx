import { ICategory } from "@domain/models/category";
import { ITag } from "@domain/models/tag";
import Link from "next/link";
// import "./post-sidebar.scss";

const PostSidebar = ({
  tags,
  categories,
  allCategories,
}: {
  tags: ITag[] | undefined;
  categories: ICategory[] | undefined;
  allCategories: string[];
}) => {
  return (
    <>
      {/* <!-- categories --> */}
      <div className="mb-4">
        <h5 className="mb-3">Categories</h5>
        <div className="rounded bg-light p-5">
          <ul className="navbar-nav">
            {categories?.length ? (
              categories.map((category: ICategory) => {
                const count = allCategories.filter(
                  (c: string) => c === category.id
                ).length;
                return (
                  <li key={category.id} className="d-block mb-2">
                    <Link
                      className="flex justify-content-between"
                      href={`/categories/${category.slug}`}
                    >
                      {category.name} <span>({count})</span>
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
        <div className="rounded bg-light p-4">
          <ul className="nav justify-content-start">
            {tags?.length ? (
              tags.map((tag: ITag) => {
                return (
                  <li className="inline-block" key={tag.id}>
                    <Link
                      className="m-1 d-block rounded bg-white px-3 py-1"
                      href={`/tags/${tag.slug}`}
                    >
                      {tag.name}
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
