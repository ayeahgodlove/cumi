import { AppFooter } from "@components/footer/footer";
import { AppFootnote } from "@components/footnote/footnote";
import { AppNav } from "@components/nav/nav.component";
import LoginFormComponent from "./login-form.component";

export default function LoginPageComponent() {

return (
    <>
      {}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Login Page",
            description: "Sign in to your account to access exclusive content, courses, and personalized features.",
            url: "https://yourwebsite.com/login",
            mainEntity: {
              "@type": "WebApplication",
              name: "Login Form",
              description: "Secure login form with email/password and Auth0 authentication",
              applicationCategory: "Authentication",
              operatingSystem: "Web Browser",
            },
          }),
        }}
      />

<div className="container-fluid" style={{ width: "100%" }}>
        {}
        <AppNav logoPath="/" />
      </div>

<LoginFormComponent />

<AppFooter logoPath="/" />
      <AppFootnote />
    </>
  );
}
