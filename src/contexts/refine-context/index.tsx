"use client";

import { SessionProvider } from "next-auth/react";
import { App } from "../../app/_refine_context";
import { FloatButton } from "antd";
import {
  MessageOutlined,
  PhoneOutlined,
  WhatsAppOutlined,
} from "@ant-design/icons";
import { ColorModeContextProvider } from "../color-mode";

export const RefineContext = (props: any) => {
  const defaultMode = props?.defaultMode;

  return (
    <SessionProvider>
      <ColorModeContextProvider defaultMode={defaultMode}>
        <App {...props} />
        <FloatButton.Group
          shape="circle"
          style={{
            insetInlineEnd: 24,
          }}
        >
          <FloatButton
            icon={<WhatsAppOutlined />}
            href="https://wa.me/237673687549"
            target="_blank"
            tooltip="WhatsApp"
            type="primary"
          />
          <FloatButton
            icon={<PhoneOutlined />}
            href="tel:+237673687549"
            target="_blank"
            tooltip="Call Us"
            className="call-us bg-warning"

          />
          <FloatButton
            icon={<MessageOutlined />}
            tooltip="Contact Us"
            href="/contact"
            className="contact-us"
          />
        </FloatButton.Group>
      </ColorModeContextProvider>
    </SessionProvider>
  );
};
