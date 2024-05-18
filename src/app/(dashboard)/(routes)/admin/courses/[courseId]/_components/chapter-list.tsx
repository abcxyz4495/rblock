import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Chapter } from "@/model/User.model";
import { Grip, Pencil } from "lucide-react";
import React from "react";

const ChapterList = ({
	onEdit,
	list,
}: {
	onEdit: (id: string) => void;
	list: Chapter[];
}) => {
	return (
		<div>
			{list.map((chapter) => (
				<div
					key={chapter.title}
					className={cn(
						"flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm",
						chapter.isPublished && "bg-sky-100 border-sky-200 text-sky-700"
					)}
				>
					<div
						className={cn(
							"px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition",
							chapter.isPublished && "border-r-sky-200 hover:bg-sky-200"
						)}
					>
						<Grip className="h-5 w-5" />
					</div>
					{chapter.title}
					<div className="ml-auto pr-2 flex items-center gap-x-2">
						<Badge
							className={cn(
								"bg-slate-500",
								chapter.isPublished && "bg-sky-700"
							)}
						>
							{chapter.isPublished ? "Published" : "Draft"}
						</Badge>
						<Pencil
							onClick={() => onEdit(chapter._id.toString())}
							className="w-4 h-4 cursor-pointer hover:opacity-75 transition"
						/>
					</div>
				</div>
			))}
		</div>
	);
};

export default ChapterList;
