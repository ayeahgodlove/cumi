"use client";
import { API_URL } from "@constants/api-url";
import Link from "next/link";
import { Suspense } from "react"; 
import { AppNav } from "@components/nav/nav.component";
import BannerComponent from "@components/banner/banner.component";
import Social from "@components/shared/social";
import { AppFooter } from "@components/footer/footer";
import { AppFootnote } from "@components/footnote/footnote";

export default function IndexPage() {
  return (
    <Suspense>
      <div className="container-fluid mt-3" style={{ width: "100%" }}>
        {/* navigation bar */}
        <AppNav logoPath="/" />
      </div>
      {/* banner */}
      <BannerComponent
        breadcrumbs={[{ label: "About Us", uri: "about_us" }]}
        pageTitle="About Us"
      />
      <div className="container">
        <div className="d-flex justify-content-center">
          <div className="rounded bg-light p-4 text-center">
            <img
              className="mx-auto mb-3 rounded"
              src={`${API_URL}/img/avatar.png`}
              alt={"authors"}
              width={120}
              height={120}
            />
            <h4 className="mb-2">
              <Link href={`/authors/john-doe`}>John Doe</Link>
            </h4>
            <p className="mb-3">this is meta description</p>
            <Social
              source={[
                {
                  name: "facebook",
                  icon: "FaFacebook",
                  link: "https://www.facebook.com/",
                },
                {
                  name: "twitter",
                  icon: "FaTwitter",
                  link: "https://twitter.com/",
                },
                {
                  name: "github",
                  icon: "FaGithub",
                  link: "https://www.github.com/",
                },
                {
                  name: "linkedin",
                  icon: "FaLinkedin",
                  link: "https://www.linkedin.com/",
                },
              ]}
              className="nav d-flex justify-content-center social-icons"
            />
          </div>
        </div>
      </div>
      <AppFooter logoPath="/" />
      <AppFootnote />
    </Suspense>
  );
}
