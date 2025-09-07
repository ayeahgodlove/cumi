import { Metadata } from "next";
import AuthorPageComponent from "@components/page-components/author-page.component";

interface AuthorPageProps {
  params: { username: string };
}

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const username = params.username;
  
  return {
    title: `${username} - Author Profile | Cumi Digital Solutions`,
    description: `Learn more about ${username}, a talented author and content creator at Cumi Digital Solutions. Discover their expertise in web development, technology, and digital innovation.`,
    keywords: ["author profile", "content creator", "web development expert", "technology writer", username],
    openGraph: {
      title: `${username} - Author Profile | Cumi Digital Solutions`,
      description: `Learn more about ${username}, a talented author and content creator at Cumi Digital Solutions. Discover their expertise in web development, technology, and digital innovation.`,
      type: "profile",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: `${username} - Author Profile | Cumi Digital Solutions`,
      description: `Learn more about ${username}, a talented author and content creator at Cumi Digital Solutions. Discover their expertise in web development, technology, and digital innovation.`,
    },
  };
}

export default function AuthorPage({ params }: AuthorPageProps) {
  return <AuthorPageComponent username={params.username} />;
}
