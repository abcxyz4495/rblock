"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export const Attachments = ({ pdfURL }: { pdfURL: string | undefined }) => {
	const [viewAttachment, setViewAttachment] = useState(false);
	console.log(viewAttachment);
	return (
		<div className="flex flex-col">
			<Button
				className="h-9 w-28"
				onClick={() => setViewAttachment((prev) => !prev)}
			>
				Attachments
			</Button>
      <div>{pdfURL && viewAttachment ? <iframe src={pdfURL}></iframe> : viewAttachment ? <>Attachments are unavailable</> : <></>}</div>
		</div>
	);
};
