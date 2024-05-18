// import { getServerSession } from "next-auth";
// import { uploadFileInStorage } from "@/firebase";

// import { authOptions } from "@/app/api/auth/[...nextauth]/options";
// import { ApiResponse } from "@/types/ApiResponse";
// import dbConnect from "@/lib/dbConnect";
// import { CourseModel } from "@/model/User.model";
// import { getErrorMessage } from "@/helper/errorHelper";

// export async function PATCH(
// 	request: Request,
// 	{ params }: { params: { courseId: string } }
// ) {
// 	try {
// 		const session = await getServerSession(authOptions);
// 		const userId = session?.user._id;
// 		const { courseId } = params;

// 		const data = await request.formData();

// 		const file: File | null = data.get("image") as unknown as File;
// 		const refId: string = data.get("refId") as string;
// 		if (!userId) {
// 			return ApiResponse({
// 				success: false,
// 				status: 403,
// 				error: "Access Forbidden",
// 			});
// 		}

// 		if (!file || !refId) {
// 			return ApiResponse({ success: false, status: 404, error: "Not Found" });
// 		}

// 		await dbConnect();

// 		let updatedCourseData = {};

// 		const uploadedFileData = await uploadFileInStorage(
// 			"courseImage",
// 			refId,
// 			file
// 		);
// 		console.log("PATCHING...1", uploadedFileData);
// 		if (uploadedFileData.success) {
// 			const { url: public_url, id } = uploadedFileData;

// 			updatedCourseData = { imageURL: { public_url, id } };
// 		} else {
// 			return ApiResponse({
// 				success: false,
// 				status: 400,
// 				error: uploadedFileData.error,
// 			});
// 		}

// 		const course = await CourseModel.findByIdAndUpdate(
// 			courseId,
// 			updatedCourseData,
// 			{ new: true, runValidators: true }
// 		);

// 		console.log("Updated Course", course);

// 		return ApiResponse({
// 			success: true,
// 			status: 201,
// 			message: "Course updated successfully",
// 			data: course,
// 		});
// 	} catch (error: unknown) {
// 		const errorMessage = getErrorMessage(error);
// 		return ApiResponse({
// 			success: false,
// 			status: 500,
// 			error: errorMessage,
// 		});
// 	}
// }
