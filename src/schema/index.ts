import * as z from "zod";

export const LoginSchema = z.object({
	userid: z.string().trim(),
	password: z
		.string()
		.min(8, { message: "Password must be at least 8 characters long" }),
});

export const CreateUserSchema = z.object({
	userid: z.string().trim(),
	password: z
		.string()
		.min(8, { message: "Password must be at least 8 characters long" }),
	role: z.string().trim().optional(),
});
