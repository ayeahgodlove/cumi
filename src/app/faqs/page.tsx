import { Metadata } from "next";
import FAQsPageComponent from "@components/page-components/faqs-page.component";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Cumi Digital Solutions",
  description: "Find answers to common questions about our web development services, processes, pricing, and how we can help your business grow with digital solutions.",
  keywords: ["FAQ", "frequently asked questions", "web development questions", "digital solutions", "support", "help"],
  openGraph: {
    title: "Frequently Asked Questions | Cumi Digital Solutions",
    description: "Find answers to common questions about our web development services, processes, pricing, and how we can help your business grow with digital solutions.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Frequently Asked Questions | Cumi Digital Solutions",
    description: "Find answers to common questions about our web development services, processes, pricing, and how we can help your business grow with digital solutions.",
  },
};

export default function FAQsPage() {
  return <FAQsPageComponent />;
}
