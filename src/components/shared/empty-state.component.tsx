"use client";

import React from "react";
import { Empty, Button } from "antd";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";

interface EmptyStateProps {
  title?: string;
  description?: string;
  image?: string;
  showAction?: boolean;
  actionText?: string;
  onAction?: () => void;
  actionIcon?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No data found",
  description = "There are no items to display at the moment.",
  image,
  showAction = false,
  actionText = "Add New Item",
  onAction,
  actionIcon = <PlusOutlined />,
  className = "",
}) => {
  return (
    <div className={`text-center py-8 ${className}`}>
      <Empty
        image={image}
        description={
          <div>
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-gray-500 mb-4">{description}</p>
            {showAction && onAction && (
              <Button
                type="primary"
                icon={actionIcon}
                onClick={onAction}
                size="large"
              >
                {actionText}
              </Button>
            )}
          </div>
        }
      />
    </div>
  );
};

export default EmptyState;
