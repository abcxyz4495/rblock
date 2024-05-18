import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { ApiResponse } from "@/types/ApiResponse";
import UserModel from "@/model/User.model";
import { getErrorMessage } from "@/helper/errorHelper";
import dbConnect from "@/lib/dbConnect";

export async function PATCH(
	request: Request,
	{ params }: { params: { userId: string } }
) {
	try {
		const session = await getServerSession(authOptions);
		const sessionUserId = session?.user._id;
		const { userId } = params;
		const values = await request.json();
		if (!sessionUserId)
			return ApiResponse({
				success: false,
				status: 403,
				error: "Access Forbidden",
			});
		dbConnect();
		console.log("Values", values);

		const user = await UserModel.findByIdAndUpdate(userId, { ...values });

		console.log("Updated User", user);

		return ApiResponse({
			success: true,
			status: 201,
			message: "Title Updated successfully",
			data: user,
		});
	} catch (error: unknown) {
		const errorMessage = getErrorMessage(error);
		return ApiResponse({
			success: false,
			status: 500,
			error: errorMessage,
		});
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { userId: string } }
) {
	try {
		const session = await getServerSession(authOptions);
		const sessionUserId = session?.user._id;
		const { userId } = params;

		if (!sessionUserId)
			return ApiResponse({
				success: false,
				status: 403,
				error: "Access Forbidden",
			});
		dbConnect();

		await UserModel.findByIdAndDelete(userId);
		return ApiResponse({
			success: true,
			status: 200,
			message: "User deleted successfully",
		});
	} catch (error: unknown) {
		return ApiResponse({
			success: false,
			status: 403,
			error: "Internal Server error",
		});
	}
}
