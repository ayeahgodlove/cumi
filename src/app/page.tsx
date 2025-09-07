import { Metadata } from "next";
import HomePageComponent from "@components/page-components/home-page.component";

export const metadata: Metadata = {
  title: "Cumi - Digital Innovation & Web Development Solutions",
  description: "We're committed to revolutionizing the digital landscape, offering cutting-edge solutions tailored to individuals, startups, enterprises, and organizations.",
  keywords: ["web development", "digital innovation", "technology solutions", "startup", "enterprise"],
  openGraph: {
    title: "Cumi - Digital Innovation & Web Development Solutions",
    description: "We're committed to revolutionizing the digital landscape, offering cutting-edge solutions tailored to individuals, startups, enterprises, and organizations.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cumi - Digital Innovation & Web Development Solutions",
    description: "We're committed to revolutionizing the digital landscape, offering cutting-edge solutions tailored to individuals, startups, enterprises, and organizations.",
  },
};

export default function IndexPage() {
  return <HomePageComponent />;
}
