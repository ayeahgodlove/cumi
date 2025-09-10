import { Metadata } from "next";
import RegisterPageComponent from "@components/page-components/register-page.component";
import { generatePageMetadata } from "../../lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Register - Create Your CUMI Account",
  description: "Join CUMI and create your account to access our technology courses, events, and career opportunities. Start your journey in software development and digital innovation.",
  keywords: [
    "register",
    "create account",
    "sign up",
    "join CUMI",
    "user registration",
    "account creation",
    "technology platform",
    "software development community",
    "digital learning platform",
    "tech education registration"
  ],
  url: "https://cumi.dev/register"
});

export default function RegisterPage() {
  return <RegisterPageComponent />;
}