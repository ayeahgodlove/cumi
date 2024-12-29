"use client";
import { AppFooter } from "@components/footer/footer";
import { AppFootnote } from "@components/footnote/footnote";
import { AppNav } from "@components/nav/nav.component";
import Disqus from "@components/shared/disqus";
import ImageFallback from "@components/shared/image-fallback";
import Share from "@components/shared/share";
import { API_URL_UPLOADS_MEDIA } from "@constants/api-url";
import { emptyBanner } from "@domain/models/banner.model";
import { bannerAPI } from "@store/api/banner_api";
import { eventAPI } from "@store/api/event_api";
import { userAPI } from "@store/api/user_api";
import { format } from "@utils/format";
import { Layout, Spin } from "antd";
import Link from "next/link";
import { Suspense } from "react";
import { FaRegClock, FaRegUserCircle } from "react-icons/fa";
import slugify from "slugify";

const { Content } = Layout;
export default function IndexPage({ params }: { params: { id: string } }) {
  const {
    data: event,
    isLoading,
    isFetching,
  } = eventAPI.useGetSingleEventQuery(params.id);

  const {
    data: banners,
    isLoading: isLoadingBaner,
    isFetching: isFetchBaner,
  } = bannerAPI.useFetchAllBannersQuery(1);

  const { data: user } = userAPI.useGetSingleUserQuery(
    event ? event?.userId : ""
  );

  if (isLoading || isFetching) {
    <Spin size="large" style={{ height: "65vh", width: "100%" }} />;
  }
  return (
    <Suspense fallback={<Spin size="large" />}>
      <div className="container-fluid mt-3" style={{ width: "100%" }}>
        {/* navigation bar */}
        <AppNav logoPath="/../" />

        {/* <BannerDetailComponent
          banner={
            banners
              ? { imageUrl: banners[1].image, title: event?.title }
              : { imageUrl: event?.imageUrl, title: event?.title }
          }
          page={[
            { title: "Blog Posts", path: "/blog_posts" },
            { title: "Details", path: "" },
          ]}
        /> */}

        <Content>
          <section className="section pt-4">
            <div className="container">
              <div className="row justify-content-center">
                <article className="col-lg-10">
                  {event && (
                    <div className="mb-5">
                      <ImageFallback
                        src={`${API_URL_UPLOADS_MEDIA}/${event.imageUrl}`}
                        height={500}
                        width={1200}
                        quality={100}
                        alt={event?.title}
                        className="w-full rounded"
                      />
                    </div>
                  )}
                  <h1 className="mb-2">{event?.title}</h1>
                  <ul className="nav mb-2">
                    <li className="me-3 inline-block">
                      <Link href={`/authors/${slugify(`${user?.username}`)}`}>
                        <FaRegUserCircle
                          className={"-mt-n1 me-2 inline-block"}
                        />
                        {user?.username}
                      </Link>
                    </li>

                    {event && (
                      <li className="me-3 inline-block">
                        <FaRegClock className="-mt-n1 me-2 inline-block" />
                        {format.date(event.eventDate)}
                      </li>
                    )}
                  </ul>
                  <div className="content mb-3">
                    <div
                      style={{
                        padding: 10,
                        background: "#f2f2f2",
                        fontSize: 18,
                      }}
                      dangerouslySetInnerHTML={{
                        __html: event?.description as any,
                      }}
                    />
                  </div>
                  <div className="row justify-items-start justify-content-between">
                    <div className="flex justify-items-center col-lg-6">
                      <h5 className="mr-1">Share :</h5>
                      <Share
                        className="nav social-icons"
                        title={event?.title as any}
                        description={event?.description}
                        slug={slugify(`${event?.title}`, "_")!}
                      />
                    </div>
                  </div>
                  <Disqus className="mt-20" />
                </article>
              </div>
            </div>
          </section>
        </Content>
      </div>
      <AppFooter logoPath="/../" />
      <AppFootnote />
    </Suspense>
  );
}
