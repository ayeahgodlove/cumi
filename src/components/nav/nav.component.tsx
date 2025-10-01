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
    fontWeight: pathname === path ? "600" : "500",
    letterSpacing: "0.3px",
    transition: "all 0.3s ease",
    position: "relative" as const,
  });

  const getLinkClassName = (path: string) => 
    `nav-link ${pathname === path ? " active fw-bold" : ""}`;

  const userMenuItems = [
    {
      key: "username",
      label: (
        <div
          style={{
            padding: "12px 16px",
            fontWeight: "600",
            color: "#1890ff",
            borderBottom: "1px solid #f0f0f0",
            marginBottom: "8px",
            background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
            borderRadius: "8px 8px 0 0",
          }}
        >
          <div style={{ fontSize: "15px", fontWeight: "600", letterSpacing: "0.3px" }}>
            {session?.user?.name || session?.user?.email || t('nav.user')}
          </div>
          {session?.user?.role && (
            <div
              style={{
                fontSize: "12px",
                color: "#666",
                fontWeight: "500",
                textTransform: "capitalize",
                marginTop: "4px",
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
    // Only show dashboard link for non-user roles
    ...(session?.user?.role !== 'user' ? [{
      key: "dashboard",
      icon: <DashboardOutlined style={{ fontSize: "16px" }} />,
      label: (
        <Link 
          href="/dashboard" 
          style={{ 
            fontWeight: "500",
            letterSpacing: "0.3px",
            fontSize: "14px"
          }}
        >
          {t('nav.dashboard')}
        </Link>
      ),
    }] : []),
    {
      key: "settings",
      icon: <SettingOutlined style={{ fontSize: "16px" }} />,
      label: (
        <Link 
          href="/dashboard/settings"
          style={{ 
            fontWeight: "500",
            letterSpacing: "0.3px",
            fontSize: "14px"
          }}
        >
          {t('nav.settings')}
        </Link>
      ),
    },
    {
      type: "divider" as const,
    },
    {
      key: "logout",
      icon: <LogoutOutlined style={{ fontSize: "16px" }} />,
      label: (
        <span style={{ 
          fontWeight: "500",
          letterSpacing: "0.3px",
          fontSize: "14px",
          color: "#ff4d4f"
        }}>
          {t('nav.logout')}
        </span>
      ),
      onClick: handleLogout,
      danger: true,
    },
  ];
  return (
    <Affix offsetTop={0}>
      <nav 
        className="navbar navbar-expand-lg navbar-full-width" 
        style={{ 
          backgroundColor: "white",
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
          transition: "box-shadow 0.3s ease",
        }}
      >
        <div className="container-fluid" style={{ 
          width: "100%", 
          maxWidth: "none", 
          padding: "8px 16px"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "nowrap"
          }}>
            <Link href={"/"} style={{ flexShrink: 0, order: 1 }}>
              <Image
                src={`${logoPath || '/'}cumi-green.jpg`}
                height={60}
                width={120}
                quality={100}
                alt="CumiTech Logo"
                priority
                style={{ 
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
              style={{ flexShrink: 0, order: 2, marginLeft: 'auto' }}
            >
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>
          <div className="collapse navbar-collapse" id="navbarSupportedContent" style={{ overflow: "hidden" }}>
            <ul className="navbar-nav me-auto mb-2 mb-lg-0" style={{ 
              gap: "4px",
              flexWrap: "nowrap",
              overflow: "auto",
              scrollbarWidth: "none",
              msOverflowStyle: "none"
            }}>
              <li className="nav-item">
                <Link
                  className={`nav-link  ${
                    pathname === "/" ? " active fw-bold" : ""
                  }`}
                  style={{
                    color: pathname === "/" ? "#20b2aa" : "inherit",
                    fontWeight: pathname === "/" ? "600" : "500",
                    letterSpacing: "0.3px",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    transition: "all 0.3s ease",
                    position: "relative",
                    whiteSpace: "nowrap",
                    fontSize: "15px",
                  }}
                  aria-current="page"
                  href="/"
                  onMouseEnter={(e) => {
                    if (pathname !== "/") {
                      e.currentTarget.style.backgroundColor = "#f5f5f5";
                      e.currentTarget.style.color = "#20b2aa";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (pathname !== "/") {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "inherit";
                    }
                  }}
                >
                  {t('nav.welcome')}
                </Link>
              </li>
              {[
                { path: "/our_services", label: t('nav.services') },
                { path: "/projects", label: t('nav.projects') },
                { path: "/blog_posts", label: t('nav.blog_posts') },
                { path: "/opportunities", label: t('nav.opportunities') },
                { path: "/events", label: t('nav.events') },
                { path: "/courses", label: t('nav.courses') },
                { path: "/about_us", label: t('nav.about_us') },
                { path: "/contact_us", label: t('nav.contact_us') },
              ].map(({ path, label }) => (
                <li className="nav-item" key={path}>
                  <Link
                    className={getLinkClassName(path)}
                    style={{
                      ...getLinkStyle(path),
                      padding: "8px 12px",
                      borderRadius: "8px",
                      whiteSpace: "nowrap",
                      fontSize: "15px",
                    }}
                    href={path}
                    onMouseEnter={(e) => {
                      if (pathname !== path) {
                        e.currentTarget.style.backgroundColor = "#f5f5f5";
                        e.currentTarget.style.color = "#20b2aa";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (pathname !== path) {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "inherit";
                      }
                    }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="d-flex flex-sm-column flex-md-row align-items-center" style={{ flexShrink: 0 }}>
              <Space size="small">
                <LanguageSelector />
                {status === "loading" ? (
                  <Button 
                    loading 
                    size="large" 
                    shape="round"
                    style={{
                      fontWeight: "500",
                      letterSpacing: "0.3px",
                      height: "42px",
                      padding: "0 24px",
                    }}
                  >
                    {t('common.loading')}
                  </Button>
                ) : session ? (
                  <Dropdown
                    menu={{ 
                      items: userMenuItems,
                      style: {
                        borderRadius: "10px",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                        padding: "4px",
                        minWidth: "200px"
                      }
                    }}
                    placement="bottomRight"
                    arrow={{ pointAtCenter: true }}
                  >
                    <Space 
                      className="cursor-pointer"
                      style={{
                        padding: "4px 8px",
                        borderRadius: "24px",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#f5f5f5";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      <Avatar
                        size={44}
                        src={session.user?.image}
                        icon={<UserOutlined />}
                        style={{ 
                          backgroundColor: "#1890ff",
                          border: "2px solid #f0f0f0",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                        }}
                      />
                    </Space>
                  </Dropdown>
                ) : (
                  <Button
                    className="primary-btn"
                    shape="round"
                    href="/login"
                    size="large"
                    style={{
                      fontWeight: "500",
                      letterSpacing: "0.3px",
                      height: "42px",
                      padding: "0 28px",
                      boxShadow: "0 2px 8px rgba(32, 178, 170, 0.2)",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(32, 178, 170, 0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 2px 8px rgba(32, 178, 170, 0.2)";
                    }}
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
