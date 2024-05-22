import { IconBadge } from "@/components/icon-badge";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ArrowLeft, User } from "lucide-react";
import Link from "next/link";
import React from "react";
import UserUserId from "../_components/user-userid";
import UserPassword from "../_components/user-password";
import UserRole from "../_components/user-role";
import UserCourse from "../_components/user-course";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/dbConnect";
import UserModel, { Chapter, User as IUser } from "@/model/User.model";
import { CourseModel } from "@/model/User.model";
import UserActions from "../_components/user-actions";

// interface CUSer extends IUser {
// 	courseId: string;
// 	courseTitle: string;
// }

// type DUser = {
// 	userid: string;
// 	password: string;
// 	role: "admin" | "user";
// 	course: string;
// 	courseId: string;
// 	courseTitle: string;
// };

export default async function Page({ params }: { params: { userId: string } }) {
	const session = await getServerSession(authOptions);
	if (session?.user?.role !== "admin") return redirect("/");

	await dbConnect();
	const user = await UserModel.findById(params.userId)
		.select("+password")
		.populate("course") as any;
	if (!user) return redirect("/");
	// console.log('User',user);

	const userData: any = {
		userid: user?.userid,
		password: user?.password,
		role: user?.role as "admin" | "user",
		course: user?.course ? user?.course.title : "",
		courseId: user?.course ? user.course._id.toString() : "",
		courseTitle: user?.course ? user.course.title : "",
	};

	const courses = await CourseModel.find(
		{ isPublished: true },
		{ _id: 1, title: 1 }
	);
	const coursesData = [
		...courses.map((crs) => ({ _id: crs._id.toString(), title: crs.title })),
	];

	// console.log('Course Data', coursesData, 'User Data',  userData);
	// console.log("initialData", userData);

	return (
		<>
			<div className="p-6">
				<div className="flex items-center justify-between">
					<div className="w-full">
						<Link
							href={`/admin/users`}
							className="flex items-center text-sm hover:opacity-75 transition mb-6"
						>
							<ArrowLeft className="h-4 w-4 mr-2" />
							Back to User Dashboard
						</Link>
						<div className="flex items-center justify-between w-full">
							<div className="flex flex-col gap-y-2">
								<h1 className="text-2xl font-medium">Edit User</h1>
							</div>
							<UserActions
								userId={params.userId}
							/>
						</div>
					</div>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
					<div className="space-y-4">
						<div>
							<div className="flex items-center gap-x-2">
								<IconBadge icon={User} />
								<h2 className="text-xl">Update user details</h2>
							</div>
							<UserUserId initialData={userData} userId={params.userId} />
							<UserPassword initialData={userData} userId={params.userId} />
							<UserRole initialData={userData} userId={params.userId} />
							<UserCourse
								initialData={userData}
								userId={params.userId}
								courses={coursesData}
							/>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
