"use client";

import Image from "next/image";
import React, { useRef } from "react";

import { Button } from "@/components/ui/button"

export const FileUpload = ({
	onSubmit,
	image,
	setImage,
}: {
	onSubmit: (file: File) => Promise<void>;
	image: File | null;
	setImage: (file: File | null) => void;
}) => {
	const inputRef = useRef<HTMLInputElement>(null);

	const handleImage = () => {
		if (inputRef.current) inputRef.current.click();
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files?.length) setImage(e.target.files[0]);
	};

	const handleButton = async () => {
		await onSubmit(image as File);
	};

	return (
		<div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
			<div
				className="border border-dashed relative border-gray-400 h-full w-full rounded-md p-10 flex flex-col items-center justify-center"
				style={{ backgroundColor: image ? "" : "#bfdbfe" }}
				onClick={handleImage}
			>
				<input
					ref={inputRef}
					type="file"
					hidden
					accept=".png,.jpg,.jpeg"
					onChange={handleImageChange}
				/>
				{image && (
					<div>
						<Image
							src={URL.createObjectURL(image)}
							alt="Uploaded Image"
							width={200}
							height={150}
							className="absolute left-0 top-0 w-full h-full object-cover rounded z-10"
						/>
						<div className="h-full w-full bg-transparent flex justify-center items-center">
							<Button className="z-20 m-5" onClick={handleButton}>
								Upload
							</Button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};
