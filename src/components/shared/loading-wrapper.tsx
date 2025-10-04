"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Spin } from "antd";
import { optimizedSetTimeout } from "@utils/performance";

interface LoadingWrapperProps {
  children: React.ReactNode;
}

export default function LoadingWrapper({ children }: LoadingWrapperProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

const handleStart = useCallback(() => setIsLoading(true), []);
  const handleComplete = useCallback(() => setIsLoading(false), []);

useEffect(() => {
    // Listen for route changes
    const originalPush = router.push;
    const originalReplace = router.replace;

router.push = (...args) => {
      handleStart();
      originalPush.apply(router, args);
      // Use optimized setTimeout for better performance
      optimizedSetTimeout(handleComplete, 30);
    };

router.replace = (...args) => {
      handleStart();
      originalReplace.apply(router, args);
      // Use optimized setTimeout for better performance
      optimizedSetTimeout(handleComplete, 30);
    };

return () => {
      router.push = originalPush;
      router.replace = originalReplace;
    };
  }, [router, handleStart, handleComplete]);

if (isLoading) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999
      }}>
        <Spin size="large" />
      </div>
    );
  }

return <>{children}</>;
}
