import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
export { default } from "next-auth/middleware";

export async function middleware(req: NextRequest) {
	const token = await getToken({ req });
	const { pathname } = req.nextUrl;

	console.log("[MIDDLEWARE_TOKEN]:", token, "| [PATHNAME]:", pathname);

	if (token && pathname === "/sign-in")
		return NextResponse.redirect(new URL("/", req.url));
	else if (token && token.role === "user" && pathname.startsWith("/admin"))
		return NextResponse.redirect(new URL("/", req.url));
	// else return NextResponse.rewrite(new URL("/sign-in", req.url));
}

export const config = {
	matcher: [
		"/((?!api|_next/static|_next/image|favicon.ico|auth/|access-denied).*)",
	],
};
