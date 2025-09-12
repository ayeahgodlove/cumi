"use client";
import { GithubOutlined, GlobalOutlined } from "@ant-design/icons";
import { AppFooter } from "@components/footer/footer";
import { AppFootnote } from "@components/footnote/footnote";
import { AppNav } from "@components/nav/nav.component";
import Disqus from "@components/shared/disqus";
import ImageFallback from "@components/shared/image-fallback";
import Share from "@components/shared/share";
import { BASE_URL_UPLOADS_MEDIA } from "@constants/api-url";
import { projectAPI } from "@store/api/project_api";
import { userAPI } from "@store/api/user_api";
import { Layout, Spin, Tooltip } from "antd";
import Link from "next/link";
import slugify from "slugify";

const { Content } = Layout;

interface ProjectDetailPageComponentProps {
  slug: string;
}

export default function ProjectDetailPageComponent({ slug }: ProjectDetailPageComponentProps) {
  const {
    data: project,
    isLoading,
    isFetching,
  } = projectAPI.useGetSingleProjectBySlugQuery(slug);

  const { data: user } = userAPI.useGetSingleUserQuery(
    project ? project?.userId : ""
  );

  if (isLoading || isFetching || !project) {
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
      <div className="container-fluid" style={{ width: "100%" }}>
        {/* navigation bar */}
        <AppNav logoPath="/" />

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
                  <div className="d-flex justify-content-start my-3">
                    <Tooltip title="GitHub">
                      <Link
                        href={project?.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="d-flex align-items-center"
                      >
                        <GithubOutlined
                          style={{ fontSize: "22px", color: "#555" }}
                        />{" "}
                        <span style={{ marginLeft: 3 }}>View Source Code</span>
                      </Link>
                    </Tooltip>
                    <Tooltip title="Live Demo">
                      <Link
                        href={project?.deployUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="d-flex align-items-center"
                        style={{ marginLeft: 30 }}
                      >
                        <GlobalOutlined
                          style={{ fontSize: "22px", color: "#555" }}
                        />{" "}
                        <span style={{ marginLeft: 3 }}>
                          Visit Live Website
                        </span>
                      </Link>
                    </Tooltip>
                  </div>
                  <div className="content mb-3">
                    <div
                      style={{
                        padding: 10,
                        background: "#fff",
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
                  <Disqus
                    className="mt-20"
                    identifier={`${project?.slug}`}
                    title={`${project?.title}`}
                    url={`${window.location.origin}/projects/${project?.slug}`}
                  />
                </article>
              </div>
            </div>
          </section>
        </Content>
      </div>
      <AppFooter logoPath="/" />
      <AppFootnote />
    </>
  );
}
