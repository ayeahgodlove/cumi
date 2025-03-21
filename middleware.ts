import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    console.log(req.nextauth.token);
  },
  {
    pages: {
      signIn: "/login",
      error: "/error",
    },
    callbacks: {
      authorized: ({ token }) => token?.role === "admin",
    },
  }
);

export const config = {
  matcher: ["/api/:path*", "/dashboard/:path*"], // Protect these routes
};
