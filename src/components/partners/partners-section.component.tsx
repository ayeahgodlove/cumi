"use client";

import React, { useRef } from "react";
import { Card, Spin, Typography, Button, Carousel } from "antd";
import { GlobalOutlined, PhoneOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import Image from "next/image";
import { useTranslation } from "@contexts/translation.context";
import { useGetAllPartnersQuery } from "@store/api/partner_api";
import Link from "next/link";
import type { CarouselRef } from "antd/es/carousel";

const { Title, Text, Paragraph } = Typography;

export const PartnersSection = () => {
  const { t } = useTranslation();
  const { data: partners = [], isLoading } = useGetAllPartnersQuery();
  const carouselRef = useRef<CarouselRef>(null);

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "400px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin size="large" tip={t('common.loading')} />
      </div>
    );
  }

  if (!partners || partners.length === 0) {
    return null;
  }

  // Group partners into chunks of 4 for carousel slides
  const partnersPerSlide = 4;
  const partnerSlides = [];
  for (let i = 0; i < partners.length; i += partnersPerSlide) {
    partnerSlides.push(partners.slice(i, i + partnersPerSlide));
  }

  const handlePrev = () => carouselRef.current?.prev();
  const handleNext = () => carouselRef.current?.next();

  return (
    <section
      style={{
        padding: "80px 0",
        // background: "linear-gradient(180deg, #ffffff 0%, #f8fafb 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decoration */}
      <div
        style={{
          position: "absolute",
          top: "-100px",
          right: "-100px",
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(32,178,170,0.05) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-150px",
          left: "-150px",
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, rgba(32,178,170,0.03) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        {/* Section Header */}
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <Title
            level={2}
            style={{
              fontSize: "42px",
              fontWeight: "700",
              marginBottom: "16px",
              background: "linear-gradient(135deg, #20b2aa 0%, #17a2b8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "-0.5px",
            }}
          >
            {t('partners.title')}
          </Title>
          <Paragraph
            style={{
              fontSize: "18px",
              color: "#666",
              maxWidth: "700px",
              margin: "0 auto",
              lineHeight: "1.8",
              fontWeight: "400",
            }}
          >
            {t('partners.subtitle')}
          </Paragraph>
        </div>

        {/* Carousel Container */}
        <div style={{ position: "relative", padding: "0 60px" }}>
          {/* Navigation Buttons */}
          {partnerSlides.length > 1 && (
            <>
              <Button
                type="text"
                icon={<LeftOutlined />}
                onClick={handlePrev}
                style={{
                  position: "absolute",
                  left: "0",
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 10,
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: "white",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                  color: "#20b2aa",
                  border: "2px solid #e8e8e8",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#20b2aa";
                  e.currentTarget.style.color = "white";
                  e.currentTarget.style.borderColor = "#20b2aa";
                  e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "white";
                  e.currentTarget.style.color = "#20b2aa";
                  e.currentTarget.style.borderColor = "#e8e8e8";
                  e.currentTarget.style.transform = "translateY(-50%) scale(1)";
                }}
              />
              <Button
                type="text"
                icon={<RightOutlined />}
                onClick={handleNext}
                style={{
                  position: "absolute",
                  right: "0",
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 10,
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: "white",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                  color: "#20b2aa",
                  border: "2px solid #e8e8e8",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#20b2aa";
                  e.currentTarget.style.color = "white";
                  e.currentTarget.style.borderColor = "#20b2aa";
                  e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "white";
                  e.currentTarget.style.color = "#20b2aa";
                  e.currentTarget.style.borderColor = "#e8e8e8";
                  e.currentTarget.style.transform = "translateY(-50%) scale(1)";
                }}
              />
            </>
          )}

          {/* Carousel */}
          <Carousel
            ref={carouselRef}
            dots={{ className: "custom-dots" }}
            dotPosition="bottom"
            autoplay
            autoplaySpeed={5000}
            speed={800}
            swipeToSlide
            draggable
            style={{ padding: "20px 0 40px 0" }}
          >
            {partnerSlides.map((slide, slideIndex) => (
              <div key={slideIndex}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                    gap: "32px",
                    maxWidth: "1200px",
                    margin: "0 auto",
                    padding: "0 20px",
                  }}
                >
                  {slide.map((partner) => (
                    <Card
                      key={partner.id}
                      hoverable
                      style={{
                        borderRadius: "20px",
                        border: "2px solid #f0f0f0",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                        overflow: "hidden",
                        background: "white",
                        height: "100%",
                      }}
                      bodyStyle={{
                        padding: "32px 24px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "20px",
                        minHeight: "380px",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-12px) scale(1.02)";
                        e.currentTarget.style.boxShadow = "0 12px 32px rgba(32,178,170,0.2)";
                        e.currentTarget.style.borderColor = "#20b2aa";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0) scale(1)";
                        e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)";
                        e.currentTarget.style.borderColor = "#f0f0f0";
                      }}
                    >
                      {/* Partner Logo */}
                      <div
                        style={{
                          width: "140px",
                          height: "140px",
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "24px",
                          border: "4px solid #20b2aa",
                          position: "relative",
                          overflow: "hidden",
                          boxShadow: "0 4px 16px rgba(32,178,170,0.15)",
                        }}
                      >
                        {partner.logo ? (
                          <div style={{ width: "100%", height: "100%", position: "relative" }}>
                            <Image
                              src={partner.logo}
                              alt={partner.name}
                              fill
                              sizes="140px"
                              style={{
                                objectFit: "contain",
                                padding: "8px",
                              }}
                            />
                          </div>
                        ) : (
                          <div
                            style={{
                              fontSize: "48px",
                              fontWeight: "700",
                              color: "#20b2aa",
                            }}
                          >
                            {partner.name.charAt(0)}
                          </div>
                        )}
                      </div>

                      {/* Partner Info */}
                      <div style={{ textAlign: "center", width: "100%", flex: 1 }}>
                        <Title
                          level={4}
                          style={{
                            margin: "0 0 8px 0",
                            fontSize: "18px",
                            fontWeight: "600",
                            color: "#333",
                            letterSpacing: "0.3px",
                          }}
                        >
                          {partner.name}
                        </Title>
                        <Text
                          style={{
                            fontSize: "13px",
                            color: "#999",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px",
                            fontWeight: "500",
                          }}
                        >
                          <span style={{ fontSize: "16px" }}>📍</span> {partner.location}
                        </Text>
                        <Paragraph
                          ellipsis={{ rows: 3 }}
                          style={{
                            fontSize: "14px",
                            color: "#666",
                            margin: "16px 0",
                            lineHeight: "1.7",
                            minHeight: "63px",
                          }}
                        >
                          {partner.description}
                        </Paragraph>
                      </div>

                      {/* Partner Actions */}
                      <div
                        style={{
                          display: "flex",
                          gap: "12px",
                          width: "100%",
                          justifyContent: "center",
                          paddingTop: "12px",
                          borderTop: "1px solid #f0f0f0",
                        }}
                      >
                        {partner.websiteLink && (
                          <Button
                            type="primary"
                            icon={<GlobalOutlined />}
                            href={partner.websiteLink}
                            target="_blank"
                            shape="round"
                            style={{
                              background: "linear-gradient(135deg, #20b2aa 0%, #17a2b8 100%)",
                              border: "none",
                              color: "white",
                              fontWeight: "500",
                              fontSize: "13px",
                              height: "36px",
                              padding: "0 20px",
                              boxShadow: "0 2px 8px rgba(32,178,170,0.25)",
                              transition: "all 0.3s ease",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = "translateY(-2px)";
                              e.currentTarget.style.boxShadow = "0 4px 12px rgba(32,178,170,0.35)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "translateY(0)";
                              e.currentTarget.style.boxShadow = "0 2px 8px rgba(32,178,170,0.25)";
                            }}
                          >
                            {t('partners.visit')}
                          </Button>
                        )}
                        {partner.contactPhone && (
                          <Button
                            icon={<PhoneOutlined />}
                            href={`tel:${partner.contactPhone}`}
                            shape="round"
                            style={{
                              border: "2px solid #e8e8e8",
                              color: "#666",
                              fontWeight: "500",
                              fontSize: "13px",
                              height: "36px",
                              padding: "0 20px",
                              transition: "all 0.3s ease",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = "#20b2aa";
                              e.currentTarget.style.color = "#20b2aa";
                              e.currentTarget.style.transform = "translateY(-2px)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = "#e8e8e8";
                              e.currentTarget.style.color = "#666";
                              e.currentTarget.style.transform = "translateY(0)";
                            }}
                          >
                            {t('partners.contact')}
                          </Button>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </Carousel>
        </div>

        {/* View All Partners Button */}
        <div style={{ textAlign: "center", marginTop: "64px" }}>
          <Link href="/partners">
            <Button
              size="large"
              shape="round"
              style={{
                background: "linear-gradient(135deg, #20b2aa 0%, #17a2b8 100%)",
                border: "none",
                color: "white",
                fontWeight: "600",
                padding: "0 40px",
                height: "52px",
                fontSize: "16px",
                boxShadow: "0 4px 16px rgba(32,178,170,0.3)",
                letterSpacing: "0.5px",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px) scale(1.02)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(32,178,170,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(32,178,170,0.3)";
              }}
            >
              {t('partners.view_all')}
            </Button>
          </Link>
        </div>
      </div>

      {/* Custom carousel dots styling */}
      <style jsx global>{`
        .custom-dots li button {
          background: #d9d9d9 !important;
          width: 12px !important;
          height: 12px !important;
          border-radius: 50% !important;
          transition: all 0.3s ease !important;
        }
        .custom-dots li.slick-active button {
          background: #20b2aa !important;
          width: 32px !important;
          border-radius: 6px !important;
        }
        .custom-dots li:hover button {
          background: #20b2aa !important;
          opacity: 0.7;
        }
      `}</style>
    </section>
  );
};
