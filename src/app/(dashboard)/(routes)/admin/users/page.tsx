import { authOptions } from "@/app/api/auth/[...nextauth]/options";

import { Button } from "@/components/ui/button";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import { redirect } from "next/navigation";
import { CourseModel } from "@/model/User.model";
import dbConnect from "@/lib/dbConnect";
import UserModel, { User } from "@/model/User.model";

async function Page() {
	const session = await getServerSession(authOptions);
	console.log(session);

	if (!session?.user) return redirect("/");

	await dbConnect();
	const users = await UserModel.find({}).select("+password");

	const dupUser = users.map((user: User) => {
		return {
			id: user._id.toString(),
			userid: user.userid,
			password: user.password,
			course: user?.course?.toString() || "",
			role: user.role,
		};
	});

	if (!users) return redirect("/");

	return session?.user?.role === "admin" ? (
		<div className="p-6">
			<DataTable columns={columns} data={dupUser} />
		</div>
	) : (
		<div> Loading ... </div>
	);
}

export default Page;
