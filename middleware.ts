import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    console.log(req.nextauth.token);
  },
  {
    pages: {
      signIn: "/auth/signin",
      error: "/error",
    },
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access if user has a valid token
        if (!token) return false;
        
        // Check if it's an admin-only route
        const isAdminRoute = req.nextUrl.pathname.startsWith('/dashboard/admin') || 
                           req.nextUrl.pathname.startsWith('/api/admin');
        
        // Admin routes require admin role
        if (isAdminRoute) {
          return token?.role === "admin";
        }
        
        // Student routes require any authenticated user
        const isStudentRoute = req.nextUrl.pathname.startsWith('/dashboard/student') ||
                              req.nextUrl.pathname.startsWith('/dashboard/user') ||
                              req.nextUrl.pathname.startsWith('/dashboard/creator');
        
        if (isStudentRoute) {
          return !!token; // Any authenticated user can access
        }
        
        // API routes - allow authenticated users for most endpoints
        if (req.nextUrl.pathname.startsWith('/api/')) {
          // Admin-only API endpoints
          const adminOnlyAPIs = ['/api/users', '/api/admin', '/api/stats'];
          const isAdminAPI = adminOnlyAPIs.some(path => req.nextUrl.pathname.startsWith(path));
          
          if (isAdminAPI) {
            return token?.role === "admin";
          }
          
          // Other API endpoints - allow authenticated users
          return !!token;
        }
        
        // Default: allow authenticated users
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/api/:path*", "/dashboard/:path*"], // Protect these routes
};
