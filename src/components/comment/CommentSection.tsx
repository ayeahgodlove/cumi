"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  List,
  Avatar,
  Button,
  Input,
  Form,
  App,
  Space,
  Typography,
  Divider,
  Spin,
  Empty,
  Dropdown,
  Modal,
} from "antd";
import {
  MessageOutlined,
  SendOutlined,
  UserOutlined,
  LikeOutlined,
  DislikeOutlined,
  ShareAltOutlined,
  FacebookOutlined,
  TwitterOutlined,
  LinkedinOutlined,
  CopyOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import { useSession } from "next-auth/react";
import { formatDistanceToNow } from "date-fns";
import { commentAPI } from "@store/api/comment_api";
import { commentInteractionAPI } from "@store/api/comment-interaction_api";
import { IComment } from "@domain/models/comment.model";

interface CommentWithStats extends IComment {
  likesCount?: number;
  dislikesCount?: number;
  userInteraction?: 'like' | 'dislike' | null;
}

const { TextArea } = Input;
const { Text, Title } = Typography;

interface CommentSectionProps {
  postId: string;
  postTitle?: string;
  postSlug?: string;
}

export default function CommentSection({ postId, postTitle, postSlug }: CommentSectionProps) {
  const { data: session } = useSession();
  const { message } = App.useApp();
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [form] = Form.useForm();

  // Redux Toolkit Query hooks
  const {
    data: commentsData,
    isLoading: loading,
    refetch: refetchComments,
  } = commentAPI.useGetCommentsByPostIdQuery(postId);

  const [createComment, { isLoading: submitting }] = commentAPI.useCreateCommentMutation();
  const [handleCommentInteraction] = commentInteractionAPI.useHandleCommentInteractionMutation();

  // Get current URL for sharing
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = postTitle || 'Check out this post';
  const shareText = `Read "${postTitle}" on CUMI`;

  // Share functions
  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareToLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      message.success('Link copied to clipboard!');
    } catch (err) {
      message.error('Failed to copy link');
    }
  };

  const shareMenuItems = [
    {
      key: 'facebook',
      label: 'Share on Facebook',
      icon: <FacebookOutlined style={{ color: '#1877F2' }} />,
      onClick: shareToFacebook,
    },
    {
      key: 'twitter',
      label: 'Share on Twitter',
      icon: <TwitterOutlined style={{ color: '#1DA1F2' }} />,
      onClick: shareToTwitter,
    },
    {
      key: 'linkedin',
      label: 'Share on LinkedIn',
      icon: <LinkedinOutlined style={{ color: '#0077B5' }} />,
      onClick: shareToLinkedIn,
    },
    {
      key: 'copy',
      label: 'Copy Link',
      icon: <CopyOutlined />,
      onClick: copyToClipboard,
    },
  ];

  // Process comments with stats
  const comments: CommentWithStats[] = React.useMemo(() => {
    if (!commentsData) return [];
    return commentsData.map((comment: IComment) => ({
      ...comment,
      likesCount: 0,
      dislikesCount: 0,
      userInteraction: null,
    }));
  }, [commentsData]);

  // Handle like/dislike
  const handleLikeDislike = async (commentId: string, action: 'like' | 'dislike') => {
    if (!session?.user?.id) {
      message.error("Please log in to interact with comments");
      return;
    }

    try {
      await handleCommentInteraction({ commentId, action }).unwrap();
      message.success(`Comment ${action}d successfully!`);
    } catch (error: any) {
      console.error("Error updating interaction:", error);
      message.error(error?.data?.message || "Failed to update interaction");
    }
  };


  // Submit comment or reply
  const handleSubmit = async (values: { content: string }) => {
    if (!session?.user?.id) {
      message.error("Please log in to comment");
      return;
    }

    const isReply = replyingTo !== null;
    const parentId = isReply ? replyingTo : undefined;

    try {
      await createComment({
        content: values.content,
        postId: postId,
        parentId: parentId,
      }).unwrap();
      
      message.success(`${isReply ? 'Reply' : 'Comment'} posted successfully!`);
      form.resetFields();
      setReplyingTo(null);
    } catch (error: any) {
      console.error(`Error posting ${isReply ? 'reply' : 'comment'}:`, error);
      
      if (error?.data?.message?.includes("not available yet")) {
        message.warning("Comments feature is coming soon! Please check back later.");
      } else {
        message.error(error?.data?.message || `Failed to post ${isReply ? 'reply' : 'comment'}`);
      }
    }
  };

  // Render comment item
  const renderComment = (comment: CommentWithStats) => (
    <List.Item
      key={comment.id}
      style={{ 
        padding: "16px 0", 
        borderBottom: "1px solid #f0f0f0",
        opacity: comment.id.startsWith('temp-') ? 0.7 : 1,
        backgroundColor: comment.id.startsWith('temp-') ? '#f9f9f9' : 'transparent'
      }}
    >
      <List.Item.Meta
        avatar={
          <Avatar
            src={comment.user?.image}
            icon={<UserOutlined />}
            size="small"
          />
        }
        title={
          <Space>
            <Text strong>{comment.user?.name || 'Anonymous'}</Text>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
            </Text>
          </Space>
        }
        description={
          <div>
            <Text>{comment.content}</Text>
            {comment.id.startsWith('temp-') && (
              <Text type="secondary" style={{ fontSize: '12px', fontStyle: 'italic' }}>
                Posting...
              </Text>
            )}
            <div style={{ marginTop: "8px" }}>
              <Space size="small">
                <Button
                  type="text"
                  size="small"
                  icon={<LikeOutlined />}
                  style={{ 
                    color: comment.userInteraction === 'like' ? "#1890ff" : "#666",
                    backgroundColor: comment.userInteraction === 'like' ? "#e6f7ff" : "transparent"
                  }}
                  onClick={() => handleLikeDislike(comment.id, 'like')}
                  disabled={!session?.user?.id}
                >
                  {comment.likesCount || 0}
                </Button>
                <Button
                  type="text"
                  size="small"
                  icon={<DislikeOutlined />}
                  style={{ 
                    color: comment.userInteraction === 'dislike' ? "#ff4d4f" : "#666",
                    backgroundColor: comment.userInteraction === 'dislike' ? "#fff2f0" : "transparent"
                  }}
                  onClick={() => handleLikeDislike(comment.id, 'dislike')}
                  disabled={!session?.user?.id}
                >
                  {comment.dislikesCount || 0}
                </Button>
                <Button
                  type="text"
                  size="small"
                  icon={<MessageOutlined />}
                  style={{ color: "#666" }}
                  onClick={() => setReplyingTo(comment.id)}
                  disabled={!session?.user?.id}
                >
                  Reply
                </Button>
              </Space>
            </div>
          </div>
        }
      />
      
      {/* Render replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div style={{ marginLeft: "20px", marginTop: "12px", paddingLeft: "20px", borderLeft: "2px solid #f0f0f0" }}>
          {comment.replies.map((reply) => renderComment(reply))}
        </div>
      )}
      
    </List.Item>
  );

  return (
    <Card
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space>
            <MessageOutlined />
            <span>Comments ({comments.length})</span>
          </Space>
          <Dropdown
            menu={{ items: shareMenuItems }}
            trigger={['click']}
            placement="bottomRight"
          >
            <Button 
              type="text" 
              icon={<ShareAltOutlined />}
              style={{ color: '#1890ff' }}
            >
              Share Post
            </Button>
          </Dropdown>
        </div>
      }
      style={{ marginTop: "24px" }}
    >
      {/* Comment Form */}
      {session?.user && (
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          {replyingTo && (
            <div style={{ marginBottom: "16px", padding: "8px", backgroundColor: "#f0f8ff", borderRadius: "4px", border: "1px solid #d6e4ff" }}>
              <Text type="secondary" style={{ fontSize: "12px" }}>
                Replying to comment
              </Text>
              <Button 
                type="link" 
                size="small" 
                onClick={() => setReplyingTo(null)}
                style={{ padding: 0, height: "auto" }}
              >
                Cancel
              </Button>
            </div>
          )}
          <Form.Item
            name="content"
            rules={[
              { required: true, message: "Please enter your comment" },
              { max: 1000, message: "Comment cannot exceed 1000 characters" },
            ]}
          >
            <TextArea
              rows={4}
              placeholder={replyingTo ? "Write your reply..." : "Share your thoughts..."}
              maxLength={1000}
              showCount
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={submitting}
              icon={<SendOutlined />}
            >
              {replyingTo ? "Post Reply" : "Post Comment"}
            </Button>
          </Form.Item>
        </Form>
      )}

      {!session?.user && (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <Text type="secondary">
            Please{" "}
            <Button type="link" href="/login" style={{ padding: 0 }}>
              log in
            </Button>{" "}
            to post comments
          </Text>
        </div>
      )}

      <Divider />

      {/* Comments List */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <Spin size="large" />
        </div>
      ) : comments.length === 0 ? (
        <Empty
          description="No comments yet. Be the first to comment!"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <List
          dataSource={comments}
          renderItem={renderComment}
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
            showQuickJumper: false,
            showTotal: (total) => `Total ${total} comments`,
          }}
        />
      )}

      {/* Share Modal */}
      <Modal
        title="Share this post"
        open={shareModalVisible}
        onCancel={() => setShareModalVisible(false)}
        footer={null}
        width={400}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <Text strong>{shareTitle}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {currentUrl}
            </Text>
          </div>
          
          <Space wrap style={{ justifyContent: 'center' }}>
            <Button 
              icon={<FacebookOutlined />} 
              onClick={shareToFacebook}
              style={{ color: '#1877F2', borderColor: '#1877F2' }}
            >
              Facebook
            </Button>
            <Button 
              icon={<TwitterOutlined />} 
              onClick={shareToTwitter}
              style={{ color: '#1DA1F2', borderColor: '#1DA1F2' }}
            >
              Twitter
            </Button>
            <Button 
              icon={<LinkedinOutlined />} 
              onClick={shareToLinkedIn}
              style={{ color: '#0077B5', borderColor: '#0077B5' }}
            >
              LinkedIn
            </Button>
            <Button 
              icon={<CopyOutlined />} 
              onClick={copyToClipboard}
            >
              Copy Link
            </Button>
          </Space>
        </Space>
      </Modal>
    </Card>
  );
}
