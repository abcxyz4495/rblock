"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Pencil, PlusCircle } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { getErrorMessage } from "@/helper/errorHelper";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Chapter } from "@/model/User.model";
import ChapterList from "./chapter-list";

interface ChapterFormProps {
	initialData: {
		chapters: Chapter[];
	};
	courseId: string;
}

const formSchema = z.object({
	title: z.string().min(1, { message: "Title is required" }),
});

export const ChapterForm = ({ initialData, courseId }: ChapterFormProps) => {
	const { toast } = useToast();
	const router = useRouter();
	const [isCreating, setIsCreating] = useState(false);
	const toggleCreating = () => setIsCreating((prev) => !prev);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
		},
	});
	const { isSubmitting, isValid } = form.formState;

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			await axios.post(`/api/courses/${courseId}/chapters`, values);
			toast({
				variant: "success",
				description: "Chapter created successfully",
			});
			toggleCreating();
			form.resetField("title");
			router.refresh();
		} catch (error: unknown) {
			const errorMessage = getErrorMessage(error);
			toast({ variant: "destructive", description: errorMessage });
		}
	};

	const onEdit = (id: string) => {
		router.push(`/admin/courses/${courseId}/chapters/${id}`);
	};

	return (
		<div className="mt-6 border bg-slate-100 rounded-md p-4">
			<div className="font-medium flex items-center justify-between">
				Course Chapters
				<Button onClick={toggleCreating} variant="ghost">
					{isCreating ? (
						<>Cancel</>
					) : (
						<>
							<PlusCircle className="h-4 w-4 mr-2" />
							Add a Chapter
						</>
					)}
				</Button>
			</div>

			{isCreating && (
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4 mt-4"
					>
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											disabled={isSubmitting}
											placeholder="Introduction to course"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button disabled={!isValid || isSubmitting} type="submit">
							Create
						</Button>
					</form>
				</Form>
			)}
			{!isCreating && (
				<div
					className={cn(
						"text-sm mt-2",
						!initialData?.chapters?.length && "text-slate-500 italic"
					)}
				>
					{!initialData.chapters?.length && "No chapters"}
					<ChapterList onEdit={onEdit} list={initialData.chapters} />
				</div>
			)}
		</div>
	);
};
