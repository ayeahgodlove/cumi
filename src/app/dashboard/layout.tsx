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

  // Get user role and implement immediate server-side redirection
  const userRole = data.session.user?.role || "user";
  
  // Define role-specific dashboard paths
  const roleDashboards = {
    admin: "/dashboard",
    creator: "/dashboard/creator", 
    student: "/dashboard/student",
    user: "/dashboard/user",
  };

  const expectedDashboard = roleDashboards[userRole as keyof typeof roleDashboards];
  
  // If user is not on their expected dashboard, redirect immediately
  if (expectedDashboard !== "/dashboard") {
    redirect(expectedDashboard);
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