import { Metadata } from "next";
import ProjectsPageComponent from "@components/page-components/projects-page.component";

export const metadata: Metadata = {
  title: "Our Projects - Cumi Digital Portfolio",
  description: "Explore our portfolio of innovative digital projects including web applications, mobile apps, and technology solutions built with cutting-edge technologies.",
  keywords: ["portfolio", "digital projects", "web applications", "mobile apps", "technology solutions", "project showcase"],
  openGraph: {
    title: "Our Projects - Cumi Digital Portfolio",
    description: "Explore our portfolio of innovative digital projects including web applications, mobile apps, and technology solutions built with cutting-edge technologies.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Projects - Cumi Digital Portfolio",
    description: "Explore our portfolio of innovative digital projects including web applications, mobile apps, and technology solutions built with cutting-edge technologies.",
  },
};

export default function ProjectsPage() {
  return <ProjectsPageComponent />;
}
