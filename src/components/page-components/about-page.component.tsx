"use client";
import { Suspense } from "react";
import { AppNav } from "@components/nav/nav.component";
import BannerComponent from "@components/banner/banner.component";
import { 
  Typography, 
  Row, 
  Col, 
  Card, 
  Button, 
  Divider, 
  Space, 
  Avatar, 
  Statistic,
  Tag,
  Timeline
} from "antd";
import { 
  RocketOutlined, 
  CodeOutlined, 
  TeamOutlined,
  BulbOutlined,
  HeartOutlined,
  TrophyOutlined,
  GlobalOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  StarOutlined,
  ArrowRightOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined
} from "@ant-design/icons";
import { AppFooter } from "@components/footer/footer";
import { AppFootnote } from "@components/footnote/footnote";
import { motion } from "framer-motion";
import styles from "@app/about_us/about-page.module.css";

const { Title, Paragraph, Text } = Typography;

export default function AboutPageComponent() {
  const stats = [
    { title: "Projects Completed", value: 25, icon: <TrophyOutlined /> },
    { title: "Happy Clients", value: 15, icon: <HeartOutlined /> },
    { title: "Years Experience", value: 1, icon: <GlobalOutlined /> },
    { title: "Team Members", value: 1, icon: <TeamOutlined /> }
  ];

  const values = [
    {
      icon: <BulbOutlined />,
      title: "Innovation",
      description: "We constantly explore new technologies and methodologies to deliver cutting-edge solutions."
    },
    {
      icon: <HeartOutlined />,
      title: "Passion",
      description: "Our team is passionate about creating digital experiences that make a real difference."
    },
    {
      icon: <ThunderboltOutlined />,
      title: "Excellence",
      description: "We strive for excellence in every project, ensuring quality and attention to detail."
    },
    {
      icon: <TeamOutlined />,
      title: "Collaboration",
      description: "We believe in the power of teamwork and collaboration to achieve extraordinary results."
    }
  ];

  const timeline = [
    {
      year: "2024",
      title: "CumiTech Founded",
      description: "CumiTech was established with a vision to empower startup businesses through innovative web solutions."
    },
    {
      year: "2024",
      title: "First Projects Delivered",
      description: "Successfully delivered scalable websites and applications using React and Laravel technologies."
    },
    {
      year: "2024",
      title: "Client Success Stories",
      description: "Built strong client relationships and achieved successful product launches with satisfied clients."
    },
    {
      year: "2024",
      title: "Expertise Expansion",
      description: "Enhanced expertise in SEO and digital marketing design to provide comprehensive solutions."
    },
    {
      year: "2024",
      title: "Hybrid Operations",
      description: "Established hybrid operations from Bamenda, Northwest, Cameroon, serving clients globally."
    }
  ];

  const team = [
    {
      name: "Ayuk Godlove",
      role: "Founder & Software Engineer",
      position: "Creative Designer",
      avatar: "/img/avatar.png",
      description: "At CumiTech, I combine my skills as a software engineer and creative designer to empower startup businesses through innovative web solutions. I develop scalable websites and applications using technologies like React and Laravel, while also managing client relationships and project timelines.",
      skills: ["React", "Laravel", "Node.js", "TypeScript", "PHP", "JavaScript", "UI/UX Design"],
      experience: "5+ years",
      location: "Bamenda, Northwest, Cameroon",
      email: "ayukgodlove@cumitech.com",
      phone: "+237681289411"
    }
  ];

  return (
    <Suspense>
      <div className="container-fluid mt-3" style={{ width: "100%" }}>
        <AppNav logoPath="/" />
      </div>

      <BannerComponent
        breadcrumbs={[{ label: "About Us", uri: "about_us" }]}
        pageTitle="About Us"
      />

      {/* Hero Section */}
      <section 
        className="py-5"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}
      >
        <div className="container">
          <Row justify="center" align="middle">
            <Col xs={24} lg={12}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Title level={1} style={{ color: 'white' }} className="mb-4">
                  CumiTech - Empowering Startups Through Innovation
                </Title>
                <Paragraph 
                  className="fs-5 mb-4"
                  style={{ color: 'rgba(255, 255, 255, 0.9)' }}
                >
                  At CumiTech, we&apos;re passionate about empowering startup businesses 
                  through innovative web solutions. We combine software engineering expertise 
                  with creative design to deliver scalable websites and applications that drive success.
                </Paragraph>
                <Space size="large">
                  <Button 
                    type="primary" 
                    size="large"
                    style={{
                      backgroundColor: 'white',
                      color: '#667eea',
                      borderColor: 'white',
                      fontWeight: 'bold'
                    }}
                    href="/contact_us"
                  >
                    Get In Touch
                  </Button>
                  <Button 
                    size="large"
                    style={{
                      backgroundColor: 'transparent',
                      color: 'white',
                      borderColor: 'white',
                      fontWeight: 'bold'
                    }}
                    href="/our_services"
                  >
                    Our Services
                  </Button>
                </Space>
              </motion.div>
            </Col>
            <Col xs={24} lg={12}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-center"
              >
                <img
                  className="w-100 img-fluid rounded-3 shadow-lg"
                  style={{ maxHeight: 400 }}
                  src="/img/emmanuel-ikwuegbu-MSX3O-Sqa8U-unsplash.jpg"
                  alt="About Cumi Digital"
                />
              </motion.div>
            </Col>
          </Row>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-5">
        <div className="container">
          <Row gutter={[24, 24]} justify="center">
            {stats.map((stat, index) => (
              <Col xs={12} sm={6} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="text-center border-0 shadow-sm h-100">
                    <div className="text-primary mb-3" style={{ fontSize: '2.5rem' }}>
                      {stat.icon}
                    </div>
                    <Statistic 
                      title={stat.title} 
                      value={stat.value}
                      valueStyle={{ color: '#1890ff', fontSize: '2.5rem', fontWeight: 'bold' }}
                    />
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <Row justify="center" className="mb-5">
            <Col xs={24} lg={16} className="text-center">
              <Title level={2} className="mb-3">Our Story</Title>
              <Paragraph className="fs-5 text-muted">
                Founded in June 2024, CumiTech began with a vision to empower startup businesses 
                through innovative web solutions. Based in Bamenda, Northwest, Cameroon, we operate 
                in a hybrid model, combining software engineering expertise with creative design.
              </Paragraph>
            </Col>
          </Row>
          <Row gutter={[24, 24]} justify="center">
            <Col xs={24} lg={12}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <img
                  className="w-100 img-fluid rounded-3 shadow-lg"
                  src="/img/desola-lanre-ologun-IgUR1iX0mqM-unsplash.jpg"
                  alt="Our Team"
                />
              </motion.div>
            </Col>
            <Col xs={24} lg={12}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Title level={3} className="mb-4">Our Mission</Title>
                <Paragraph className="fs-6 mb-4">
                  We are committed to empowering startup businesses through innovative web solutions. 
                  Our mission is to combine software engineering expertise with creative design to 
                  deliver scalable websites and applications that drive business success.
                </Paragraph>
                <div className="mb-4">
                  <Space direction="vertical" size="middle">
                    <div className="d-flex align-items-center">
                      <CheckCircleOutlined className="text-success me-3" style={{ fontSize: '1.2rem' }} />
                      <Text strong>Innovation-driven approach</Text>
                    </div>
                    <div className="d-flex align-items-center">
                      <CheckCircleOutlined className="text-success me-3" style={{ fontSize: '1.2rem' }} />
                      <Text strong>React & Laravel expertise</Text>
                    </div>
                    <div className="d-flex align-items-center">
                      <CheckCircleOutlined className="text-success me-3" style={{ fontSize: '1.2rem' }} />
                      <Text strong>SEO & Digital Marketing</Text>
                    </div>
                    <div className="d-flex align-items-center">
                      <CheckCircleOutlined className="text-success me-3" style={{ fontSize: '1.2rem' }} />
                      <Text strong>Client relationship management</Text>
                    </div>
                  </Space>
                </div>
              </motion.div>
            </Col>
          </Row>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-5">
        <div className="container">
          <Row justify="center" className="mb-5">
            <Col xs={24} lg={16} className="text-center">
              <Title level={2} className="mb-3">Our Core Values</Title>
              <Paragraph className="fs-5 text-muted">
                These values guide everything we do and shape our company culture.
              </Paragraph>
            </Col>
          </Row>
          <Row gutter={[24, 24]}>
            {values.map((value, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card 
                    className="h-100 text-center border-0 shadow-sm"
                    hoverable
                    style={{
                      transition: 'all 0.3s ease',
                      borderRadius: '12px'
                    }}
                  >
                    <div className="text-primary mb-3" style={{ fontSize: '2.5rem' }}>
                      {value.icon}
                    </div>
                    <Title level={4} className="mb-3">{value.title}</Title>
                    <Paragraph className="text-muted">{value.description}</Paragraph>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <Row justify="center" className="mb-5">
            <Col xs={24} lg={16} className="text-center">
              <Title level={2} className="mb-3">Our Journey</Title>
              <Paragraph className="fs-5 text-muted">
                A timeline of our growth and achievements over the years.
              </Paragraph>
            </Col>
          </Row>
          <Row justify="center">
            <Col xs={24} lg={16}>
              <Timeline
                items={timeline.map((item, index) => ({
                  dot: (
                    <div 
                      style={{
                        backgroundColor: '#1890ff',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}
                    >
                      {index + 1}
                    </div>
                  ),
                  children: (
                    <Card className="border-0 shadow-sm">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <Tag color="blue" className="mb-2">{item.year}</Tag>
                      </div>
                      <Title level={4} className="mb-2">{item.title}</Title>
                      <Paragraph className="text-muted mb-0">{item.description}</Paragraph>
                    </Card>
                  )
                }))}
              />
            </Col>
          </Row>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-5">
        <div className="container">
          <Row justify="center" className="mb-5">
            <Col xs={24} lg={16} className="text-center">
              <Title level={2} className="mb-3">Meet Our Team</Title>
              <Paragraph className="fs-5 text-muted">
                The talented individuals who make Cumi Digital a success.
              </Paragraph>
            </Col>
          </Row>
          <Row gutter={[24, 24]} justify="center">
            {team.map((member, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card 
                    className="text-center border-0 shadow-sm h-100"
                    hoverable
                    style={{
                      transition: 'all 0.3s ease',
                      borderRadius: '12px'
                    }}
                  >
                    <Avatar 
                      size={80} 
                      src={member.avatar}
                      className="mb-3"
                    />
                    <Title level={4} className="mb-2">{member.name}</Title>
                    <Text type="secondary" className="mb-2 d-block">{member.role}</Text>
                    <Text strong className="mb-3 d-block text-primary">{member.position}</Text>
                    <Paragraph className="text-muted small mb-3">{member.description}</Paragraph>
                    <div className="mb-3">
                      <Text strong className="small">Skills:</Text>
                      <div className="mt-1">
                        {member.skills?.slice(0, 3).map((skill: string, index: number) => (
                          <Tag key={index} color="blue" className="me-1 mb-1">
                            {skill}
                          </Tag>
                        ))}
                        {member.skills?.length > 3 && (
                          <Tag color="default">+{member.skills.length - 3}</Tag>
                        )}
                      </div>
                    </div>
                    <div className="small text-muted">
                      <div><strong>Experience:</strong> {member.experience}</div>
                      <div><strong>Location:</strong> {member.location}</div>
                    </div>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5">
        <div className="container">
          <Card 
            className="text-center border-0 shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #1890ff 0%, #722ed1 100%)',
              color: 'white'
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Title level={2} style={{ color: 'white' }} className="mb-3">
                Ready to Work With Us?
              </Title>
              <Paragraph 
                className="fs-5 mb-4"
                style={{ color: 'rgba(255, 255, 255, 0.8)' }}
              >
                Let&apos;s discuss your project and create something amazing together.
              </Paragraph>
              <Space size="large">
                <Button 
                  type="primary" 
                  size="large"
                  style={{
                    backgroundColor: 'white',
                    color: '#1890ff',
                    borderColor: 'white',
                    fontWeight: 'bold'
                  }}
                  href="https://wa.me/237681289411"
                  target="_blank"
                >
                  Start Your Project
                </Button>
                <Button 
                  size="large"
                  style={{
                    backgroundColor: 'transparent',
                    color: 'white',
                    borderColor: 'white',
                    fontWeight: 'bold'
                  }}
                  href="/contact_us"
                >
                  Contact Us
                </Button>
              </Space>
            </motion.div>
          </Card>
        </div>
      </section>

      <AppFooter logoPath="/" />
      <AppFootnote />
    </Suspense>
  );
}
