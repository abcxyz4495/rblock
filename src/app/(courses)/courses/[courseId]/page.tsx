import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import { CourseModel } from "@/model/User.model";
import UserModel from "@/model/User.model";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { resolve } from "path";

const Page = async ({ params }: { params: { courseId: string } }) => {
	const session = await getServerSession(authOptions);

	await dbConnect();
	let course;
	if (session?.user.role === "admin") {
		course = await CourseModel.findById(params.courseId).populate("chapters");
	} else if (session?.user.role === "user") {
		const user = (await UserModel.findById(session?.user?._id)) as any;
		if (user?.course.toString() == params.courseId) {
			course = (await CourseModel.findById(params.courseId).populate(
				"chapters"
			)) as any;
		}
		if (!course) return redirect("/");
	} else return redirect("/");

	if (!course?.chapters || !course?.chapters[0]?._id)
		if (session.user.role === "admin") {
			return redirect(`/admin/courses/${course._id}`);
		} else return redirect("/");
	return redirect(
		`/courses/${course?._id}/chapters/${course?.chapters[0]?._id}`
	);
};

export default Page;
