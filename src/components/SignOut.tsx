"use client";

import { signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

function SignOut() {
	const handleSignOut = async () => {
		await signOut();
	};

	return (
		<Button
			className={cn(
				"mt-2 px-4 duration-300 cursor-pointer absolute left-0 bottom-3 right-0 mx-4"
			)}
			onClick={handleSignOut}
		>
			<i className="bi bi-bookmark-fill"></i>
			<span className="text-[15px] text-gray-200">Logout</span>
		</Button>
	);
}

export default SignOut;
