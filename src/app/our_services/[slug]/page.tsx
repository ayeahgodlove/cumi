"use client";
import BannerComponent from "@components/banner/banner.component";
import { AppFooter } from "@components/footer/footer";
import { AppFootnote } from "@components/footnote/footnote";
import { AppNav } from "@components/nav/nav.component";
import { API_URL, API_URL_UPLOADS_MEDIA } from "@constants/api-url";
import { IService } from "@domain/models/service.model";
import { serviceAPI } from "@store/api/service_api";
import { Empty, Spin } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { FaFilePdf, FaFileWord } from "react-icons/fa6";
import { FiArrowRightCircle } from "react-icons/fi";
import "swiper/css";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

export default function IndexPage({ params }: { params: { slug: string } }) {
  const {
    data: services,
    isLoading: isLoadingService,
    isFetching: isFetchService,
  } = serviceAPI.useFetchAllServicesQuery(1);

  const {
    data: service,
    isLoading,
    isFetching,
  } = serviceAPI.useGetServiceBySlugQuery(params.slug);

  const pathname = usePathname();

  return (
    <Suspense>
      <div className="container-fluid mt-3" style={{ width: "100%" }}>
        {/* navigation bar */}
        <AppNav logoPath="/" />
      </div>

      {/* banner */}
      <BannerComponent
        breadcrumbs={[
          { label: "Services", uri: "our_services" },
          { label: params.slug, uri: "#" },
        ]}
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
                  className="w-100"
                  src={`${API_URL}/img/design-3.jpg`}
                  width={392}
                  height={390}
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
                  href={"/contact_us"}
                >
                  Contact us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <!-- Service Details Section --> */}
      <section id="service-details" className="service-details section mb-5">
        <div className="container">
          <div className="row gy-5">
            <div className="col-lg-4" data-aos="fade-up" data-aos-delay="100">
              <div className="service-box">
                <h4>Serices List</h4>
                <div className="services-list">
                  {services && services.length > 0 ? (
                    services.map((item: IService, index: number) => (
                      <Link
                        href={`/our_services/${item.slug}#service-details`}
                        className={`d-flex justify-content-start align-items-center ${
                          pathname === `/our_services/${item.slug}`
                            ? "active"
                            : ""
                        }`}
                        key={index}
                      >
                        <FiArrowRightCircle
                          style={{ color: "#e84545" }}
                          size={15}
                        />
                        <span style={{ paddingLeft: 10 }}>{item.title}</span>
                      </Link>
                    ))
                  ) : (
                    <>
                      <Link href="#" className="active">
                        <i className="bi bi-arrow-right-circle"></i>
                        <span>Web Design</span>
                      </Link>
                      <Link href="#">
                        <i className="bi bi-arrow-right-circle"></i>
                        <span>Web Design</span>
                      </Link>
                      <Link href="#">
                        <i className="bi bi-arrow-right-circle"></i>
                        <span>Product Management</span>
                      </Link>
                      <Link href="#">
                        <i className="bi bi-arrow-right-circle"></i>
                        <span>Graphic Design</span>
                      </Link>
                      <Link href="#">
                        <i className="bi bi-arrow-right-circle"></i>
                        <span>Marketing</span>
                      </Link>
                    </>
                  )}
                </div>
              </div>
              {/* <!-- End Services List --> */}

              <div className="service-box">
                <h4>Download Catalog</h4>
                <div className="download-catalog">
                  <Link href="#">
                    <FaFilePdf size={15} style={{ color: "#e84545" }} />
                    <span style={{ paddingLeft: 10 }}>Catalog PDF</span>
                  </Link>
                  <Link href="#">
                    <FaFileWord size={15} style={{ color: "#e84545" }} />
                    <span style={{ paddingLeft: 10 }}>Catalog DOC</span>
                  </Link>
                </div>
              </div>
              {/* <!-- End Services List --> */}

              <div className="help-box d-flex flex-column justify-content-center align-items-center">
                <i className="bi bi-headset help-icon"></i>
                <h4>Have a Question?</h4>
                <p className="d-flex align-items-center mt-2 mb-0">
                  <i className="bi bi-telephone me-2"></i>{" "}
                  <span>+1 5589 55488 55</span>
                </p>
                <p className="d-flex align-items-center mt-1 mb-0">
                  <i className="bi bi-envelope me-2"></i>{" "}
                  <a href="mailto:contact@example.com">contact@example.com</a>
                </p>
              </div>
            </div>
            {(isLoading || isFetching) && (
              <Spin size="large" spinning tip="Service details..." />
            )}
            {service ? (
              <div
                className="col-lg-8 ps-lg-5"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <img
                  src={`${API_URL_UPLOADS_MEDIA}/${service?.imageUrl}`}
                  alt={service?.title}
                  className="img-fluid services-img"
                />
                <h3>{service?.title}</h3>
                <p>{service?.description}</p>
              </div>
            ) : (
              <div
                className="col-lg-8 ps-lg-5"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <Empty />
              </div>
            )}
          </div>
        </div>
      </section>
      {/* <!-- /Service Details Section --> */}

      <AppFooter logoPath="/" />
      <AppFootnote />
    </Suspense>
  );
}
