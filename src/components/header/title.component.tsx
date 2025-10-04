"use client";
import { useLink, useRouterContext, useRouterType } from "@refinedev/core";
import React from "react";

type TitleProps = {
  collapsed: boolean;
};

export const Title: React.FC<TitleProps> = ({ collapsed }) => {
  const routerType = useRouterType();
  const Link = useLink();
  const { Link: LegacyLink } = useRouterContext();

const ActiveLink = routerType === "legacy" ? LegacyLink : Link;

return (
    <ActiveLink to="/">
      {collapsed ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src="/cumi-green.jpg"
            alt="Cumi website logo"
            style={{
              margin: "0 auto",
              padding: "12px 0",
              maxHeight: "65.5px",
              width: "auto",
            }}
          />
        </div>
      ) : (
        <img
          src="/cumi-green.jpg"
          alt="Cumi website logo"
          style={{
            width: "180px",
            height: "auto",
            padding: "12px 24px",
          }}
        />
      )}
    </ActiveLink>
  );
};
