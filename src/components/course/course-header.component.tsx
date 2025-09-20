import { ICourse } from "@domain/models/course";
import { Card, Row, Col, Typography, Tag, Space, Button, Image } from "antd";
import { useState } from "react";

const { Title, Text } = Typography;

const CourseHeader = ({ course }: { course: ICourse }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const maxDescriptionLength = 400;

  const shouldTruncateDescription =
    course.description && course.description.length > maxDescriptionLength;
  const displayDescription =
    shouldTruncateDescription && !showFullDescription
      ? course.description.substring(0, maxDescriptionLength) + "..."
      : course.description;

  return (
    <Card
      style={{
        marginBottom: 24,
        backgroundColor: "white",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        border: "none",
      }}
      styles={{ body: { padding: 0 } }}
    >
      <Row gutter={[0, 0]} style={{ minHeight: 200 }}>
        {/* Course Image Column */}
        {course.imageUrl && (
          <Col xs={24} sm={8}>
            <div
              style={{ height: "100%", minHeight: 200 }}
              className="course-image-container"
            >
              <Image
                src={course.imageUrl}
                alt={course.title}
                style={{
                  width: "100%",
                  height: "100%",
                  minHeight: 200,
                  objectFit: "cover",
                  display: "block",
                }}
                className="course-image"
                preview={true}
              />
            </div>
          </Col>
        )}

        {/* Content Column */}
        <Col xs={24} sm={course.imageUrl ? 16 : 24}>
          <div
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: 24,
              minHeight: 200,
            }}
          >
            <div>
              <Title level={2} style={{ margin: 0, marginBottom: 8 }}>
                {course.title}
              </Title>
              <Text type="secondary" style={{ fontSize: 16 }}>
                {displayDescription}
              </Text>
              {shouldTruncateDescription && (
                <div style={{ marginTop: 8 }}>
                  <Button
                    type="link"
                    size="small"
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    style={{ padding: 0, height: "auto" }}
                  >
                    {showFullDescription ? "Show less" : "Read more"}
                  </Button>
                </div>
              )}
            </div>
            <Space direction="horizontal" size="small">
              <Tag
                color={
                  course.status === "published"
                    ? "green"
                    : course.status === "draft"
                    ? "orange"
                    : course.status === "archived"
                    ? "gray"
                    : "default"
                }
              >
                {course.status?.toUpperCase()}
              </Tag>
              <Tag color="blue">{course.level?.toUpperCase()}</Tag>
            </Space>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default CourseHeader;
