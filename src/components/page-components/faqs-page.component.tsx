"use client";

import { AppNav } from "@components/nav/nav.component";
import { AppFooter } from "@components/footer/footer";
import { AppFootnote } from "@components/footnote/footnote";
import { Layout, Card, Typography, Row, Col, Collapse } from "antd";
import { motion } from "framer-motion";
import { useTranslation } from "@contexts/translation.context";

const { Content } = Layout;
const { Title, Paragraph } = Typography;
const { Panel } = Collapse;

export default function FAQsPageComponent() {
  const { t } = useTranslation();
  
  const faqs = [
    {
      question: t('faq.services.question'),
      answer: t('faq.services.answer')
    },
    {
      question: t('faq.timeline.question'),
      answer: t('faq.timeline.answer')
    },
    {
      question: t('faq.support.question'),
      answer: t('faq.support.answer')
    },
    {
      question: t('faq.technologies.question'),
      answer: t('faq.technologies.answer')
    },
    {
      question: t('faq.existing_projects.question'),
      answer: t('faq.existing_projects.answer')
    },
    {
      question: t('faq.pricing.question'),
      answer: t('faq.pricing.answer')
    },
    {
      question: t('faq.startups.question'),
      answer: t('faq.startups.answer')
    },
    {
      question: t('faq.quality.question'),
      answer: t('faq.quality.answer')
    },
    {
      question: t('faq.marketing.question'),
      answer: t('faq.marketing.answer')
    },
    {
      question: t('faq.difference.question'),
      answer: t('faq.difference.answer')
    }
  ];

  return (
    <>
      <div className="container-fluid" style={{ width: "100%" }}>
        <AppNav logoPath="/" />
      </div>

      <Content style={{ minHeight: "65vh" }}>
        <div className="container py-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Header Section */}
            <div className="text-center mb-5">
              <Title level={1} className="cumi-gradient-text mb-3">
                {t('faq.title')}
              </Title>
              <Paragraph className="fs-5 text-muted">
                {t('faq.subtitle')}
              </Paragraph>
            </div>

            {/* FAQs Section */}
            <Row justify="center">
              <Col xs={24} lg={18}>
                <Card className="cumi-card" style={{ backgroundColor: 'white' }}>
                  <Collapse
                    bordered={false}
                    expandIconPosition="right"
                    className="faq-accordion"
                  >
                    {faqs.map((faq, index) => (
                      <Panel 
                        header={
                          <Title level={4} style={{ marginBottom: 0, color: 'var(--cumi-text-primary)' }}>
                            {faq.question}
                          </Title>
                        } 
                        key={index}
                      >
                        <Paragraph className="fs-6 text-muted">
                          {faq.answer}
                        </Paragraph>
                      </Panel>
                    ))}
                  </Collapse>
                </Card>
              </Col>
            </Row>

            {/* Contact CTA */}
            <Row justify="center" className="mt-5">
              <Col xs={24} lg={18}>
                <Card className="cumi-card text-center">
                  <Title level={3} className="mb-3">{t('faq.cta.title')}</Title>
                  <Paragraph className="fs-6 mb-4">
                    {t('faq.cta.description')}
                  </Paragraph>
                  <div className="d-flex justify-content-center gap-3">
                    <a 
                      href="mailto:info@cumi.dev" 
                      className="btn btn-primary cumi-button-primary"
                    >
                      {t('faq.cta.email')}
                    </a>
                    <a 
                      href="https://wa.me/237681289411" 
                      className="btn cumi-gradient-border text-black"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t('faq.cta.whatsapp')}
                    </a>
                  </div>
                </Card>
              </Col>
            </Row>
          </motion.div>
        </div>
      </Content>

      <AppFooter logoPath="/" />
      <AppFootnote />
    </>
  );
}
