import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { Button } from "@/components/ui/button";
import dbConnect from "@/lib/dbConnect";
import UserModel, { CourseModel, Course } from "@/model/User.model";
import { getServerSession } from "next-auth";
import Link from "next/link";
import React from "react";

async function Page() {
	const session = await getServerSession(authOptions);

	let course: Course[];
	let container;
	await dbConnect();
	if (session?.user.role === "admin") {
		course = await CourseModel.find({});
		if (course.length)
			container = (
				<div>
					{course.length &&
						course?.map((crs) => (
							<Link
								className="p-4"
								key={crs?._id.toString()}
								href={`/courses/${crs?._id.toString()}`}
							>
								<Button>{crs?.title}</Button>
							</Link>
						))}
				</div>
			);
	} else if (session?.user.role === "user") {
		const user: any = await UserModel.findOne({
			_id: session.user._id,
		}).populate("course");
		if (user?.course)
			container = (
				<div>
					<Link className="p-4" href={`/courses/${user.course?._id}`}>
						<Button>{user.course?.title}</Button>
					</Link>
				</div>
			);
	} else container = <div>No Course Found</div>;
	return container;
}

export default Page;
