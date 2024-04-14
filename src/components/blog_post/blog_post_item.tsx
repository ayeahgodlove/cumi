import { Card, Space, Typography } from "antd";
import React from "react";
import { IPost } from "@models/post";
import { API_URL_UPLOADS_POSTS } from "@constants/api-url";
import Link from "next/link";
import { ICategory } from "@models/category.model";
import { IUser } from "@models/user.model";
import { FaRegCircleUser } from "react-icons/fa6";
import { CiCalendarDate, CiFolderOn } from "react-icons/ci";
import { format } from "@utils/format";

const { Meta } = Card;
const { Title } = Typography;

export interface PostItemProps {
  post: IPost;
  categories: ICategory[]| undefined;
  users: IUser[]| undefined;
}

const BlogPostItem = ({ post, users, categories }: PostItemProps) => {
  const categoryDescription = categories?.find((c) => c.id === post.categoryId);
  const userDescription = users?.find((c) => c.id === post.authorId);
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
            style={{
              height: 250,
              objectFit: "cover",
              width: "100%",
            }}
          />
        }
      >
        <Meta
          title={
            <Title level={4} style={{ marginBottom: 10, textWrap: "wrap" }}>
              {post.title}
            </Title>
          }
          description={
            <div className="w-100">
              <Space style={{ marginBottom: 5 }}>
                <Typography.Link className="text-secondary">
                <FaRegCircleUser /> {userDescription?.username}
                </Typography.Link>
                <Typography.Link className="text-secondary">
                <CiFolderOn /> {categoryDescription?.name}
                </Typography.Link>
                <Typography.Text className="text-secondary">
                <CiCalendarDate /> {format.date(post?.publishedAt)}
                </Typography.Text>
              </Space>
              <Typography.Paragraph>{post.description}</Typography.Paragraph>
            </div>
          }
        />
      </Card>
    </Link>
  );
};

export default BlogPostItem;
