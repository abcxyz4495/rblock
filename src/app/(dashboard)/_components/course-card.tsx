"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export function CourseCard({
	id,
	title,
	imageURL,
}: {
	id: string;
	title: string;
	imageURL: string | undefined;
}) {
	const router = useRouter();
	function handleClick() {
		router.refresh();
		router.push(`/courses/${id}`);
	}
	return (
		<div
			className="text-center h-56 w-44 sm:h-96 sm:w-64 cursor-pointer mb-5"
			onClick={handleClick}
		>
			<div className="h-full w-full flex-shrink-0 rounded-md border bg-slate-950 p-2">
				<div className="w-full h-full rounded-md flex flex-col gap-y-2 relative">
					{imageURL ? (
						<iframe
							src={imageURL || ""}
							width={100}
							height={100}
							className="absolute w-full h-full bg-[#0e1628] rounded-md object-cover object-center"
						/>
					) : (
						<div className="w-full h-full bg-[#0e1628] rounded-md flex justify-center items-center text-white">
							{title}
						</div>
					)}
					<div
						className="absolute w-full h-full left-0 top-0 bg-transparent z-10 rounded-md"
						onClick={handleClick}
					></div>
				</div>
			</div>
			<h4 className="text-slate-900 text-sm font-semibold">
				{title.toUpperCase()}
			</h4>
		</div>
	);
}
