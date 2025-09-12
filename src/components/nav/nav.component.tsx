"use client";

import { Affix, Button, Dropdown, Avatar, Space } from "antd";
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import React, { useState, useCallback } from "react";
import { LanguageSelector, useTranslation } from "@contexts/translation.context";

type Props = {
  logoPath: string;
};
export const AppNav: React.FC<Props> = ({ logoPath }) => {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isNavigating, setIsNavigating] = useState(false);
  const { t } = useTranslation();

  const handleLogout = useCallback(async () => {
    setIsNavigating(true);
    try {
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsNavigating(false);
    }
  }, []);

  const handleNavigation = useCallback((href: string) => {
    setIsNavigating(true);
    setTimeout(() => setIsNavigating(false), 1000);
  }, []);

  const getLinkStyle = (path: string) => ({
    color: pathname === path ? "#20b2aa" : "inherit",
    fontWeight: pathname === path ? "bold" : "normal"
  });

  const getLinkClassName = (path: string) => 
    `nav-link ${pathname === path ? " active fw-bold" : ""}`;

  const userMenuItems = [
    {
      key: "username",
      label: (
        <div
          style={{
            padding: "8px 12px",
            fontWeight: "bold",
            color: "#1890ff",
            borderBottom: "1px solid #f0f0f0",
            marginBottom: "4px",
          }}
        >
          <div style={{ fontSize: "14px", fontWeight: "bold" }}>
            {session?.user?.name || session?.user?.email || "User"}
          </div>
          {session?.user?.role && (
            <div
              style={{
                fontSize: "12px",
                color: "#666",
                fontWeight: "normal",
                textTransform: "capitalize",
              }}
            >
              {session.user.role}
            </div>
          )}
        </div>
      ),
      disabled: true,
    },
    {
      type: "divider" as const,
    },
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: <Link href="/dashboard">{t('nav.dashboard')}</Link>,
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: <Link href="/dashboard/settings">{t('nav.settings')}</Link>,
    },
    {
      type: "divider" as const,
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: t('nav.logout'),
      onClick: handleLogout,
    },
  ];
  return (
    <Affix offsetTop={0}>
      <nav 
        className="navbar navbar-expand-lg navbar-full-width" 
        style={{ 
          backgroundColor: "white", 
          // boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
        }}
      >
        <div className="container-fluid" style={{ width: "100%", maxWidth: "none", paddingLeft: "15px", paddingRight: "15px" }}>
          <Link href={"/"}>
            <Image
              src={`${logoPath || '/'}cumi-green.jpg`}
              height={70}
              width={140}
              quality={100}
              alt="CumiTech Logo"
              priority
              style={{ 
                marginRight: 15,
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 fs-6">
              <li className="nav-item">
                <Link
                  className={`nav-link  ${
                    pathname === "/" ? " active fw-bold" : ""
                  }`}
                  style={{
                    color: pathname === "/" ? "#20b2aa" : "inherit",
                    fontWeight: pathname === "/" ? "bold" : "normal"
                  }}
                  aria-current="page"
                  href="/"
                >
                  {t('nav.welcome')}
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={getLinkClassName("/our_services")}
                  style={getLinkStyle("/our_services")}
                  href="/our_services"
                >
                  {t('nav.services')}
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className={getLinkClassName("/projects")}
                  style={getLinkStyle("/projects")}
                  href="/projects"
                >
                  {t('nav.projects')}
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={getLinkClassName("/blog_posts")}
                  style={getLinkStyle("/blog_posts")}
                  href="/blog_posts"
                >
                  {t('nav.blog_posts')}
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={getLinkClassName("/opportunities")}
                  style={getLinkStyle("/opportunities")}
                  href="/opportunities"
                >
                  {t('nav.opportunities')}
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={getLinkClassName("/events")}
                  style={getLinkStyle("/events")}
                  href="/events"
                >
                  {t('nav.events')}
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={getLinkClassName("/courses")}
                  style={getLinkStyle("/courses")}
                  href="/courses"
                >
                  {t('nav.courses')}
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={getLinkClassName("/about_us")}
                  style={getLinkStyle("/about_us")}
                  aria-disabled="true"
                  href="/about_us"
                >
                  {t('nav.about_us')}
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={getLinkClassName("/contact_us")}
                  style={getLinkStyle("/contact_us")}
                  aria-disabled="true"
                  href="/contact_us"
                >
                  {t('nav.contact_us')}
                </Link>
              </li>
            </ul>
            <div className="d-flex flex-sm-column flex-md-row align-items-center">
              <Space size="middle">
                <LanguageSelector />
                {status === "loading" ? (
                  <Button loading size="large" shape="round">
                    {t('common.loading')}
                  </Button>
                ) : session ? (
                  <Dropdown
                    menu={{ items: userMenuItems }}
                    placement="bottomRight"
                    arrow
                  >
                    <Space className="cursor-pointer">
                      <Avatar
                        size="large"
                        src={session.user?.image}
                        icon={<UserOutlined />}
                        style={{ backgroundColor: "#1890ff" }}
                      />
                    </Space>
                  </Dropdown>
                ) : (
                  <Button
                    className="primary-btn"
                    shape="round"
                    href="/login"
                    size="large"
                  >
                    {t('nav.login')}
                  </Button>
                )}
              </Space>
            </div>
          </div>
        </div>
      </nav>
    </Affix>
  );
};
