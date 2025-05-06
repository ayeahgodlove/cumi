import React from "react";
import { Card, Tag, Tooltip, Typography } from "antd";
import { IProject } from "@domain/models/project.model";
import { BASE_URL_UPLOADS_MEDIA } from "@constants/api-url";
import Link from "next/link";

import { GithubOutlined, GlobalOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;
type Prop = {
  project: IProject;
  index: number;
  styles: any;
};

const colors = ["magenta", "purple", "volcano", "geekblue", "cyan", "gold"];
const ProjectCard: React.FC<Prop> = ({ project, index, styles }) => {
  //each project card will display the title, a button, date, location, and description
  return (
    <Card
      hoverable
      cover={
        <img
          alt={project.title}
          src={`${BASE_URL_UPLOADS_MEDIA}/${project.imageUrl}`}
          className={`card-img-top ${styles.projectImage}`}
        />
      }
      className={`shadow-lg border-0 ${styles.projectCard}`}
      styles={{ body: { padding: "1.2rem" } }}
    >
      <Title level={4} className={styles.projectTitle}>
        <Link href={`/projects/${project.id}`} className={styles.projectTitleLink}>
          {project.title}
        </Link>
      </Title>
      <Paragraph ellipsis={{ rows: 3 }}>{project.description}</Paragraph>
      <div className="d-flex justify-content-between mt-3">
        <Tooltip title="GitHub">
          <Link
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="d-flex align-items-center"
          >
            <GithubOutlined style={{ fontSize: "20px", color: "#555" }} />{" "}
            <span style={{ marginLeft: 3}}>Code</span>
          </Link>
        </Tooltip>
        <Tooltip title="Live Demo">
          <Link
            href={project.deployUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="d-flex align-items-center"
          >
            <GlobalOutlined style={{ fontSize: "20px", color: "#555" }} />{" "}
            <span style={{ marginLeft: 3}}>Live</span>
          </Link>
        </Tooltip>
        <Tag color={colors[index % colors.length]} className="text-uppercase">
          {project.slug}
        </Tag>
      </div>
    </Card>
  );
};

export default ProjectCard;
