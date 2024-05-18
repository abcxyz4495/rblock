import { Chapter, Course } from "@/model/User.model";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { CourseSidebar } from "./course-sidebar";

interface CourseMobileSidebarProps {
	course: Course & {
		chapters: Chapter[];
	};
}

export const CourseMobileSidebar = ({ course }: CourseMobileSidebarProps) => {
	return (
		<Sheet>
			<SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
				<Menu />
			</SheetTrigger>
			<SheetContent className="p-0 bg-white w-72" side="left">
				<CourseSidebar course={course} />
			</SheetContent>
		</Sheet>
	);
};
