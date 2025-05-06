"use client";
import { CaretRightOutlined } from "@ant-design/icons";
import BannerComponent from "@components/banner/banner.component";
import { AppFooter } from "@components/footer/footer";
import { AppFootnote } from "@components/footnote/footnote";
import { AppNav } from "@components/nav/nav.component";
import { BASE_URL_UPLOADS_MEDIA } from "@constants/api-url";
import { IService } from "@domain/models/service.model";
import { serviceAPI } from "@store/api/service_api";
import { Collapse, Empty, Spin, Typography } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiArrowRightCircle } from "react-icons/fi";
import "swiper/css";
import styles from "../service.module.css";
import { format } from "@utils/format";
import ServiceList from "@components/service/service-list.component";

const { Panel } = Collapse;

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

  if (isLoadingService || isFetchService || isLoading || isFetching) {
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
                  className="w-100 img-fluid rounded-3 shadow-lg"
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

              <div className="d-none d-md-block help-box d-flex flex-column justify-content-center align-items-center">
                <i className="bi bi-headset help-icon"></i>
                <h4>Have a Question?</h4>
                <p className="d-flex align-items-center mt-2 mb-0">
                  <i className="bi bi-telephone me-2"></i>{" "}
                  <span>{format.number(+237681289411)}</span>
                </p>
                <p className="d-flex align-items-center mt-1 mb-0">
                  <i className="bi bi-envelope me-2"></i>{" "}
                  <a href="mailto:info@cumitech.com">info@cumitech.com</a>
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
                  src={`${BASE_URL_UPLOADS_MEDIA}/${service?.imageUrl}`}
                  alt={service?.title}
                  className="img-fluid services-img"
                  style={{ minHeight: 500, width: "100%" }}
                />
                <h3>{service?.title}</h3>
                <p>{service?.description}</p>
                <Collapse
                  bordered={false}
                  expandIcon={({ isActive }) => (
                    <CaretRightOutlined rotate={isActive ? 90 : 0} />
                  )}
                  className={styles.serviceAccordion}
                  activeKey={0}
                >
                  <Panel
                    header={
                      <Typography.Title level={4} style={{ marginBottom: 0 }}>
                        View Services
                      </Typography.Title>
                    }
                    key="0"
                  >
                    <ul className={styles.serviceList}>
                      {service.items.map((item: any, i: number) => (
                        <li key={i} style={{ marginBottom: 0 }}>
                          <Typography.Title
                            level={5}
                            style={{ marginBottom: 0 }}
                          >
                            {item}
                          </Typography.Title>
                        </li>
                      ))}
                    </ul>
                  </Panel>
                </Collapse>
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

            <div className="d-block d-md-none">
              <div className="help-box d-flex flex-column justify-content-center align-items-center">
                <i className="bi bi-headset help-icon"></i>
                <h4>Have a Question?</h4>
                <p className="d-flex align-items-center mt-2 mb-0">
                  <i className="bi bi-telephone me-2"></i>{" "}
                  <span>{format.number(+237681289411)}</span>
                </p>
                <p className="d-flex align-items-center mt-1 mb-0">
                  <i className="bi bi-envelope me-2"></i>{" "}
                  <a href="mailto:info@cumitech.com">info@cumitech.com</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <!-- /Service Details Section --> */}

      {/* services list */}
      <ServiceList services={services} />

      <AppFooter logoPath="/" />
      <AppFootnote />
    </>
  );
}
