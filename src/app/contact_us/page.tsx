import { Metadata } from "next";
import ContactUsPageComponent from "@components/page-components/contact-us-page.component";

export const metadata: Metadata = {
  title: "Contact Us - Cumi Digital Solutions",
  description: "Get in touch with Cumi for your digital project needs. Contact our team for web development, mobile apps, and technology solutions.",
  keywords: ["contact cumi", "get in touch", "digital solutions", "web development contact", "technology consultation"],
  openGraph: {
    title: "Contact Us - Cumi Digital Solutions",
    description: "Get in touch with Cumi for your digital project needs. Contact our team for web development, mobile apps, and technology solutions.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us - Cumi Digital Solutions",
    description: "Get in touch with Cumi for your digital project needs. Contact our team for web development, mobile apps, and technology solutions.",
  },
};

export default function ContactUsPage() {
  return <ContactUsPageComponent />;
}
