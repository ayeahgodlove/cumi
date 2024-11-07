import React from "react";
import { Card } from "antd";
import { IProject } from "@domain/models/project.model";
import { API_URL_UPLOADS_MEDIA } from "@constants/api-url";
import Link from "next/link";
import { FaHandPointRight } from "react-icons/fa6";
import Image from "next/image";

type Prop = {
  project: IProject;
};
const ProjectCard: React.FC<Prop> = ({ project }) => {
  //each project card will display the title, a button, date, location, and description
  return (
    <Card
      key={project.id}
      cover={
        <Image
          height={500}
          width={1200}
          quality={100}
          src={`${API_URL_UPLOADS_MEDIA}/${project.imageUrl}`}
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
        <Link
          href={project.deployUrl}
          target="_blank"
          className="default-btn rounded-2"
          key={"link-1"}
        >
          Visit Website
        </Link>,
        <Link
          href={project.githubUrl}
          target="_blank"
          className="default-btn rounded-2"
          key={"link-2"}
        >
          View Source Code
        </Link>,
      ]}
    >
      <Link href={`/projects/${project.id}`} className="h5 text-wrap">
        <FaHandPointRight /> {project.title}
      </Link>
      <p style={{ marginBottom: 0, marginTop: 15 }}>
        {project.description.slice(0, 275)}
      </p>
    </Card>
  );
};

export default ProjectCard;
