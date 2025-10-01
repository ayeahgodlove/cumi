"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { ThemedLayoutV2 } from "@refinedev/antd";
import { Authenticated } from "@refinedev/core";
import { Header } from "./header";
import { Col, Row, Spin } from "antd";
import Login from "@app/login/page";
import { AppNav } from "./nav/nav.component";
import { AppFooter } from "./footer/footer";
import { AppFootnote } from "./footnote/footnote";
import { Title } from "./header/title.component";
import { Session } from "next-auth";

interface RoleBasedLayoutProps {
  children: React.ReactNode;
  session?: Session | null; // Optional session prop from server component
}

export default function RoleBasedLayout({
  children,
  session: serverSession,
}: RoleBasedLayoutProps) {
  // Use server session if provided, otherwise fall back to client session
  const { data: clientSession, status } = useSession();
  const session = serverSession || clientSession;
  const sessionStatus = serverSession ? "authenticated" : status;

  // Show loading state (only when using client session and still loading)
  if (sessionStatus === "loading" && !serverSession) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
        }}
      >
        <Spin size="large" />
        <p style={{ marginTop: 16, color: "#666" }}>Loading session...</p>
      </div>
    );
  }

  // If no session, show login (fallback)
  if (!session?.user) {
    return <Login />;
  }

  // Determine user role
  const userRole = session.user.role || "user";

  // Admin Layout - show admin dashboard with full sidebar
  if (userRole === "admin") {
    return (
      <ThemedLayoutV2 Header={Header} Title={Title}>
        <Authenticated key={`${userRole}-dashboard`} fallback={<Login />}>
          <Row justify="center" align="top">
            <Col xs={22} md={20} style={{ padding: "2rem 0" }}>
              {children}
            </Col>
          </Row>
        </Authenticated>
      </ThemedLayoutV2>
    );
  }

  // Creator Layout - Educational focused layout
  if (userRole === "creator") {
    return (
      <Authenticated key={`${userRole}-dashboard`} fallback={<Login />}>
        <div
          className="creator-layout"
          style={{
            backgroundColor: "#fafbfc",
            minHeight: "100vh",
          }}
        >
          {/* Creator Navigation */}
          <AppNav logoPath="/" />

          {/* Creator Content Area */}
          <div
            // className="container-fluid"
            style={{ width: "100%", padding: "1.5rem 0" }}
          >
            <Row justify="center" align="top">
              <Col xs={22} md={20}>
                {children}
              </Col>
            </Row>
          </div>

          {/* Creator Footer */}
          <AppFooter logoPath="/" />
          <AppFootnote />
        </div>
      </Authenticated>
    );
  }

  // Student Layout - Educational focused layout
  if (userRole === "student") {
    return (
      <Authenticated key={`${userRole}-dashboard`} fallback={<Login />}>
        <div
          className="student-layout"
          style={{
            backgroundColor: "#fafbfc",
            minHeight: "100vh",
          }}
        >
          {/* Student Navigation */}
          <AppNav logoPath="/" />

          {/* Student Content Area */}
          <div
            className="container-fluid"
            style={{ width: "100%", padding: "24px 0" }}
          >
            <Row justify="center" align="top">
              <Col xs={22} md={20}>
                {children}
              </Col>
            </Row>
          </div>

          {/* Student Footer */}
          <AppFooter logoPath="/" />
          <AppFootnote />
        </div>
      </Authenticated>
    );
  }

  // User Layout - redirect to student dashboard
  return (
    <Authenticated key={`${userRole}-dashboard`} fallback={<Login />}>
      <div
        className="student-layout"
        style={{
          backgroundColor: "#fafbfc",
          minHeight: "100vh",
        }}
      >
        {/* Student Navigation */}
        <AppNav logoPath="/" />

        {/* Student Content Area */}
        <div
          className="container-fluid"
          style={{ width: "100%", padding: "24px 0" }}
        >
          <Row justify="center" align="top">
            <Col xs={22} md={20}>
              {children}
            </Col>
          </Row>
        </div>

        {/* Student Footer */}
        <AppFooter logoPath="/" />
        <AppFootnote />
      </div>
    </Authenticated>
  );
}
