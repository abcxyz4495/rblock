import { authOptions } from "@/app/api/auth/[...nextauth]/options";

import { Button } from "@/components/ui/button";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import { redirect } from "next/navigation";
import { CourseModel } from "@/model/User.model";
import dbConnect from "@/lib/dbConnect";

async function Page() {
	const session = await getServerSession(authOptions);

	if (!session?.user) return redirect("/");

	dbConnect();
	const course = await CourseModel.find({});

	const dupCourse = course.map((crs: any) => {
		return {
			id: crs._id.toString(),
			title: crs.title,
			isPublished: crs.isPublished,
			chapters: crs.chapters.length,
			createdAt: new Date(crs.createdAt),
		};
	});

	if (!course) return redirect("/");

	return session?.user?.role === "admin" ? (
		<div className="p-6">
			<DataTable columns={columns} data={dupCourse} />
		</div>
	) : (
		<div> Loading ... </div>
	);
}

export default Page;
