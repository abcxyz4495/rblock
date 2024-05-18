"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getErrorMessage } from "@/helper/errorHelper";

const formSchema = z.object({
	userid: z.string().min(3),
	password: z.string().min(8),
});

export function CreateUserDialog() {
	const { toast } = useToast();
	const router = useRouter();
	const [isEditing, setIsEditing] = useState(false);
	const toggleEdit = () => setIsEditing((prev) => !prev);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			userid: "",
			password: "",
		},
	});

	const { isSubmitting, isValid } = form.formState;

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		console.log(values)
		try {
			const user = await axios.post(`/api/users/`, values);
			toast({
				variant: "success",
				description: "Chapter updated successfully",
			});
			toggleEdit();
			router.refresh();
			router.push(`/admin/users/${user.data.data._id}`);
		} catch (error: unknown) {
			const errorMessage = getErrorMessage(error);
			toast({ variant: "destructive", description: errorMessage });
		}
	};

	return (
		<DialogContent className="sm:max-w-[425px]">
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<DialogHeader>
					<DialogTitle>Create Profile</DialogTitle>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="userid" className="text-right">
							Userid
						</Label>
						<Input  {...form.register("userid")} className="col-span-3" />
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="password" className="text-right">
							Password
						</Label>
						<Input {...form.register("password")} className="col-span-3" />
					</div>
				</div>
				<DialogFooter>
					<Button disabled={!isValid || isSubmitting} type="submit">
						Create
					</Button>
				</DialogFooter>
			</form>
		</DialogContent>
	);
}
