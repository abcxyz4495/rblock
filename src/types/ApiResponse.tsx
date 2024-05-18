import { NextResponse } from "next/server";

type ApiResponseType<T> = {
	success: boolean;
	status: number;
	message?: string;
	error?: string;
	data?: T;
};

export function ApiResponse<T>({
	success,
	status,
	message,
	error,
	data,
}: ApiResponseType<T>) {
	return NextResponse.json(
		{
			success,
			message,
			error,
			data,
		}
	);
}
