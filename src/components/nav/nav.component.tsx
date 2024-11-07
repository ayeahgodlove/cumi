import { Affix, Button } from "antd";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type Props  = {
  logoPath: string
}
export const AppNav: React.FC<Props> = ({ logoPath}) => {
  const pathname = usePathname();
  return (
    <Affix offsetTop={0}>
      <nav className="navbar bg-white navbar-expand-lg">
        <div className="container-fluid">
          <Link href={"/"}>
            <Image
              src={`${logoPath}cumi-green.jpeg`}
              height={50}
              width={100}
              quality={100}
              alt="Cumi logo"
              style={{ marginRight: 15 }}
            />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 fs-6">
              <li className="nav-item">
                <Link
                  className={`nav-link  ${
                    pathname === "/" ? " active fw-bold text-secondary" : ""
                  }`}
                  aria-current="page"
                  href="/"
                >
                  Welcome
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link  ${
                    pathname === "/our_services"
                      ? " active fw-bold text-secondary"
                      : ""
                  }`}
                  href="/our_services"
                >
                  Services
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link  ${
                    pathname === "/blog_posts"
                      ? " active fw-bold text-secondary"
                      : ""
                  }`}
                  href="/blog_posts"
                >
                  Blog Posts
                </Link>
              </li>
              {/* <li className="nav-item">
                <Link
                  className={`nav-link  ${
                    pathname === "/careers"
                      ? " active fw-bold text-secondary"
                      : ""
                  }`}
                  href="/careers"
                >
                  Careers
                </Link>
              </li> */}
              <li className="nav-item">
                <Link
                  className={`nav-link  ${
                    pathname === "/events"
                      ? " active fw-bold text-secondary"
                      : ""
                  }`}
                  href="/events"
                >
                  Events
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link  ${
                    pathname === "/projects"
                      ? " active fw-bold text-secondary"
                      : ""
                  }`}
                  href="/projects"
                >
                  Projects
                </Link>
              </li>
              {/* <li className="nav-item">
                <Link
                  className={`nav-link  ${
                    pathname === "/courses"
                      ? " active fw-bold text-secondary"
                      : ""
                  }`}
                  href="/courses"
                >
                  Courses
                </Link>
              </li> */}
              <li className="nav-item">
                <Link
                  className={`nav-link  ${
                    pathname === "/about_us"
                      ? " active fw-bold text-secondary"
                      : ""
                  }`}
                  aria-disabled="true"
                  href="/about_us"
                >
                  About Us
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link  ${
                    pathname === "/contact_us"
                      ? " active fw-bold text-secondary"
                      : ""
                  }`}
                  aria-disabled="true"
                  href="/contact_us"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
            <div className="d-flex flex-sm-column flex-md-row">
              <Button
                className="primary-btn"
                shape="round"
                href="/login"
                size="large"
              >
                Log in
              </Button>
            </div>
          </div>
        </div>
      </nav>
    </Affix>
  );
};
