import { Card, Divider, Typography } from "antd";
import { Link } from "react-router-dom";
import React from "react";
import { IPost } from "@models/post";

const { Meta } = Card;
const { Text } = Typography;

export interface PostItemProps {
  post: IPost;
}

const BlogPostItem = ({ post }: PostItemProps) => {
  return (
    <Link to={`/blog_posts/${post.id}`}>
      <Card
        hoverable
        style={{ width: "100%" }}
        cover={<img alt="example" src={post.imageUrl} />}
      >
        <Meta title={post.title} />
        <Divider />
        <Text type="secondary">{post.description.substring(0, 70)}</Text>
      </Card>
    </Link>
  );
};

export default BlogPostItem;
