import { Metadata } from "next";
import AboutPageComponent from "@components/page-components/about-page.component";

export const metadata: Metadata = {
  title: "About Us - Cumi Digital Innovation",
  description: "Learn about Cumi's vision to revolutionize the digital landscape with cutting-edge technology solutions for individuals, startups, enterprises, and organizations.",
  keywords: ["about cumi", "digital innovation", "technology company", "web development team", "our vision"],
  openGraph: {
    title: "About Us - Cumi Digital Innovation",
    description: "Learn about Cumi's vision to revolutionize the digital landscape with cutting-edge technology solutions for individuals, startups, enterprises, and organizations.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us - Cumi Digital Innovation",
    description: "Learn about Cumi's vision to revolutionize the digital landscape with cutting-edge technology solutions for individuals, startups, enterprises, and organizations.",
  },
};

export default function AboutPage() {
  return <AboutPageComponent />;
}
