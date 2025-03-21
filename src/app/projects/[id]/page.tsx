"use client";
import { AppFooter } from "@components/footer/footer";
import { AppFootnote } from "@components/footnote/footnote";
import { AppNav } from "@components/nav/nav.component";
import Disqus from "@components/shared/disqus";
import ImageFallback from "@components/shared/image-fallback";
import Share from "@components/shared/share";
import { BASE_URL_UPLOADS_MEDIA } from "@constants/api-url";
import { projectAPI } from "@store/api/project_api";
import { userAPI } from "@store/api/user_api";
import { Layout, Spin } from "antd";
import Link from "next/link";
import { Suspense } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import slugify from "slugify";

const { Content } = Layout;
export default function IndexPage({ params }: { params: { id: string } }) {
  const {
    data: project,
    isLoading,
    isFetching,
  } = projectAPI.useGetSingleProjectQuery(params.id);

  const { data: user } = userAPI.useGetSingleUserQuery(
    project ? project?.userId : ""
  );

  if (isLoading || isFetching) {
    <Spin size="large" style={{ height: "65vh", width: "100%" }} />;
  }
  return (
    <Suspense fallback={<Spin size="large" />}>
      <div className="container-fluid mt-3" style={{ width: "100%" }}>
        {/* navigation bar */}
        <AppNav logoPath="/../" />

        <Content>
          <section className="section pt-4">
            <div className="container">
              <div className="row justify-content-center">
                <article className="col-lg-10">
                  {project && (
                    <div className="mb-5">
                      <ImageFallback
                        src={`${BASE_URL_UPLOADS_MEDIA}/${project.imageUrl}`}
                        height={500}
                        width={1200}
                        alt={project?.title}
                        className="w-full rounded"
                      />
                    </div>
                  )}
                  <h1 className="mb-2">{project?.title}</h1>
                  <ul className="nav mb-2">
                    <li className="me-3 inline-block">
                      <Link href={`${project?.deployUrl}`}>
                        <FaRegUserCircle
                          className={"-mt-n1 me-2 inline-block"}
                        />
                        Visit Website
                      </Link>
                    </li>

                    <li className="me-3 inline-block">
                      <Link href={`${project?.githubUrl}`}>
                        <FaRegUserCircle
                          className={"-mt-n1 me-2 inline-block"}
                        />
                        View Source Code
                      </Link>
                    </li>
                  </ul>
                  <div className="content mb-3">
                    <div
                      style={{
                        padding: 10,
                        background: "#f2f2f2",
                        fontSize: 18,
                      }}
                      dangerouslySetInnerHTML={{
                        __html: project?.description as any,
                      }}
                    />
                  </div>
                  <div className="row justify-items-start justify-content-between">
                    <div className="flex justify-items-center col-lg-6">
                      <h5 className="mr-1">Share :</h5>
                      <Share
                        className="nav social-icons"
                        title={project?.title as any}
                        description={project?.description}
                        slug={slugify(`${project?.title}`, "_")!}
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
      <AppFooter  logoPath="/../"/>
      <AppFootnote />
    </Suspense>
  );
}
