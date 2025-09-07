"use client";

import { ErrorComponent } from "@refinedev/antd";
import { Authenticated } from "@refinedev/core";
import { Suspense } from "react";

import Link from "next/link";

const NotFound = () => {
  return (
    <Suspense>
      <section className="py-5 text-center">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-sm-10 col-md-8 col-lg-6">
              <span className="display-1 fw-bold text-dark">
                404
              </span>
              <h1 className="h2 mb-4">Page not found</h1>
              <div className="mb-4">
                <p>
                  The page you are looking for might have been removed, had its
                  name changed, or is temporarily unavailable.
                </p>
              </div>
              <Link href="/" className="btn btn-primary mt-3">
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Suspense>
  );
};

export default NotFound;
