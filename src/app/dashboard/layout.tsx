import { ThemedLayout } from "@components/themed-layout";
import { authProviderServer } from "@providers/auth-provider";
import { Col, Row } from "antd";
import { redirect } from "next/navigation";
import React from "react";

export default async function Layout({ children }: React.PropsWithChildren) {
  const data = await getData();

  if (!data.authenticated) {
    return redirect(data?.redirectTo || "/login");
  }

  return (
    <ThemedLayout>
      <Row justify={"center"} align={"top"}>
        <Col xs={22} md={18}>
          {children}
        </Col>
      </Row>
    </ThemedLayout>
  );
}

async function getData() {
  const { authenticated, redirectTo } = await authProviderServer.check();

  return {
    authenticated,
    redirectTo,
  };
}
