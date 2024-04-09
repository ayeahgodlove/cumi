"use client";
import { AppNav } from "@components/nav/nav.component";
import { Suspense } from "react";

export default function IndexPage() {
  return (
    <Suspense>
      <div className="container-fluid mt-3" style={{ width: "100%" }}>
        {/* navigation bar */}
        <AppNav />
      </div>

      
    </Suspense>
  );
}
