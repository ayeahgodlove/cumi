import React from "react";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { BASE_URL_UPLOADS_MEDIA } from "@constants/api-url";
import { IService } from "@domain/models/service.model";
import { Empty } from "antd";

interface IServiceListProps {
  services: IService[];
}
const ServiceList: React.FC<IServiceListProps> = ({ services }) => {
  return (
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
                    <div className="card rounded bg-light shadow border-0">
                      <img
                        src={`${BASE_URL_UPLOADS_MEDIA}/${item.imageUrl}`}
                        alt={item.title}
                        className="card-img-top"
                        style={{ maxHeight: 250 }}
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
                          Learn more
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
  );
};

export default ServiceList;
