"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { ThemedLayoutV2 } from "@refinedev/antd";
import { Authenticated } from "@refinedev/core";
import { Header } from "./header";
import { useRouter, usePathname } from "next/navigation";
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
  const { data: clientSession, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Use server session if provided, otherwise fall back to client session
  const session = serverSession || clientSession;
  const sessionStatus = serverSession ? "authenticated" : status;

  // Memoize the redirect function to prevent recreation
  const performRedirect = useCallback(
    (path: string, reason: string) => {
      console.log(`Redirecting to ${path} - Reason: ${reason}`);
      setIsRedirecting(true);
      router.push(path);

      // Reset redirecting state after a delay
      setTimeout(() => {
        setIsRedirecting(false);
      }, 1000);
    },
    [router]
  );

  // Memoize the redirect logic to prevent unnecessary re-runs
  const handleRedirectLogic = useCallback(() => {
    console.log(
      "Effect running - Status:",
      sessionStatus,
      "Session:",
      !!session?.user,
      "Pathname:",
      pathname,
      "Server session provided:",
      !!serverSession
    );

    // Still loading session (only applies to client session), don't do anything
    if (sessionStatus === "loading" && !serverSession) {
      console.log("Still loading session...");
      return;
    }

    // No session, redirect to login
    if (!session?.user) {
      console.log("No session, redirecting to login");
      performRedirect("/login", "No session");
      return;
    }

    const userRole = session.user.role || "user";
    console.log("User role:", userRole);

    // Define role-specific dashboard paths
    const roleDashboards = {
      admin: "/dashboard",
      creator: "/dashboard/creator",
      student: "/dashboard/student",
      user: "/dashboard/user",
    };

    const expectedDashboard =
      roleDashboards[userRole as keyof typeof roleDashboards];
    console.log("Expected dashboard for role:", expectedDashboard);

    // If user is on exact "/dashboard" path and they have a specific role dashboard, redirect
    if (pathname === "/dashboard" && expectedDashboard !== "/dashboard") {
      console.log(
        "User on generic dashboard, redirecting to role-specific dashboard"
      );
      performRedirect(expectedDashboard, "Role-specific dashboard redirect");
      return;
    }

    // If user is already on their correct dashboard, don't do anything
    if (pathname === expectedDashboard) {
      console.log("User is already on correct dashboard, no action needed");
      return;
    }

    // Handle role-based access control for dashboard paths
    if (pathname.startsWith("/dashboard/")) {
      const pathSegments = pathname.split("/").filter(Boolean);
      const currentDashboard = pathSegments[1]; // Get the dashboard type (after /dashboard/)

      console.log(
        "Current dashboard:",
        currentDashboard,
        "Path segments:",
        pathSegments
      );

      // Admin can access everything
      if (userRole === "admin") {
        console.log("Admin user, allowing access to all dashboards");
        return;
      }

      // Check if user is accessing their own dashboard or allowed resources
      const allowedDashboards = {
        creator: [
          "creator",
          "lms",
          "courses",
          "lessons",
          "quizes",
          "blog-posts",
          "events",
        ],
        student: ["student", "student-courses"],
        user: ["user"],
      };

      const userAllowedDashboards =
        allowedDashboards[userRole as keyof typeof allowedDashboards] || [];
      console.log("User allowed dashboards:", userAllowedDashboards);

      // If the current dashboard is not in the allowed list, redirect to user's default dashboard
      if (
        currentDashboard &&
        !userAllowedDashboards.includes(currentDashboard)
      ) {
        console.log("User accessing unauthorized dashboard, redirecting");
        performRedirect(expectedDashboard, "Unauthorized dashboard access");
        return;
      }
    }

    // If we reach here, user has proper access
    console.log("User has proper access");
  }, [session?.user, sessionStatus, pathname, performRedirect, serverSession]);

  // Handle authentication and role-based routing
  useEffect(() => {
    handleRedirectLogic();
  }, [handleRedirectLogic]);

  // Show loading state (only when using client session and still loading)
  if ((sessionStatus === "loading" && !serverSession) || isRedirecting) {
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
        <p style={{ marginTop: 16, color: "#666" }}>
          {sessionStatus === "loading"
            ? "Loading session..."
            : "Redirecting..."}
        </p>
      </div>
    );
  }

  // If no session and not redirecting, show login (fallback)
  if (!session?.user) {
    console.log("No session, showing login fallback");
    return <Login />;
  }

  // Determine user role
  const userRole = session.user.role || "user";
  console.log(
    "Rendering layout for role:",
    userRole,
    "Session source:",
    serverSession ? "server" : "client"
  );

  // Admin and Creator Layout - show admin dashboard with full sidebar
  if (userRole === "admin") {
    return (
      <ThemedLayoutV2 Header={Header} Title={Title}>
        <Authenticated key={`${userRole}-dashboard`} fallback={<Login />}>
          <Row justify="center" align="top">
            <Col xs={22} md={20}>
              {children}
            </Col>
          </Row>
        </Authenticated>
      </ThemedLayoutV2>
    );
  }

  // Student Layout - Educational focused layout
  if (userRole === "creator" || userRole === "student") {
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
          <div className="container-fluid mt-3" style={{ width: "100%" }}>
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

  // User Layout - show user dashboard
  return (
    <Authenticated key={`${userRole}-dashboard`} fallback={<Login />}>
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
