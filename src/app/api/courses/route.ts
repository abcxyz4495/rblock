import { getErrorMessage } from "@/helper/errorHelper";
import dbConnect from "@/lib/dbConnect";
import { CourseModel } from "@/model/User.model";
import { ApiResponse } from "@/types/ApiResponse";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
	await dbConnect();
	try {
		const { title } = await request.json();
		if (!title)
			return ApiResponse({
				success: false,
				status: 400,
				error: "Title is required",
			});
		const checkCourse = await CourseModel.find({ title });

		if (checkCourse.length)
			return ApiResponse({
				success: false,
				status: 409,
				error: "Course already present name conflict",
			});
		const newCourse = await CourseModel.create({ title });

		return ApiResponse({
			success: true,
			status: 201,
			message: "Created successfully",
			data: { id: newCourse._id },
		});
	} catch (error: unknown) {
		const msg = getErrorMessage(error);
		console.log("Error", msg);
		return ApiResponse({ success: false, status: 400, error: msg });
	}
}
