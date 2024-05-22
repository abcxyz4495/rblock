import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getErrorMessage } from "@/helper/errorHelper";
import dbConnect from "@/lib/dbConnect";
import { ChapterModel } from "@/model/User.model";
import { CourseModel } from "@/model/User.model";
import { ApiResponse } from "@/types/ApiResponse";
import { getServerSession } from "next-auth";

export async function PATCH(
	req: Request,
	{ params }: { params: { courseId: string } }
) {
	try {
		const session = await getServerSession(authOptions);
		const userId = session?.user._id;
		if (!userId)
			return ApiResponse({
				success: false,
				status: 404,
				error: "UserId not found",
			});
		await dbConnect();

		const course = await CourseModel.findById(params.courseId) as any;
		if (!course)
			return ApiResponse({
				success: false,
				status: 404,
				error: "Course not found",
			});

		if (!course.title || !course.chapters.length) {
			return ApiResponse({
				success: false,
				status: 400,
				error: "Can't Publish course",
			});
		}
		
		course.isPublished = true;
		await course.save();

		return ApiResponse({
			success: true,
			status: 200,
			message: "Course Published",
		});
	} catch (error: unknown) {
		return ApiResponse({
			success: false,
			status: 400,
			error: getErrorMessage(error),
		});
	}
}
