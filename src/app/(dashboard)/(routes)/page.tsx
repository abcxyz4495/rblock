import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel, { CourseModel, Course } from "@/model/User.model";
import { getServerSession } from "next-auth";
import React from "react";
import { CourseCard } from "../_components/course-card";

async function Page() {
	const session = await getServerSession(authOptions);

	let course: Course[];
	let container;
	await dbConnect();
	if (session?.user.role === "admin") {
		course = await CourseModel.find({});
		if (course.length)
			container = (
				<div className="flex justify-center items-center h-full gap-3 p-5 md:g-10 flex-wrap">
					{course.length &&
						course?.map((crs) => (
							<CourseCard
								key={crs?._id.toString()}
								title={crs?.title}
								imageURL={crs?.imageURL}
								id={crs?._id.toString()}
							/>
						))}
				</div>
			);
		else
			container = (
				<div className="w-full h-full flex justify-center items-center text-slate-900 font-semibold text-lg">
					No Course Found
				</div>
			);
	} else if (session?.user.role === "user") {
		const user: any = await UserModel.findOne({
			_id: session.user._id,
		}).populate("course");
		if (user?.course.isPublished)
			container = (
				<div className="flex justify-center items-center h-full">
					<CourseCard
						title={user.course?.title}
						imageURL={user.course?.imageURL}
						id={user.course._id.toString()}
					/>
				</div>
			);
		else
			container = (
				<div className="w-full h-full flex justify-center items-center text-slate-900 font-semibold text-lg">
					No Course Found
				</div>
			);
	} else
		container = (
			<div className="w-full h-full flex justify-center items-center text-slate-900 font-semibold text-lg">
				No Course Found
			</div>
		);
	return container;
}

export default Page;
