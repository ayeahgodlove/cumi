import { ICategory } from "@domain/models/category";
import { IPost } from "@domain/models/post.model";
import Link from "next/link";
import React from "react";

interface IProps {
  categories: ICategory[] | undefined;
  posts: IPost[] | undefined;
}
const CategoryContainer: React.FC<IProps> = ({ categories, posts }) => {
  const allCategories: string[] =
    posts && posts.length > 0 ? posts.map((p) => p.categoryId) : [];
  return (
    <div className="d-flex justify-content-center align-items-center p-5">
      <ul className="nav justify-content-center">
        {categories?.length ? (
          categories.map((category: ICategory) => {
            const count = allCategories.filter(
              (c: string) => c === category.id
            ).length;

return (
              <li key={category.id} className="inline-block">
                <Link
                  className={`m-1 d-block rounded bg-light py-3 px-5`}
                  href={`/categories/${category.slug}`}
                >
                  <span className="fs-5">{category.name}</span>{" "}
                  <span className="px-2 fw-medium rounded-circle bg-success">
                    {count}
                  </span>
                </Link>
              </li>
            );
          })
        ) : (
          <></>
        )}
      </ul>
    </div>
  );
};

export default CategoryContainer;
