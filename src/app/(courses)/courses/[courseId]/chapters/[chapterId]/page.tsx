import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { Separator } from "@/components/ui/separator";
import { ChapterModel } from "@/model/User.model";
import { CourseModel } from "@/model/User.model";
import UserModel from "@/model/User.model";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import { Attachments } from "../../../_components/attachments";

const Page = async ({
	params,
}: {
	params: { courseId: string; chapterId: string };
}) => {
	const session = await getServerSession(authOptions);
	if (!session?.user._id) return redirect("/");
	let chapter;
	if (session?.user.role === "admin") {
		chapter = await ChapterModel.findById(params.chapterId);
	} else if (session?.user.role === "user") {
		const user = (await UserModel.findById(session?.user?._id)) as any;
		if (user?.course.toString() == params.courseId) {
			const course = await CourseModel.findById(params.courseId);
			if (
				course?.chapters.filter(
					(chp: any) => chp?.toString() === params.chapterId
				).length
			) {
				chapter = await ChapterModel.findById(params.chapterId);
			}
			if (!course) return redirect("/");
		}
	} else return redirect("/");

	return (
		<div className="flex flex-col max-w-4xl mx-auto pb-20">
			<div className="p-4">
				<div className="relative aspect-video transition">
					<div className="absolute inset-0 flex items-center justify-center bg-slate-800">
						<iframe src={chapter?.videoURL} className="h-full w-full"></iframe>
					</div>
				</div>

				<div className="p-4 flex flex-col md:flex-row items-center justify-between">
					<h2 className="text-2xl font-semibold mb-2">{chapter?.title}</h2>
				</div>
				<Separator />
				<div className="p-4 flex flex-col md:flex-row items-center justify-between">
					<p className="text-md font-medium mb-2">
						{chapter?.description || "Lorem"}
					</p>
				</div>
				<div className="flex justify-center items-center">
					<Attachments pdfURL={chapter?.pdfURL} />
				</div>
			</div>
		</div>
	);
};

export default Page;
