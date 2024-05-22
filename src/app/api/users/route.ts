import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { ApiResponse } from "@/types/ApiResponse";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";

export async function POST(req: Request) {
	try {
		const session = await getServerSession(authOptions);
		const sessionUserId = session?.user._id;
		const values = await req.json();
		if (!sessionUserId)
			return ApiResponse({
				success: false,
				status: 403,
				error: "Access Forbidden",
			});
		await dbConnect();

		const user = await UserModel.findOne({ userid: values.userid });

		if (user) {
			return ApiResponse({
				success: false,
				status: 404,
				error: "User with same userid already exists",
			});
		}
		const newUser = await UserModel.create({ ...values });
		if (!newUser)
			return ApiResponse({
				success: false,
				status: 400,
				error: "Unable to create user",
			});
		return ApiResponse({
			success: true,
			status: 201,
			message: "User Created successfully",
			data: newUser,
		});
	} catch (error: unknown) {
		return ApiResponse({
			success: false,
			status: 500,
			error: "Internal Server Error",
		});
	}
}
