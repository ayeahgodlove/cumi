"use client";

import React, { useEffect, useState } from "react";
import { Breadcrumb, Button, Space, Tooltip } from "antd";
import { ArrowLeftOutlined, HomeOutlined, LeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

export interface BreadcrumbItem {
  title: string;
  href?: string;
  onClick?: () => void;
}

interface EnhancedBreadcrumbProps {
  items: BreadcrumbItem[];
  showBackButton?: boolean;
  backButtonText?: string;
  style?: React.CSSProperties;
  className?: string;
}

const EnhancedBreadcrumb: React.FC<EnhancedBreadcrumbProps> = ({
  items,
  showBackButton = true,
  backButtonText = "Back",
  style,
  className,
}) => {
  const router = useRouter();
  const [canGoBack, setCanGoBack] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we can go back in browser history and screen size
  useEffect(() => {
    // Check if there's history to go back to
    setCanGoBack(window.history.length > 1);
    
    // Check screen size
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleBackClick = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      // Fallback to home if no history
      router.push("/dashboard/creator");
    }
  };

  const handleBreadcrumbClick = (item: BreadcrumbItem) => {
    if (item.onClick) {
      item.onClick();
    } else if (item.href) {
      router.push(item.href);
    }
  };

  // Convert items to Ant Design breadcrumb format
  const breadcrumbItems = [
    {
      title: (
        <Button
          type="link"
          icon={<HomeOutlined style={{ fontSize: 14 }} />}
          onClick={() => router.push("/dashboard/creator")}
          style={{ 
            padding: '4px 8px',
            height: 'auto',
            borderRadius: 6,
            fontSize: 14,
            fontWeight: 500,
            color: '#1890ff',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f6ffed';
            e.currentTarget.style.color = '#40a9ff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#1890ff';
          }}
        >
          Dashboard
        </Button>
      ),
    },
    ...items.map((item, index) => ({
      title: item.href || item.onClick ? (
        <Button
          type="link"
          onClick={() => handleBreadcrumbClick(item)}
          style={{ 
            padding: '4px 8px',
            height: 'auto',
            borderRadius: 6,
            fontSize: 14,
            fontWeight: 500,
            color: '#1890ff',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f6ffed';
            e.currentTarget.style.color = '#40a9ff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#1890ff';
          }}
        >
          {item.title}
        </Button>
      ) : (
        <span style={{ 
          color: '#666',
          fontSize: 14,
          fontWeight: 500,
          padding: '4px 8px'
        }}>
          {item.title}
        </span>
      ),
    })),
  ];

  return (
    <div 
      style={{ 
        marginBottom: 16, 
        display: 'flex', 
        alignItems: 'center', 
        gap: 16,
        flexWrap: 'wrap',
        minHeight: 40
      }}
    >
      {showBackButton && (
        <Tooltip title={canGoBack ? "Go back to previous page" : "No previous page available"}>
          <div
            onClick={canGoBack ? handleBackClick : undefined}
            style={{
              height: isMobile ? 32 : 36,
              minWidth: isMobile ? 32 : (isMobile ? 36 : 'auto'),
              borderRadius: 8,
              border: '1px solid #d9d9d9',
              backgroundColor: canGoBack ? '#ffffff' : '#f5f5f5',
              color: canGoBack ? '#1890ff' : '#bfbfbf',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: isMobile ? '0 8px' : '0 12px',
              fontSize: 14,
              fontWeight: 500,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: canGoBack ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
              cursor: canGoBack ? 'pointer' : 'not-allowed',
              userSelect: 'none',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={(e) => {
              if (canGoBack) {
                e.currentTarget.style.borderColor = '#40a9ff';
                e.currentTarget.style.backgroundColor = '#f6ffed';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(24, 144, 255, 0.15)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={(e) => {
              if (canGoBack) {
                e.currentTarget.style.borderColor = '#d9d9d9';
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
            onMouseDown={(e) => {
              if (canGoBack) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
              }
            }}
            onMouseUp={(e) => {
              if (canGoBack) {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(24, 144, 255, 0.15)';
              }
            }}
          >
            <LeftOutlined style={{ fontSize: 14, marginRight: isMobile ? 0 : 4 }} />
            {!isMobile && (
              <span style={{ 
                fontSize: 14,
                fontWeight: 500,
                marginLeft: 4
              }}>
                {backButtonText}
              </span>
            )}
          </div>
        </Tooltip>
      )}
      
      <Breadcrumb
        items={breadcrumbItems}
        style={{
          fontSize: "0.9rem",
          textTransform: "capitalize",
          flex: 1,
          minWidth: 0, // Allow breadcrumb to shrink
          ...style,
        }}
        className={className}
      />
    </div>
  );
};

export default EnhancedBreadcrumb;
