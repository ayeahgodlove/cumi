import { Card, Space, Typography } from "antd";
import React from "react";
import { IPost } from "@domain/models/post.model";
import { BASE_URL_UPLOADS_MEDIA } from "@constants/api-url";
import Link from "next/link";
import { ICategory } from "@domain/models/category";
import { IUser } from "@domain/models/user";
import { FaRegCircleUser } from "react-icons/fa6";
import { CiCalendarDate, CiFolderOn } from "react-icons/ci";
import { format } from "@utils/format";
import useWindowSize from "@hooks/windows-resize/window-resize.hook";
import Image from "next/image";

const { Meta } = Card;
const { Title } = Typography;

export interface PostItemProps {
  post: IPost;
  categories: ICategory[] | undefined;
  users: IUser[] | undefined;
}

const BlogPostItem = ({ post, users, categories }: PostItemProps) => {
  const categoryDescription = categories?.find((c) => c.id === post.categoryId);
  const userDescription = users?.find((c) => c.id === post.authorId);
  const { width } = useWindowSize();
  return (
    <Card
      hoverable
      style={{ width: "100%" }}
      styles={{ header: { overflow: "hidden" } }}
      key={post.id}
      className="bg-white border-0 shadow"
      cover={
        <Link href={`/blog_posts/${post.slug}`}>
          <Image
            alt={post.title}
            src={`${BASE_URL_UPLOADS_MEDIA}/${post.imageUrl}`}
            height={500}
            width={1200}
            quality={100}
            style={{
              height: 250,
              objectFit: "cover",
              width: "100%",
              borderTopLeftRadius: "10px",
              borderTopRightRadius: "10px",
            }}
          />
        </Link>
      }
    >
      <Meta
        title={
          <Link href={`/blog_posts/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <Title level={4} style={{ marginBottom: 10, textWrap: "wrap" }}>
              {post.title}
            </Title>
          </Link>
        }
        description={
          <div className="w-100">
            {width > 767 && (
              <Space style={{ marginBottom: 5, flexWrap: "wrap" }}>
                <Typography.Text className="text-secondary">
                  <FaRegCircleUser /> {userDescription?.username}
                </Typography.Text>
                <Typography.Text className="text-secondary">
                  <CiFolderOn /> {categoryDescription?.name}
                </Typography.Text>
                <Typography.Text className="text-secondary">
                  <CiCalendarDate /> {format.date(post?.publishedAt)}
                </Typography.Text>
              </Space>
            )}
            <Typography.Paragraph>{post.description}</Typography.Paragraph>
            {width < 767 && (
              <Space style={{ marginBottom: 5, flexWrap: "wrap" }}>
                <Typography.Text className="text-secondary">
                  <FaRegCircleUser /> {userDescription?.username}
                </Typography.Text>
                <Typography.Text className="text-secondary">
                  <CiCalendarDate /> {format.date(post?.publishedAt)}
                </Typography.Text>
              </Space>
            )}
          </div>
        }
      />
    </Card>
  );
};

export default BlogPostItem;
