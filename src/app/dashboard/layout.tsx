import { getServerSession } from "next-auth/next";
import React from "react";
import authOptions from "../../lib/options";
import RoleBasedLayout from "../../components/layout-role-based";

export default async function Layout({ children }: React.PropsWithChildren) {
  const data = await getData();

  // Let RoleBasedLayout handle all authentication and role-based routing
  return (
    <RoleBasedLayout>{children}</RoleBasedLayout>
  );
}

async function getData() {
  const session = await getServerSession(authOptions);
  return {
    session,
  };
}
