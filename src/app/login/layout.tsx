// import authOptions from "@app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import React from "react";
import authOptions from "../../lib/options";

export default async function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const data = await getData();

  if (data.session?.user) {
    return redirect("/");
  }

  return <>{children}</>;
}

async function getData() {
  const session = await getServerSession(authOptions);

  return {
    session,
  };
}

