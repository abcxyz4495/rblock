"use client";

import { ConfirmModal } from "@/components/model/confirm-modal";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { getErrorMessage } from "@/helper/errorHelper";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ChapterActionsProps {
	disabled: boolean;
	courseId: string;
	chapterId: string;
	isPublished: boolean;
}

export default function ChapterActions({
	disabled,
	courseId,
	chapterId,
	isPublished,
}: ChapterActionsProps) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const onClick = async () => {
		try {
			setIsLoading(true);
			if (isPublished) {
				await axios.patch(
					`/api/courses/${courseId}/chapters/${chapterId}/unpublish`
				);
				toast({ variant: "success", description: "Chapter unpublished" });
			} else {
				await axios.patch(
					`/api/courses/${courseId}/chapters/${chapterId}/publish`
				);
				toast({ variant: "success", description: "Chapter Published" });
			}
			router.refresh();
			router.push(
				`/admin/courses/${courseId}/chapters/${chapterId}?v=${Math.random()}chp-edit`
			);
		} catch (error: unknown) {
			toast({ variant: "destructive", description: getErrorMessage(error) });
		} finally {
			setIsLoading(false);
		}
	};

	const onDelete = async () => {
		try {
			setIsLoading(true);
			await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`);
			toast({
				variant: "success",
				description: "Chapter deleted successfully",
			});
			router.refresh();
			router.push(`/admin/courses/${courseId}?v=${Math.random()}pen_spark`);
		} catch (error: unknown) {
			toast({ variant: "destructive", description: getErrorMessage(error) });
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex items-center gap-x-2">
			<Button
				onClick={onClick}
				disabled={disabled || isLoading}
				variant="outline"
				size="sm"
			>
				{isPublished ? "Unpublished" : "Publish"}
			</Button>
			<ConfirmModal onConfirm={onDelete}>
				<Button size="sm" disabled={isLoading}>
					<Trash className="h-4 w-4" />
				</Button>
			</ConfirmModal>
		</div>
	);
}
