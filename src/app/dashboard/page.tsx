import React from "react";
import { Authenticated } from "@refinedev/core";
import { NavigateToResource } from "@refinedev/nextjs-router";

export default function IndexPage() {
  return (
    <div>
      <h1>Welcome to the dashboard</h1>
      <Authenticated key="home-page">
        <NavigateToResource />
      </Authenticated>
    </div>
  );
}
