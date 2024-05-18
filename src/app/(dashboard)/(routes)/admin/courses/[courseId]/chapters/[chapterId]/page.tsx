import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { IconBadge } from "@/components/icon-badge";
import dbConnect from "@/lib/dbConnect";
import { ChapterModel } from "@/model/User.model";
import { ArrowLeft, FileText, LayoutDashboard, VideoIcon } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import ChapterTitleForm from "../_components/chapter-title-form";
import ChapterDescriptionForm from "../_components/chapter-description-form";
import ChapterVideoForm from "../_components/chapter-video-form";
import ChapterPdfForm from "../_components/chapter-pdf-form";
import { FaFilePdf } from "react-icons/fa";
import Banner from "@/components/banner";
import ChapterActions from "../_components/chapter-actions";

interface PageProps {
	params: {
		courseId: string;
		chapterId: string;
	};
}

const ChapterPage = async ({ params }: PageProps) => {
	const session = await getServerSession(authOptions);
	if (session?.user?.role !== "admin") return redirect("/");

	await dbConnect();
	const chapter = await ChapterModel.findById(params.chapterId);

	if (!chapter) return redirect("/");

	const requiredFields = [
		chapter?.title,
		chapter?.description,
		chapter?.videoURL,
		chapter?.pdfURL,
	];

	const chapterData = {
		_id: chapter._id.toString(),
		title: chapter.title,
		description: chapter.description,
		isPublished: chapter.isPublished,
		videoURL: chapter.videoURL,
		pdfURL: chapter.pdfURL,
	};

	const totalFields = requiredFields.length;
	const completedFields = requiredFields.filter(Boolean).length;
	const completionText = `${completedFields}/${totalFields}`;

	const isComplete = chapter?.videoURL && chapter?.title;

	return (
		<>
			{!chapter.isPublished && (
				<Banner
					variant="warning"
					label="This chapter is unpublished. It will not be visible in the course"
				/>
			)}
			<div className="p-6">
				<div className="flex items-center justify-between">
					<div className="w-full">
						<Link
							href={`/admin/courses/${params.courseId}`}
							className="flex items-center text-sm hover:opacity-75 transition mb-6"
						>
							<ArrowLeft className="h-4 w-4 mr-2" />
							Back to course setup
						</Link>
						<div className="flex items-center justify-between w-full">
							<div className="flex flex-col gap-y-2">
								<h1 className="text-2xl font-medium">Chapter Creation</h1>
								<span className="text-sm text-slate-700">
									Complete all fields {completionText}
								</span>
							</div>
							<ChapterActions
								disabled={!isComplete}
								courseId={params.courseId}
								chapterId={params.chapterId}
								isPublished={chapter.isPublished}
							/>
						</div>
					</div>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
					<div className="space-y-4">
						<div>
							<div className="flex items-center gap-x-2">
								<IconBadge icon={LayoutDashboard} />
								<h2 className="text-xl">Customize your chapter</h2>
							</div>
							<ChapterTitleForm
								initialData={chapterData}
								courseId={params.courseId}
								chapterId={params.chapterId}
							/>
							<ChapterDescriptionForm
								initialData={chapterData}
								courseId={params.courseId}
								chapterId={params.chapterId}
							/>
							<div className="flex items-center gap-x-2 pt-8">
								<IconBadge icon={VideoIcon} />
								<h2 className="text-xl">Add video url</h2>
							</div>
							<ChapterVideoForm
								initialData={chapterData}
								courseId={params.courseId}
								chapterId={params.chapterId}
							/>
						</div>
					</div>
					<div>
						<div className="flex items-center gap-x-2">
							<IconBadge icon={FileText} />
							<h2 className="text-xl">Add pdf url</h2>
						</div>
						<ChapterPdfForm
							initialData={chapterData}
							courseId={params.courseId}
							chapterId={params.chapterId}
						/>
					</div>
				</div>
			</div>
		</>
	);
};

export default ChapterPage;

// http://localhost:3000/admin/courses/663c95a9eeec5d964d4b3546/chapters/663c9725eeec5d964d4b3571
