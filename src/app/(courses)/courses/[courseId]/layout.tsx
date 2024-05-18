import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { CourseModel } from "@/model/User.model";
import UserModel, { Chapter } from "@/model/User.model";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import { CourseSidebar } from "../_components/course-sidebar";
import { CourseNavbar } from "../_components/course-navbar";

const layout = async ({
	children,
	params,
}: {
	children: React.ReactNode;
	params: { courseId: string };
}) => {
	const session = await getServerSession(authOptions);
	if (!session?.user?._id) return redirect("/");
	let course: any;
	let courseData: any;
	if (session.user.role === "admin") {
		course = await CourseModel.findById(params.courseId).populate("chapters");
		courseData = {
			_id: course._id.toString(),
			title: course?.title,
			description: course?.description,
			chapters: course.chapters,
			isPublished: course.isPublished,
			createdAt: course.createdAt,
		};
	} else if (session.user.role === "user") {
		const user = await UserModel.findById(session.user._id);
		if (user && user.course && user?.course.toString() !== params.courseId) {
			return redirect("/");
		}
		course = (await CourseModel.findOne({
			_id: params.courseId,
			isPublished: true,
		}).populate("chapters")) as any;

		courseData = {
			_id: params.courseId,
			title: course?.title,
			description: course?.description,
			chapters: course.chapters.filter(
				(chp: Chapter) => chp.isPublished === true
			),
			isPublished: course.isPublished,
			createdAt: course.createdAt,
		};
	}
	if (!course) return redirect("/");

	return (
		<div className="h-full">
			<div className="h-[80px] md:pl-80 fixed inset-y-0 w-full z-50">
				<CourseNavbar course={courseData} />
			</div>
			<div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
				<CourseSidebar course={courseData} />
			</div>
			<main className="md:pl-80 pt-[80px] h-full">{children}</main>
		</div>
	);
};

export default layout;
