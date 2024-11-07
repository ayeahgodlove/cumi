import { IPost } from "@domain/models/post.model";
import { ITag } from "@domain/models/tag";
import Link from "next/link";
import React from "react";

interface IProps {
  posts: IPost[] | undefined;
  tags: ITag[] | undefined;
}
const TagContainer: React.FC<IProps> = ({ posts, tags }) => {
  const [allTags] = posts && posts.length > 0 ? posts.map((p) => p.Tags) : [];
  return (
    <div className="d-flex justify-content-center align-items-center p-5">
      <ul className="nav justify-content-start">
        {tags?.length ? (
          tags.map((tag: ITag) => {
            const count = allTags.filter((t: any) => t.id === tag.id).length;
            return (
              <li className="inline-block" key={tag.id}>
                <Link
                  className={`m-1 d-block rounded bg-light py-3 px-5`}
                  href={`/tags/${tag.slug}`}
                >
                  <span className="fs-5">{tag.name}</span>{" "}
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

export default TagContainer;
