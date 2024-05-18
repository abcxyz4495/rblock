"use client";

import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function NavbarRoutes() {
	const { data: session } = useSession();
	const pathname = usePathname();

	const isAdmin = pathname.startsWith("/admin");
	const isCourses = pathname.startsWith("/courses");
	const isAdminRole = session?.user?.role === "admin";

	return (
		<div className="flex gap-x-2 ml-auto">
			{isAdmin || isCourses ? (
				<Link href="/">
					<Button size="sm" variant="ghost">
						<LogOut className="h-4 w-4 mr-2" />
						Exit
					</Button>
				</Link>
			) : (
				isAdminRole && (
					<Link href="/admin/courses">
						<Button size="sm" variant="ghost">
							Admin
						</Button>
					</Link>
				)
			)}
			<DropdownMenu>
				<DropdownMenuTrigger>
					<Avatar>
						<AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
						<AvatarFallback>CN</AvatarFallback>
					</Avatar>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuLabel>Hello {session?.user?.userid}</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={() => signOut()}>Logout</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
