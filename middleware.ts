import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith("/login") ||
        req.nextUrl.pathname.startsWith("/register");

    // If authenticated and trying to access auth pages, redirect to dashboard
    if (isAuthPage && isAuth) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // If not authenticated and trying to access protected pages, redirect to login
    if (!isAuthPage && !isAuth && req.nextUrl.pathname.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/login", "/register"],
};
