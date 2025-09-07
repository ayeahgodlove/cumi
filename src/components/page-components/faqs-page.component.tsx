"use client";

import { AppNav } from "@components/nav/nav.component";
import { AppFooter } from "@components/footer/footer";
import { AppFootnote } from "@components/footnote/footnote";
import { Layout, Card, Typography, Row, Col, Collapse } from "antd";
import { motion } from "framer-motion";

const { Content } = Layout;
const { Title, Paragraph } = Typography;
const { Panel } = Collapse;

export default function FAQsPageComponent() {
  const faqs = [
    {
      question: "What services does Cumi Digital Solutions offer?",
      answer: "We offer comprehensive digital solutions including web development, mobile app development, UI/UX design, digital marketing, cloud solutions, and technical consulting. Our team specializes in modern technologies like React, Next.js, Node.js, and various cloud platforms."
    },
    {
      question: "How long does a typical project take?",
      answer: "Project timelines vary depending on complexity and scope. Simple websites typically take 2-4 weeks, while complex web applications can take 2-6 months. We provide detailed timelines during our initial consultation and keep you updated throughout the development process."
    },
    {
      question: "Do you provide ongoing support after project completion?",
      answer: "Yes, we offer comprehensive post-launch support including maintenance, updates, bug fixes, and feature enhancements. We have different support packages to suit your needs, from basic maintenance to full managed services."
    },
    {
      question: "What technologies do you work with?",
      answer: "We work with modern, industry-standard technologies including React, Next.js, Node.js, TypeScript, Python, Django, React Native, Flutter, AWS, Google Cloud, Docker, and many more. We stay updated with the latest trends and best practices."
    },
    {
      question: "Can you help with existing projects?",
      answer: "Absolutely! We can audit, improve, maintain, or completely rebuild existing projects. Our team has experience working with legacy systems and can help modernize your technology stack while maintaining business continuity."
    },
    {
      question: "What is your pricing structure?",
      answer: "Our pricing is project-based and depends on scope, complexity, and timeline. We offer competitive rates and flexible payment terms. Contact us for a detailed quote tailored to your specific requirements."
    },
    {
      question: "Do you work with startups?",
      answer: "Yes, we love working with startups! We understand the unique challenges startups face and offer flexible solutions, scalable architectures, and startup-friendly pricing. We can help you build an MVP or scale your existing product."
    },
    {
      question: "How do you ensure project quality?",
      answer: "We follow industry best practices including code reviews, automated testing, continuous integration, and regular client feedback sessions. Our development process includes multiple quality checkpoints and we use modern development methodologies."
    },
    {
      question: "Can you help with SEO and digital marketing?",
      answer: "Yes, we offer comprehensive digital marketing services including SEO optimization, social media marketing, content marketing, PPC advertising, and analytics setup. We can help improve your online visibility and drive more traffic to your website."
    },
    {
      question: "What makes Cumi Digital Solutions different?",
      answer: "We combine technical expertise with business understanding. Our team doesn't just code - we think strategically about your business goals and create solutions that drive real results. We're committed to long-term partnerships and your success."
    }
  ];

  return (
    <>
      <div className="container-fluid mt-3" style={{ width: "100%" }}>
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
                Frequently Asked Questions
              </Title>
              <Paragraph className="fs-5 text-muted">
                Find answers to common questions about our services, processes, and how we can help your business grow.
              </Paragraph>
            </div>

            {/* FAQs Section */}
            <Row justify="center">
              <Col xs={24} lg={18}>
                <Card className="cumi-card">
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
                  <Title level={3} className="mb-3">Still Have Questions?</Title>
                  <Paragraph className="fs-6 mb-4">
                    Can&apos;t find the answer you&apos;re looking for? Our team is here to help. 
                    Contact us directly and we&apos;ll get back to you within 24 hours.
                  </Paragraph>
                  <div className="d-flex justify-content-center gap-3">
                    <a 
                      href="mailto:info@cumitech.com" 
                      className="btn btn-primary cumi-button-primary"
                    >
                      Email Us
                    </a>
                    <a 
                      href="https://wa.me/237681289411" 
                      className="btn cumi-gradient-border text-black"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      WhatsApp
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
