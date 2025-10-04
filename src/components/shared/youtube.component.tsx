import React from 'react';
import { Card, Row, Col, Button, Space } from 'antd';
import { PlayCircleOutlined, LikeOutlined, ShareAltOutlined, MoreOutlined } from '@ant-design/icons';

interface YouTubePlayerProps {
  videoId: string;
  title?: string;
  channel?: string;
  views?: string;
  uploadDate?: string;
  description?: string;
  showControls?: boolean;
}

const YouTubePlayerFrame: React.FC<YouTubePlayerProps> = ({
  videoId,
  title = 'Video Title',
  channel = 'Channel Name',
  views = '1M views',
  uploadDate = '1 month ago',
  description = 'Video description goes here...',
  showControls = true,
}) => {
  const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;

return (
    <div className="container py-4">
      <Card className="shadow-sm border-0">
        {}
        <div className="ratio ratio-16x9 mb-3">
          <iframe
            src={embedUrl}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-top"
          ></iframe>
        </div>

{}
        <div className="px-3">
          <h4 className="fw-bold mb-2">{title}</h4>

<Row gutter={16} align="middle" className="mb-3">
            <Col xs={24} md={12}>
              <Space size="middle">
                <span className="text-muted">{channel}</span>
                <Button type="primary" size="small" className="rounded-pill">
                  Subscribe
                </Button>
              </Space>
            </Col>
            <Col xs={24} md={12} className="text-md-end mt-2 mt-md-0">
              <Space>
                <Button icon={<LikeOutlined />} size="middle">
                  Like
                </Button>
                <Button icon={<ShareAltOutlined />} size="middle">
                  Share
                </Button>
                <Button icon={<MoreOutlined />} size="middle" />
              </Space>
            </Col>
          </Row>

{}
          <div className="bg-light p-3 rounded mb-3">
            <Space size="large">
              <span className="text-muted">{views}</span>
              <span className="text-muted">{uploadDate}</span>
            </Space>
            <p className="mt-2 mb-0">{description}</p>
          </div>

{}
          {showControls && (
            <div className="d-flex justify-content-between align-items-center mt-3">
              <Button type="text" icon={<PlayCircleOutlined />}>
                Watch Later
              </Button>
              <Button type="text">Add to playlist</Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default YouTubePlayerFrame;
