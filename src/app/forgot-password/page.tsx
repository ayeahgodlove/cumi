import { Metadata } from "next";
import ForgotPasswordComponent from "@components/page-components/forgot-password.component";
import { generatePageMetadata } from "../../lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Forgot Password - Reset Your CUMI Account Password",
  description: "Reset your CUMI account password securely. Enter your email address and we'll send you a link to reset your password and regain access to your account.",
  keywords: [
    "forgot password",
    "password reset",
    "reset password",
    "CUMI account",
    "password recovery",
    "account access",
    "secure password reset",
    "email verification",
    "user authentication"
  ],
  url: "https://cumi.dev/forgot-password"
});

export default function ForgotPasswordPage() {
  return <ForgotPasswordComponent />;
}
