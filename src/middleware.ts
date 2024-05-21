import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
export { default } from "next-auth/middleware";
import {
	DEFAULT_LOGIN_REDIRECT,
	apiAuthPrefix,
	authRoutes,
	publicRoutes,
	adminRoutePrefix
} from "../routes";

export async function middleware(req: NextRequest) {
	const token = await getToken({ req });
	const { pathname } = req.nextUrl;
	const isLoggedIn = !!token;
	const role = token?.role;

	const isApiAuthRoute = pathname.startsWith(apiAuthPrefix);
	const isPublicRoute = publicRoutes.includes(pathname);
	const isAuthRoute = authRoutes.includes(pathname);
	const adminRoute = pathname.startsWith(adminRoutePrefix);

	if (isApiAuthRoute) return NextResponse.next();

	if (isAuthRoute) {
		if (isLoggedIn) {
			return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, req.nextUrl));
		}
		return NextResponse.next();
	}

	if (role !== "admin" && adminRoute) {
		return Response.redirect(new URL("/unauthorized", req.nextUrl));
	}

	if (!isLoggedIn && !isPublicRoute) {
		return Response.redirect(new URL("/sign-in", req.nextUrl));
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/((?!api|_next/static|_next/image|favicon.ico).*)",
		"/((?!.*\\..*|_next).*)",
		"/",
		"/(api|trpc)(.*)",
	],
};
