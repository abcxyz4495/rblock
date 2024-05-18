import { Chapter, Course } from "@/model/User.model";
import { CourseSidebarItem } from "./course-sidebar-item";

interface CourseSidebarProps {
	course: Course & {
		chapters: Chapter[];
	};
}

export const CourseSidebar = ({ course }: CourseSidebarProps) => {
	// console.log(course);
	return (
		<div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
			<div className="p-8 flex flex-col border-b">
				<h1 className="font-semibold">{course.title}</h1>
			</div>
			<div className="flex flex-col w-full">
				{course.chapters.map((chp: Chapter) => (
					<CourseSidebarItem
						key={chp?._id.toString()}
						id={chp._id.toString()}
						label={chp.title as string}
						courseId={course._id.toString()}
					/>
				))}
			</div>
		</div>
	);
};
