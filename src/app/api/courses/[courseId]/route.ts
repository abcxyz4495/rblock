import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { ApiResponse } from "@/types/ApiResponse";
import dbConnect from "@/lib/dbConnect";
import { Chapter, CourseModel } from "@/model/User.model";
import { getErrorMessage } from "@/helper/errorHelper";
import { ChapterModel } from "@/model/User.model";

export async function PATCH(
	request: Request,
	{ params }: { params: { courseId: string } }
) {
	try {
		const session = await getServerSession(authOptions);
		const userId = session?.user._id;
		const { courseId } = params;
		const values = await request.json();
		if (!userId)
			return ApiResponse({
				success: false,
				status: 403,
				error: "Access Forbidden",
			});
		dbConnect();
		console.log("Values", values);

		const course = await CourseModel.findByIdAndUpdate(
			courseId,
			{ ...values },
			{ new: true, runValidators: true }
		);

		console.log("Updated Course", course);

		return ApiResponse({
			success: true,
			status: 201,
			message: "Title Updated successfully",
			data: course,
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
	{ params }: { params: { courseId: string } }
) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?._id) {
			return ApiResponse({
				success: false,
				status: 403,
				error: "Access Forbidden",
			});
		}
		await dbConnect();

		const courseId = params.courseId;
		const course = await CourseModel.findById(courseId) as any;
		if (!course) {
			return ApiResponse({
				success: false,
				status: 404,
				error: "Course not found",
			});
		}

		await Promise.all([
			CourseModel.findByIdAndDelete(courseId),
			...course.chapters.map((chapterId: Chapter) =>
				ChapterModel.findByIdAndDelete(chapterId)
			),
		]);

		return ApiResponse({
			success: true,
			status: 200,
			message: "Course deleted successfully",
		});
	} catch (error) {
		const errorMessage = getErrorMessage(error);
		return ApiResponse({
			success: false,
			status: 500,
			error: errorMessage,
		});
	}
}

export async function GET(
	req: Request,
	{ params }: { params: { courseId: string } }
) {
	try {
		await dbConnect();

		const course = await CourseModel.findById(params.courseId);
		if (!course) {
			return ApiResponse({
				success: false,
				status: 404,
				error: "Course not found",
			});
		}
		return ApiResponse({
			success: true,
			status: 200,
			data: course,
		});
	} catch (error: unknown) {
		return ApiResponse({
			success: false,
			status: 500,
			error: getErrorMessage(error),
		});
	}
}
