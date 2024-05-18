import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { getErrorMessage } from "@/helper/errorHelper";

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			id: "credentials",
			name: "Credentials",
			credentials: {
				userid: { label: "userid", type: "text" },
				password: { label: "password", type: "password" },
			},
			async authorize(credentials: any): Promise<any> {
				await dbConnect();

				try {
					const user = await UserModel.findOne({
						userid: credentials.userid,
					}).select("+password");
					console.log(user);
					if (!user) {
						throw new Error("User not found");
					}

					const isPasswordCorrect = credentials.password === user.password;

					if (isPasswordCorrect) {
						return user;
					} else {
						throw new Error("Incorrect password");
					}
				} catch (error: unknown) {
					console.error(getErrorMessage(error));
				}
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token._id = user._id?.toString();
				token.userid = user.userid;
				token.role = user.role;
			}
			return token;
		},
		async session({ session, token }) {
			if (token) {
				session.user._id = token._id;
				session.user.userid = token.userid;
				session.user.role = token.role;
			}
			return session;
		},
	},
	session: { strategy: "jwt", maxAge: 1000 * 60 * 60 * 2 },
	pages: { signIn: "/sign-in" },
	jwt: { secret: process.env.NEXTAUTH_SECRET },
};
