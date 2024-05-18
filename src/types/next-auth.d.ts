import "next-auth";
import { DefaultSession } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
	interface Session {
		user: {
			_id?: string;
			userid?: string;
			role?: "user" | "admin";
		} & DefaultSession["user"];
	}

	interface User {
		_id?: string;
		userid?: string;
		role?: "user" | "admin";
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		_id?: string;
		userid?: string;
		role?: "user" | "admin";
	}
}
