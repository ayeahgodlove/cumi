import { Metadata } from "next";
import ProjectDetailPageComponent from "@components/page-components/project-detail-page.component";

interface ProjectDetailPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const id = params.id;
  
  return {
    title: `Project ${id} - Cumi Digital Portfolio`,
    description: `Explore this innovative digital project from Cumi's portfolio. Discover cutting-edge web development solutions, mobile applications, and technology implementations.`,
    keywords: ["project portfolio", "web development project", "digital solution", "technology project", "mobile app", "web application"],
    openGraph: {
      title: `Project ${id} - Cumi Digital Portfolio`,
      description: `Explore this innovative digital project from Cumi's portfolio. Discover cutting-edge web development solutions, mobile applications, and technology implementations.`,
      type: "article",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: `Project ${id} - Cumi Digital Portfolio`,
      description: `Explore this innovative digital project from Cumi's portfolio. Discover cutting-edge web development solutions, mobile applications, and technology implementations.`,
    },
  };
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  return <ProjectDetailPageComponent id={params.id} />;
}
