import { Metadata } from "next";
import OurServicesPageComponent from "@components/page-components/our-services-page.component";

export const metadata: Metadata = {
  title: "Our Services - Cumi Digital Solutions",
  description: "Discover our comprehensive range of digital services including web development, mobile apps, and technology solutions tailored for businesses and individuals.",
  keywords: ["web development services", "mobile app development", "digital solutions", "technology services", "business solutions"],
  openGraph: {
    title: "Our Services - Cumi Digital Solutions",
    description: "Discover our comprehensive range of digital services including web development, mobile apps, and technology solutions tailored for businesses and individuals.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Services - Cumi Digital Solutions",
    description: "Discover our comprehensive range of digital services including web development, mobile apps, and technology solutions tailored for businesses and individuals.",
  },
};

export default function OurServicesPage() {
  return <OurServicesPageComponent />;
}
