"use client";

import { ColorModeContext } from "@contexts/color-mode";
import { IUser } from "@domain/models/user";
import type { RefineThemedLayoutV2HeaderProps } from "@refinedev/antd";
import { useGetIdentity } from "@refinedev/core";
import {
  Layout as AntdLayout,
  Avatar,
  Space,
  Switch,
  Typography,
  theme,
} from "antd";
import React, { useContext } from "react";

const { Text } = Typography;
const { useToken } = theme;

// type IUser = {
//   id: string;
//   username: string;
//   avatar: string;
// };

export const Header: React.FC<RefineThemedLayoutV2HeaderProps> = ({
  sticky,
}) => {
  const { token } = useToken();
  const { data: user } = useGetIdentity<IUser>();
  const { mode, setMode } = useContext(ColorModeContext);

  const headerStyles: React.CSSProperties = {
    backgroundColor: token.colorBgElevated,
    display: "flex",
    justifyContent: "flex-end",
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
      <Space>
        <Switch
          checkedChildren="🌛"
          unCheckedChildren="🔆"
          onChange={() => setMode(mode === "light" ? "dark" : "light")}
          defaultChecked={mode === "dark"}
        />
        {/* {(user?.username || user?.avatar) && (
          <Space style={{ marginLeft: "8px" }} size="middle">
            {user?.username && <Text strong>{user.username}</Text>}
            {user?.avatar && <Avatar src={user?.avatar} alt={user?.username} />}
          </Space>
        )} */}
      </Space>
    </AntdLayout.Header>
  );
};
