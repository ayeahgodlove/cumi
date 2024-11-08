"use client";
import BannerComponent from "@components/banner/banner.component";
import { AppFooter } from "@components/footer/footer";
import { AppFootnote } from "@components/footnote/footnote";
import { AppNav } from "@components/nav/nav.component";
import { API_URL, API_URL_UPLOADS_MEDIA } from "@constants/api-url";
import { IService } from "@domain/models/service.model";
import { serviceAPI } from "@store/api/service_api";
import { Empty } from "antd";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";
import "swiper/css";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

export default function IndexPage() {
  const {
    data: services,
    isLoading: isLoadingService,
    isFetching: isFetchService,
  } = serviceAPI.useFetchAllServicesQuery(1);

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (services && services.length > 0) {
      // Example: Navigate to the first service's detail page
      const firstService = services[0];
      const newPath = `our_services/${firstService.slug}#service-details`;

      // Programmatically navigate to the new path
      router.push(newPath);
    }
  }, [services, pathname, router]);
  return (
    <Suspense>
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

      {/* services */}
      <section className="py-5">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <Swiper
                modules={[Autoplay, Pagination]}
                pagination={{ clickable: true }}
                loop={true}
                centeredSlides={true}
                autoplay={{
                  delay: 2500,
                  disableOnInteraction: false,
                }}
                spaceBetween={24}
                breakpoints={{
                  768: {
                    slidesPerView: 2,
                  },
                  992: {
                    slidesPerView: 3,
                  },
                }}
              >
                {services && services.length > 0 ? (
                  services.map((item: IService, index: number) => (
                    <SwiperSlide key={index}>
                      <div className="card rounded bg-light">
                        <img
                          src={`${API_URL_UPLOADS_MEDIA}/${item.imageUrl}`}
                          alt={item.title}
                          className="card-img-top"
                          style={{ maxHeight: 250 }}
                          // height={100}
                          // width={250}
                        />
                        <div className="card-body">
                          <h3 className="h5 fw-semibold">{item.title}</h3>
                          <blockquote
                            className="mt-3"
                            dangerouslySetInnerHTML={{
                              __html: item.description,
                            }}
                          />
                          <a
                            href={`/our_services/${item.slug}`}
                            className="btn btn-sm btn-dark rounded-pill"
                          >
                            Checkout
                          </a>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))
                ) : (
                  <div className="col-12 empty-wrap">
                    <Empty />
                  </div>
                )}
              </Swiper>
            </div>
          </div>
        </div>
      </section>

      <AppFooter logoPath="/" />
      <AppFootnote />
    </Suspense>
  );
}
