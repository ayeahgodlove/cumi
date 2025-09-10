"use client";

import { ColorModeContext } from "@contexts/color-mode";
import { IUser } from "@domain/models/user";
import type { RefineThemedLayoutV2HeaderProps } from "@refinedev/antd";
import { useGetIdentity } from "@refinedev/core";
import {
  Layout as AntdLayout,
  Space,
  Switch,
  theme,
} from "antd";
import React, { useContext } from "react";
import LanguageSwitcher from "../shared/language-switcher";
import UserProfileDropdown from "../shared/user-profile-dropdown";

const { useToken } = theme;

export const Header: React.FC<RefineThemedLayoutV2HeaderProps> = ({
  sticky,
}) => {
  const { token } = useToken();
  const { data: user } = useGetIdentity<IUser>();
  const { mode, setMode } = useContext(ColorModeContext);

  const headerStyles: React.CSSProperties = {
    backgroundColor: token.colorBgElevated,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0px 24px",
    height: "64px",
  };

  if (sticky) {
    headerStyles.position = "sticky";
    headerStyles.top = 0;
    headerStyles.zIndex = 1;
  }

  return (
    <AntdLayout.Header style={headerStyles}>
      {/* Left side - could add logo or title here */}
      <div></div>
      
      {/* Right side - controls */}
      <Space size="middle">
        <LanguageSwitcher />
        <Switch
          checkedChildren="🌛"
          unCheckedChildren="🔆"
          onChange={() => setMode(mode === "light" ? "dark" : "light")}
          defaultChecked={mode === "dark"}
        />
        <UserProfileDropdown />
      </Space>
    </AntdLayout.Header>
  );
};
