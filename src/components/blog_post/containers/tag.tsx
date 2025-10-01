import { IPost } from "@domain/models/post.model";
import { ITag } from "@domain/models/tag";
import Link from "next/link";
import React from "react";

interface IProps {
  posts: IPost[] | undefined;
  tags: ITag[] | undefined;
}
const TagContainer: React.FC<IProps> = ({ posts, tags }) => {
  // Flatten all tags from all posts to count occurrences
  const allTags = React.useMemo(() => {
    if (!posts || posts.length === 0) return [];
    
    // Collect all tags from all posts
    return posts.flatMap((post) => {
      if (Array.isArray(post.Tags)) {
        return post.Tags;
      } else if (Array.isArray(post.tags)) {
        return post.tags;
      }
      return [];
    });
  }, [posts]);

  return (
    <div className="d-flex justify-content-center align-items-center p-5">
      <ul className="nav justify-content-start">
        {tags?.length ? (
          tags.map((tag: ITag) => {
            // Count how many posts have this tag
            const count = posts?.filter((post) => {
              const postTags = post.Tags || post.tags || [];
              if (typeof postTags === 'string') {
                // If tags is a JSON string array
                try {
                  const parsedTags = JSON.parse(postTags);
                  return parsedTags.includes(tag.id);
                } catch {
                  return false;
                }
              }
              // If tags is an array of tag objects or IDs
              return postTags.some((t: any) => 
                (typeof t === 'string' ? t === tag.id : t.id === tag.id)
              );
            }).length || 0;

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
