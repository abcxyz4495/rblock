import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getErrorMessage } from "@/helper/errorHelper";
import dbConnect from "@/lib/dbConnect";
import { ChapterModel } from "@/model/User.model";
import { CourseModel } from "@/model/User.model";
import { ApiResponse } from "@/types/ApiResponse";
import { getServerSession } from "next-auth";

export async function POST(
	request: Request,
	{ params }: { params: { courseId: string } }
) {
	try {
		const session = await getServerSession(authOptions);
		const userId = session?.user._id;

		await dbConnect();

		if (!userId)
			return ApiResponse({
				success: false,
				status: 401,
				error: "Access Unauthorized",
			});

		const values = await request.json();
		console.log("Values", values);

		const { courseId } = params;

		const chapter = await ChapterModel.create({ ...values });

		const updatedCourse = await CourseModel.findByIdAndUpdate(
			{ _id: courseId },
			{ $push: { chapters: chapter._id } }
		);

		if (!updatedCourse) {
			await ChapterModel.findByIdAndDelete(chapter._id);
			return ApiResponse({
				success: false,
				status: 400,
				error: "Course not found",
			});
		}

		return ApiResponse({
			success: true,
			status: 201,
			message: `Chapter created ${chapter._id}`,
			data: updatedCourse,
		});
	} catch (error: unknown) {
		return ApiResponse({
			success: false,
			status: 400,
			error: getErrorMessage(error),
		});
	}
}
