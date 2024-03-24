// import { AuthPage } from "@components/auth-page";
import { LoginForm } from "@components/auth-page/login-form.component";
import { authProviderServer } from "@providers/auth-provider";
import { Card, Col, Row } from "antd";

import { redirect } from "next/navigation";

export default async function Login() {
  const data = await getData();

  if (data.authenticated) {
    redirect(data?.redirectTo || "/");
  }

  return (
    <>
      <Row justify={"center"} align={"middle"} style={{ minHeight: "100vh" }}>
        <Col xs={20} md={18} lg={16}>
          <Card bordered={false} hoverable style={{ margin: "5rem auto" }}>
            <LoginForm />
          </Card>
        </Col>
      </Row>
    </>
  );
}

async function getData() {
  const { authenticated, redirectTo, error } = await authProviderServer.check();

  return {
    authenticated,
    redirectTo,
    error,
  };
}
