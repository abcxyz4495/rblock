import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel, { CourseModel, Course } from "@/model/User.model";
import { getServerSession } from "next-auth";
import React from "react";
import { CourseCard } from "../_components/course-card";
import Link from "next/link";
import { FaWhatsappSquare } from "react-icons/fa";

async function Page() {
	const session = await getServerSession(authOptions);

	let course: Course[];
	let container;
	await dbConnect();
	if (session?.user.role === "admin") {
		course = await CourseModel.find({});
		if (course.length)
			container = (
				<div className="flex justify-center items-center h-[90%] gap-3 p-5 md:g-10 flex-wrap">
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
				<div className="w-full h-[90%] flex justify-center items-center text-slate-900 font-semibold text-lg">
					No Course Found
				</div>
			);
	} else if (session?.user.role === "user") {
		const user: any = await UserModel.findOne({
			_id: session.user._id,
		}).populate("course");
		if (user?.course && user?.course?.isPublished)
			container = (
				<div className="flex justify-center items-center h-full w-full">
					<CourseCard
						title={user.course?.title}
						imageURL={user.course?.imageURL}
						id={user.course._id.toString()}
					/>
				</div>
			);
		else
			container = (
				<div className="w-full h-[90%] flex justify-center items-center text-slate-900 font-semibold text-lg">
					No Course Found
				</div>
			);
	} else
		container = (
			<div className="w-full h-[90%] flex justify-center items-center text-slate-900 font-semibold text-lg">
				No Course Found
			</div>
		);
	return (
		<div className="w-full h-full relative">
			{container}{" "}
			<div className="flex justify-end absolute bottom-0 right-0">
				<Link
					href={"https://wa.me/+917045820468"}
					className="mr-4 mb-5 p-0 shadow-xl rounded"
				>
					<FaWhatsappSquare className="h-14 w-14 text-emerald-700" />
				</Link>
			</div>
		</div>
	);
}

export default Page;
