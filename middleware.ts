export { default } from "next-auth/middleware";

// Protect all dashboard, preferences, analytics, and profile routes
export const config = {
    matcher: [
        "/dashboard/:path*",
        "/preferences/:path*",
        "/analytics/:path*",
        "/profile/:path*",
    ],
};
