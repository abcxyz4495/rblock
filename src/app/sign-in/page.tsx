import Image from "next/image";

import Desktop1 from "/public/svg/Desktop1.svg";
import Sciencekidzlogo from "/public/svg/Sciencekidzlogo.svg";
import Form from "./form";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { redirect, useRouter } from "next/navigation";

interface Props {
	searchParams: {
		callbackUrl?: string;
	};
}

export default async function Page({ searchParams }: Props) {
	const session = await getServerSession(authOptions);

	return (
		<div className="relative w-screen h-screen p-0 m-0">
			<Image
				src={Desktop1}
				alt="Desktop-Img"
				className="absolute object-cover object-center w-full h-full left-0 right-0 z-0"
			/>
			<div className="absolute top-0 left-0 w-full h-screen z-10 flex justify-center items-center flex-col lg:flex-row lg:justify-evenly">
				<div className="w-[270px] md:w-[375px]">
					<Image src={Sciencekidzlogo} alt="Science Kidz" />
				</div>
				<div className="w-[375px]">
					<h1 className="text-white font-semibold text-xl lg:text-2xl text-center mb-5">
						User Login
					</h1>
					<Form callbackUrl={searchParams.callbackUrl} />
				</div>
			</div>
		</div>
	);
}
