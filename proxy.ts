import { withAuth } from "next-auth/middleware";

// Export the middleware function
export default withAuth({
    pages: {
        signIn: "/login",
    },
});

// Protect all dashboard, preferences, analytics, and profile routes
export const config = {
    matcher: [
        "/dashboard/:path*",
        "/preferences/:path*",
        "/analytics/:path*",
        "/profile/:path*",
    ],
};
