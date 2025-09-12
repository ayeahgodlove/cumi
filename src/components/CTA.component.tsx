import { ArrowRightOutlined, MailOutlined } from "@ant-design/icons";
import { useTranslation } from "@contexts/translation.context";
import { Button, Card, Space, Typography } from "antd";
import React from "react";

const { Title, Paragraph } = Typography;

export const AppCTA = () => {
  const { t } = useTranslation();
  return (
    <div className="my-5">
      {/* CTA Section */}
      <Card className="cumi-card">
        <div className="text-center p-4">
          <Title level={3} className="mb-3">
            {t("projects.ready_to_start")}
          </Title>
          <Paragraph className="fs-6 mb-4">
            {t("projects.start_description")}
          </Paragraph>
          <Space size="large">
            <Button
              type="primary"
              size="large"
              className="cumi-button-primary"
              icon={<ArrowRightOutlined />}
              href="https://wa.me/237681289411"
              target="_blank"
            >
              {t("projects.start_project")}
            </Button>
            <Button
              size="large"
              className="cumi-gradient-border text-black"
              icon={<MailOutlined />}
              href="mailto:info@cumi.dev"
            >
              {t("projects.get_quote")}
            </Button>
          </Space>
        </div>
      </Card>
    </div>
  );
};
