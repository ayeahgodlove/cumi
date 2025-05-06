"use client";
import BannerComponent from "@components/banner/banner.component";
import { AppFooter } from "@components/footer/footer";
import { AppFootnote } from "@components/footnote/footnote";
import { AppNav } from "@components/nav/nav.component";
import { serviceAPI } from "@store/api/service_api";
import { Spin } from "antd";
import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import { useEffect } from "react";
import "swiper/css";
import ServiceList from "@components/service/service-list.component";

export default function IndexPage() {
  const {
    data: services,
    isLoading: isLoadingService,
    isFetching: isFetchService,
  } = serviceAPI.useFetchAllServicesQuery(1);

  // const pathname = usePathname();
  // const router = useRouter();

  // useEffect(() => {
  //   if (services && services.length > 0) {
  //     // Example: Navigate to the first service's detail page
  //     const firstService = services[0];
  //     const newPath = `our_services/${firstService.slug}#service-details`;

  //     // Programmatically navigate to the new path
  //     router.push(newPath);
  //   }
  // }, [services, pathname, router]);

  if (isLoadingService || isFetchService) {
    return (
      <div
        style={{
          minHeight: "65vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin size="large" tip="Loading..." fullscreen spinning />
      </div>
    );
  }
  return (
    <>
      <div className="container-fluid mt-3" style={{ width: "100%" }}>
        {/* navigation bar */}
        <AppNav logoPath="/" />
      </div>

      {/* banner */}
      <BannerComponent
        breadcrumbs={[{ label: "Services", uri: "our_services" }]}
        pageTitle="Our Services"
      />
      {/* page */}

      {/* call-t-action */}
      <section className="mb-5">
        <div className="container">
          <div className="rounded bg-light p-4 p-xl-5 dark:bg-darkmode-theme-light">
            <div className="row align-items-center justify-content-between">
              <div className="mb-4 col-md-5 col-lg-4 order-md-2">
                <img
                  className="w-100 img-fluid rounded-3"
                  style={{ maxHeight: 300 }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  src={`/img/christopher-gower-m_HRfLhgABo-unsplash.jpg`}
                  alt="cta-image"
                />
              </div>
              <div className="col-md-7 order-md-1">
                <h2 className="mb-2">
                  Ready to build your next project with Cumi?
                </h2>
                <p className="mb-3">
                  Experience the future of web development with Nextplate and
                  Next. Build lightning-fast static sites with ease and
                  flexibility.
                </p>
                <Link
                  className="btn btn-lg px-5 btn-dark rounded-pill"
                  href="https://wa.me/237681289411"
                  target="_blank"
                >
                  Contact us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* services list */}
      <ServiceList services={services} />
      {/* footer */}
      <AppFooter logoPath="/" />
      <AppFootnote />
    </>
  );
}
