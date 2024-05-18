"use client";

import { Layout, List, Notebook, User } from "lucide-react";
import { SidebarItem } from "./sidebar-item";
import { usePathname } from "next/navigation";

const userRoutes = [
	{
		icon: Layout,
		label: "Dashboard",
		href: "/",
	},
];

const adminRoutes = [
	{
		icon: List,
		label: "Courses",
		href: "/admin/courses",
	},
	{
		icon: User,
		label: "Users",
		href: "/admin/users",
	},
];

export function SidebarRoutes() {
	const pathname = usePathname();
	const isAdminPage = pathname?.includes("/admin");
	const routes = isAdminPage ? adminRoutes : userRoutes;

	return (
		<div className="flex flex-col w-full">
			{routes.map((route) => (
				<SidebarItem
					key={route.href}
					icon={route.icon}
					label={route.label}
					href={route.href}
				/>
			))}
		</div>
	);
}
