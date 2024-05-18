import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getErrorMessage } from "@/helper/errorHelper";
import dbConnect from "@/lib/dbConnect";
import { ChapterModel } from "@/model/User.model";
import { ApiResponse } from "@/types/ApiResponse";
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
		dbConnect();

		const chapter = await ChapterModel.findById(params.chapterId);
		if (!chapter)
			return ApiResponse({
				success: false,
				status: 404,
				error: "Chapter not found",
			});

		if (!chapter.title || !chapter.videoURL) {
			return ApiResponse({
				success: false,
				status: 400,
				error: "Can't Publish chapter",
			});
		}
		chapter.isPublished = true;
		await chapter.save();

		return ApiResponse({
			success: true,
			status: 200,
			message: "Chapter Published",
		});
	} catch (error: unknown) {
		return ApiResponse({
			success: false,
			status: 400,
			error: getErrorMessage(error),
		});
	}
}
