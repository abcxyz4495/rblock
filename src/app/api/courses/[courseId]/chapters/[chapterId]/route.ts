import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import { ChapterModel, Chapter } from "@/model/User.model";
import { CourseModel } from "@/model/User.model";
import { ApiResponse } from "@/types/ApiResponse";
import mongoose, { Mongoose } from "mongoose";
import { getServerSession } from "next-auth";

export async function PATCH(
	req: Request,
	{ params }: { params: { courseId: string; chapterId: string } }
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
		const values = await req.json();
		await dbConnect();
		const chapter = await ChapterModel.findByIdAndUpdate(
			params.chapterId,
			{ ...values },
			{ new: true, runValidators: true }
		);
		if (!chapter)
			return ApiResponse({
				success: false,
				status: 500,
				error: "Internal Error",
			});
		return ApiResponse({
			success: true,
			status: 200,
			message: "Chapter updated successfully",
		});
	} catch (error: unknown) {
		return ApiResponse({
			success: false,
			status: 500,
			error: "Internal Error",
		});
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { courseId: string; chapterId: string } }
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
		const course = await CourseModel.findByIdAndUpdate(params.courseId, {
			$pull: {
				chapters: new mongoose.Types.ObjectId(params.chapterId),
			},
		});

		if (!course)
			return ApiResponse({
				success: false,
				status: 500,
				error: "Course Internal Error",
			});

		const chapter = await ChapterModel.findByIdAndDelete(params.chapterId);

		if (!chapter)
			return ApiResponse({
				success: false,
				status: 500,
				error: "Chapter Internal Error",
			});

		const validatingCourse = await CourseModel.findById(
			params.courseId
		).populate("chapters") as any;

		if (validatingCourse) {
			if (
				validatingCourse.chapters.filter((chp: Chapter) => chp.isPublished)
					.length == 0
			) {
				await CourseModel.findByIdAndUpdate(params.courseId, {
					isPublished: false,
				});
			}
		}

		return ApiResponse({
			success: true,
			status: 200,
			message: "Chapter deleted successfully",
		});
	} catch (error: unknown) {
		return ApiResponse({
			success: false,
			status: 500,
			error: "Internal Error",
		});
	}
}
