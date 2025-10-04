import React from "react";
import { Breadcrumb, Col, Row } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import Link from "next/link";
import { motion } from "framer-motion";

export default function PageContent(props: any) {
  const { title, breadcrumb, desc, banner } = props;

  return (
    <Col
      span={24}
      className="overflow-hidden"
      style={{
        position: "relative",
        minHeight: "320px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: banner 
          ? `linear-gradient(135deg, rgba(34, 197, 94, 0.85) 0%, rgba(20, 184, 166, 0.75) 50%, rgba(14, 165, 233, 0.85) 100%), url('${banner}')`
          : "linear-gradient(135deg, #22C55E 0%, #14B8A6 50%, #0EA5E9 100%)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundBlendMode: "overlay",
        padding: "80px 20px",
      }}
    >
      {/* Decorative Elements */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "radial-gradient(circle at 20% 50%, rgba(34, 197, 94, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(14, 165, 233, 0.3) 0%, transparent 50%)",
          pointerEvents: "none",
        }}
      />

      {/* Animated Particles */}
      <div style={{ position: "absolute", top: "10%", left: "10%", width: "100px", height: "100px", borderRadius: "50%", background: "rgba(255, 255, 255, 0.1)", filter: "blur(40px)" }} />
      <div style={{ position: "absolute", bottom: "15%", right: "15%", width: "150px", height: "150px", borderRadius: "50%", background: "rgba(34, 197, 94, 0.15)", filter: "blur(60px)" }} />
      
      <Row justify="center" style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "1200px" }}>
        {breadcrumb && (
          <Col span={24} style={{ marginBottom: "20px" }}>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Breadcrumb
                separator="›"
                style={{
                  fontSize: "15px",
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
                items={[
                  {
                    title: (
                      <Link 
                        href="/" 
                        style={{ 
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          fontWeight: 500,
                          textDecoration: "none",
                          transition: "all 0.3s ease",
                          padding: "6px 12px",
                          borderRadius: "8px",
                          background: "rgba(255, 255, 255, 0.1)",
                          backdropFilter: "blur(10px)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
                          e.currentTarget.style.transform = "translateY(-2px)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                          e.currentTarget.style.transform = "translateY(0)";
                        }}
                      >
                        <HomeOutlined style={{ fontSize: "16px" }} />
                        <span>Home</span>
                      </Link>
                    ),
                  },
                  ...breadcrumb.map((item: any, index: number) => {
                    const isLast = index === breadcrumb.length - 1;
                    return {
                      title: (
                        <Link
                          href={item.link || "#"}
                          style={{
                            color: isLast ? "#F59E0B" : "white",
                            fontWeight: isLast ? 600 : 500,
                            textDecoration: "none",
                            transition: "all 0.3s ease",
                            padding: "6px 12px",
                            borderRadius: "8px",
                            background: isLast 
                              ? "rgba(245, 158, 11, 0.2)" 
                              : "rgba(255, 255, 255, 0.1)",
                            backdropFilter: "blur(10px)",
                            border: isLast ? "1px solid rgba(245, 158, 11, 0.3)" : "none",
                            display: "inline-block",
                          }}
                          onMouseEnter={(e) => {
                            if (!isLast) {
                              e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
                              e.currentTarget.style.transform = "translateY(-2px)";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isLast) {
                              e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                              e.currentTarget.style.transform = "translateY(0)";
                            }
                          }}
                        >
                          {item.title}
                        </Link>
                      ),
                    };
                  }),
                ]}
              />
            </motion.div>
          </Col>
        )}

        {title && (
          <Col span={24} style={{ textAlign: "center" }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1
                style={{
                  fontSize: "clamp(2rem, 5vw, 3.5rem)",
                  fontWeight: 800,
                  color: "white",
                  textTransform: "capitalize",
                  margin: "0 0 16px 0",
                  textShadow: "0 4px 20px rgba(0, 0, 0, 0.3), 0 0 40px rgba(34, 197, 94, 0.3)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.2,
                  background: "linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {title}
              </h1>
              {/* Decorative underline */}
              <div
                style={{
                  width: "80px",
                  height: "4px",
                  background: "linear-gradient(90deg, #F59E0B 0%, #14B8A6 100%)",
                  margin: "0 auto",
                  borderRadius: "4px",
                  boxShadow: "0 4px 12px rgba(245, 158, 11, 0.4)",
                }}
              />
            </motion.div>
          </Col>
        )}

        {desc && (
          <Col span={24} style={{ textAlign: "center", marginTop: "24px" }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <p
                style={{
                  fontSize: "clamp(1.1rem, 2vw, 1.3rem)",
                  fontWeight: 400,
                  color: "rgba(255, 255, 255, 0.95)",
                  maxWidth: "800px",
                  margin: "0 auto",
                  lineHeight: 1.6,
                  textShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
                  padding: "16px 24px",
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "12px",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                }}
              >
                {desc}
              </p>
            </motion.div>
          </Col>
        )}
      </Row>
    </Col>
  );
}
