import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
export { default } from "next-auth/middleware";

export async function middleware(req: NextRequest) {
	const token = await getToken({ req });
	const { pathname } = req.nextUrl;

	console.log("[MIDDLEWARE_TOKEN]:", token, "| [PATHNAME]:", pathname);

	if (token && token._id && pathname.startsWith("/sign-in")) {
		return NextResponse.rewrite(new URL("/", req.url));
	}
	if (token && token.role !== "admin" && pathname.startsWith("/admin")) {
		return NextResponse.redirect(new URL("/", req.url));
	}
	if (!token && !pathname.startsWith("/sign-in")) {
		return NextResponse.rewrite(new URL("/sign-in", req.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/((?!api|_next/static|_next/image|favicon.ico|auth/|access-denied).*)",
	],
};
