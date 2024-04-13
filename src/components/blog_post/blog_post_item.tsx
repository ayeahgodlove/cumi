import { Card, Divider, Typography } from "antd";
import React from "react";
import { IPost } from "@models/post";
import { API_URL_UPLOADS_POSTS } from "@constants/api-url";
import Link from "next/link";

const { Meta } = Card;
const { Title } = Typography;

export interface PostItemProps {
  post: IPost;
}

const BlogPostItem = ({ post }: PostItemProps) => {
  return (
    <Link href={`/blog_posts/${post.slug}`}>
      <Card
        hoverable
        style={{ width: "100%" }}
        key={post.id}
        cover={
          <img
            alt={post.title}
            src={`${API_URL_UPLOADS_POSTS}/${post.imageUrl}`}
          />
        }
      >
        <Meta
          title={<Title level={4} style={{ marginBottom: 10}}>{post.title}</Title>}
          description={post.description}
        />
      </Card>
    </Link>
  );
};

export default BlogPostItem;
