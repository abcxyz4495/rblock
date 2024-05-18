import { getServerSession } from "next-auth";
import { LayoutDashboard, ListChecks } from "lucide-react";
import { redirect } from "next/navigation";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import { CourseModel, Course, Chapter } from "@/model/User.model";
import { getErrorMessage } from "@/helper/errorHelper";
import { IconBadge } from "@/components/icon-badge";
import { TitleForm } from "./_components/title-form";
import { DescriptionForm } from "./_components/description-form";
import ImageForm from "./_components/image-form";
import { ChapterForm } from "./_components/chapter-form";
import Banner from "@/components/banner";
import Actions from "./_components/actions";
import { ChapterModel } from "@/model/User.model";
import mongoose from "mongoose";

interface CourseSlugProps {
	params: {
		courseId: string;
	};
}

export default async function Page({ params }: CourseSlugProps) {
	try {
		const session = await getServerSession(authOptions);
		if (session?.user?.role === "admin") {
			await dbConnect();

			const course = await CourseModel.findById(params.courseId).populate(
				"chapters"
			) as any;

			console.log("Course", course);

			if (!course || !course.title) return redirect("/");

			const requiredFields = [
				course.title,
				course.description,
				course.imageURL,
			];

			const courseData = {
				id: course._id.toString(),
				title: course.title, 
				description: course.description,
				isPublished: course.isPublished,
				imageURL: course.imageURL,
				chapters:
					(course.chapters.map((chapter: Chapter) => {
						return {
							_id: chapter._id.toString(),
							title: chapter.title,
							isPublished: chapter.isPublished,
						};
					}) as Chapter[]) || [],
			};

			const totalFields = requiredFields.length;
			const completedFields = requiredFields.filter(Boolean).length;

			const completionText = `(${completedFields}/${totalFields})`;

			const isComplete =
				course.title &&
				course.chapters.length &&
				course.chapters.filter((chp: Chapter) => chp.isPublished === true)
					.length > 0;

			return (
				<>
					{!course.isPublished && (
						<Banner label="This is unpublished. It will not be visible to the students." />
					)}
					<div className="p-6">
						<div className="flex items-center justify-between">
							<div className="flex flex-col gap-y-2">
								<h1 className="text-2xl font-medium">Course setup</h1>
								<span className="text-sm text-slate-700">
									Complete all fields {completionText}
								</span>
							</div>
							<Actions
								disabled={!isComplete}
								courseId={params.courseId}
								isPublished={course.isPublished}
							/>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
							<div>
								<div className="flex items-center gap-x-2">
									<IconBadge icon={LayoutDashboard} />
									<h2 className="text-2xl">Customize your course</h2>
								</div>
								<TitleForm initialData={courseData} courseId={course.id} />
								<DescriptionForm
									initialData={courseData}
									courseId={course.id}
								/>
								<ImageForm initialData={courseData} courseId={course.id} />
							</div>
							<div className="space-y-6">
								<div>
									<div className="flex items-center gap-x-2">
										<IconBadge icon={ListChecks} />
										<h2 className="text-xl">Course chapters</h2>
									</div>
									<ChapterForm initialData={courseData} courseId={course.id} />
								</div>
							</div>
						</div>
					</div>
				</>
			);
		} else {
			return redirect("/admin/courses");
		}
	} catch (error: unknown) {
		console.error("Error", error);
		const errorMessage = getErrorMessage(error);
		return redirect("/admin/courses");
	}
}

// http://localhost:3000/admin/courses/663c95a9eeec5d964d4b3546
