"use client";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { getErrorMessage } from "@/helper/errorHelper";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { ImageIcon, Pencil, VideoIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface ChapterVideoFormProps {
	initialData: {
		videoURL: string;
	};
	courseId: string;
	chapterId: string;
}

const formSchema = z.object({
	videoURL: z.string(),
});

const ChapterVideoForm = ({
	initialData,
	courseId,
	chapterId,
}: ChapterVideoFormProps) => {
	const { toast } = useToast();
	const router = useRouter();
	const [isEditing, setIsEditing] = useState(false);
	const toggleEdit = () => setIsEditing((prev) => !prev);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: initialData,
	});

	const { isSubmitting, isValid } = form.formState;

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		values.videoURL = values.videoURL.split("/").includes("view")
			? values.videoURL.replace("view", "preview")
			: values.videoURL;

		console.log(values.videoURL);
		try {
			await axios.patch(
				`/api/courses/${courseId}/chapters/${chapterId}`,
				values
			);
			toast({ variant: "success", description: "Course updated successfully" });
			toggleEdit();
			router.refresh();
		} catch (error: unknown) {
			const errorMessage = getErrorMessage(error);
			toast({ variant: "destructive", description: errorMessage });
		}
	};

	return (
		<div className="mt-6 border bg-slate-100 rounded-md p-4">
			<div className="font-medium flex items-center justify-between">
				Chapter Video
				<Button onClick={toggleEdit} variant="ghost">
					{isEditing ? (
						<>Cancel</>
					) : (
						<>
							<Pencil className="h-4 w-4 mr-2" />
							Edit VideoURL
						</>
					)}
				</Button>
			</div>
			{/* {!isEditing && (
				<p
					className={cn(
						"text-sm mt-2",
						!initialData.videoURL && "text-slate-500 italic"
					)}
				>
					{initialData.videoURL || "No Video"}
				</p>
			)} */}
			{isEditing && (
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4 mt-4"
					>
						<FormField
							control={form.control}
							name="videoURL"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											disabled={isSubmitting}
											placeholder="This course is about ..."
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex items-center gap-x-2">
							<Button disabled={!isValid || isSubmitting} type="submit">
								Save
							</Button>
						</div>
					</form>
				</Form>
			)}
			{!isEditing &&
				(!initialData.videoURL ? (
					<div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
						<VideoIcon className="h-10 w-10 text-slate-500" />
					</div>
				) : (
					<div className="relative aspect-video mt-2">
						<iframe
							src={initialData.videoURL}
							className="object-cover rounded-md h-full w-full"
							title="Video"
						/>
					</div>
				))}
		</div>
	);
};

export default ChapterVideoForm;
