"use client";
import React from "react";
import { Spin } from "antd";

interface LoadingSpinnerProps {
  size?: "small" | "default" | "large";
  tip?: string;
  fullscreen?: boolean;
  spinning?: boolean;
  minHeight?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "large",
  tip = "Loading...",
  fullscreen = false,
  spinning = true,
  minHeight = "65vh",
  className = "",
}) => {
  const containerStyle: React.CSSProperties = {
    minHeight,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    ...(fullscreen && {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 9999,
      backgroundColor: "rgba(255, 255, 255, 0.8)",
    }),
  };

return (
    <div style={containerStyle} className={className}>
      <Spin size={size} tip={tip} spinning={spinning} />
    </div>
  );
};

export default LoadingSpinner;
