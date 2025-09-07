"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ThemedLayoutV2 } from "@refinedev/antd";
import { Authenticated } from "@refinedev/core";
import { Header } from "./header";
import { useRouter } from "next/navigation";
import { Col, Row, Spin } from "antd";
import Login from "@app/login/page";
import { AppNav } from "./nav/nav.component";
import { AppFooter } from "./footer/footer";
import { AppFootnote } from "./footnote/footnote";

interface RoleBasedLayoutProps {
  children: React.ReactNode;
}

export default function RoleBasedLayout({ children }: RoleBasedLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Handle authentication redirect in useEffect
  useEffect(() => {
    if (status === "loading") return; // Still loading, don't redirect

    if (!session?.user && !isRedirecting) {
      setIsRedirecting(true);
      router.push("/login");
    }
  }, [session?.user, status, router, isRedirecting]);

  // Show loading state
  if (status === "loading" || isRedirecting) {
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
        <p style={{ marginTop: 16, color: "#666" }}>Loading...</p>
      </div>
    );
  }

  // If no session and not redirecting, show login (fallback)
  if (!session?.user) {
    return <Login />;
  }

  // Determine user role
  const userRole = session.user.role || "user";

  // Admin Layout - show admin dashboard
  if (userRole === "admin") {
    return (
      <ThemedLayoutV2 Header={Header}>
        <Authenticated key="admin-dashboard" fallback={<Login />}>
          <Row justify="center" align="top">
            <Col xs={22} md={18}>
              {children}
            </Col>
          </Row>
        </Authenticated>
      </ThemedLayoutV2>
    );
  }

  // User Layout - show user dashboard
  return (
    <Authenticated key="user-dashboard" fallback={<Login />}>
      <div className="container-fluid mt-3" style={{ width: "100%" }}>
        {/* navigation bar */}
        <AppNav logoPath="/" />
        <Row justify="center" align="top">
          <Col xs={22} md={18}>
            {children}
          </Col>
        </Row>
        <AppFooter logoPath="/" />
        <AppFootnote />
      </div>
    </Authenticated>
  );
}
