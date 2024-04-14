import React from "react";
import { Card, Button } from "antd";
import { IProject } from "@models/project";
import { API_URL_UPLOADS_PROJECTS } from "@constants/api-url";
import Link from "next/link";
import { FaHandPointRight } from "react-icons/fa6";

type Prop = {
  project: IProject;
};
const ProjectCard: React.FC<Prop> = ({ project }) => {
  //each project card will display the title, a button, date, location, and description
  return (
    <Card
      cover={
        <img
          src={`${API_URL_UPLOADS_PROJECTS}/${project.imageUrl}`}
          alt={project.title}
          style={{ maxWidth: "100%", height: "auto", objectFit: "cover" }}
        />
      }
      style={{ margin: "16px" }}
      bordered={false}
      hoverable
      styles={{
        actions: {
          textAlign: "left",
          padding: "0 24px",
        },
      }}
      actions={[
        <Button href={project.deployUrl} className="default-btn">
          Visit Website
        </Button>,
        <Button href={project.githubUrl} className="default-btn">
          View Source Code
        </Button>,
      ]}
    >
      <Link
        href={`/projects/${project.id}`}
        className="h5 text-wrap"
      >
        <FaHandPointRight /> {project.title}
      </Link>
      <p style={{ marginBottom: 0, marginTop: 15 }}>{project.description.slice(0, 275)}</p>
    </Card>
  );
};

export default ProjectCard;
