import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import React from "react";
import authOptions from "../../lib/options";
import RoleBasedLayout from "@components/role-based-layout";

export default async function Layout({ children }: React.PropsWithChildren) {
  const data = await getData();
  
  if (!data.session) {
    redirect("/login");
  }

  return (
    <RoleBasedLayout session={data.session}>
      {children}
    </RoleBasedLayout>
  );
}

async function getData() {
  const session = await getServerSession(authOptions);
  return {
    session,
  };
}