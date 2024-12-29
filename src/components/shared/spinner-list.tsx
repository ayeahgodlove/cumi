import React from "react";
import { Card, Col, Row, Skeleton, Space } from "antd";

const SpinnerList = () => {
  return (
    <>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((value) => (
          <Col className="gutter-row" span={8} key={value}>
            <Card style={{ width: "100%", marginBottom: 20 }}>
              <Space direction="vertical" align="center" size="large">
                <Skeleton.Image active />
              </Space>
              <Skeleton active />
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default SpinnerList;
