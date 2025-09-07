import { Metadata } from "next";
import EventDetailPageComponent from "@components/page-components/event-detail-page.component";

interface EventDetailPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: EventDetailPageProps): Promise<Metadata> {
  const id = params.id;
  
  return {
    title: `Event ${id} - Cumi Digital Events`,
    description: `Join this exciting digital event from Cumi. Learn about web development, technology trends, and digital innovation from industry experts and tech professionals.`,
    keywords: ["tech event", "workshop", "web development meetup", "programming event", "technology conference", "digital learning"],
    openGraph: {
      title: `Event ${id} - Cumi Digital Events`,
      description: `Join this exciting digital event from Cumi. Learn about web development, technology trends, and digital innovation from industry experts and tech professionals.`,
      type: "article",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: `Event ${id} - Cumi Digital Events`,
      description: `Join this exciting digital event from Cumi. Learn about web development, technology trends, and digital innovation from industry experts and tech professionals.`,
    },
  };
}

export default function EventDetailPage({ params }: EventDetailPageProps) {
  return <EventDetailPageComponent id={params.id} />;
}
