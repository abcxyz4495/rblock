'use client'

import { ConfirmModal } from "@/components/model/confirm-modal";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { getErrorMessage } from "@/helper/errorHelper";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const UserActions = ({ userId }: { userId: string }) => {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const onDelete = async () => {
		try {
			setIsLoading(true);
			await axios.delete(`/api/users/${userId}`);
			toast({
				variant: "success",
				description: "User deleted successfully",
			});
			router.refresh();
			router.push(`/admin/users`);
		} catch (error: unknown) {
			toast({ variant: "destructive", description: getErrorMessage(error) });
		} finally {
			setIsLoading(false);
		}
	};
	
	return (
		<div className="flex items-center gap-x-2">
			<ConfirmModal onConfirm={onDelete}>
				<Button size="sm" disabled={isLoading}>
					<Trash className="h-4 w-4" />
				</Button>
			</ConfirmModal>
		</div>
	);
};

export default UserActions;
