"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCreateProject } from "@/features/projects/api/use-create-project";

export const Banner = () => {
	const mutation = useCreateProject();
	const router = useRouter();
	const onClick = () => {
		mutation.mutate(
			{
				name: "Untitled project",
				json: "",
				width: 900,
				height: 1200,
			},
			{
				onSuccess: ({ data }) => {
					router.push(`/editor/${data.id}`);
				},
			},
		);
	};
	return (
		<div className=" text-white aspect-[5/1] min-h-[248px] flex gap-x-6 p-6 items-center rounded-xl bg-gradient-to-r from-[#2e62cb] via-[#0073ff] to-[#2faff5]">
			<div className="rounded-full hidden md:flex size-28 flex items-center justify-center bg-white/50">
				<div className="rounded-full size-20 flex items-center justify-center bg-white">
					<Sparkles className="h-20 text-[#0073ff] fill-[#0073ff]" />
				</div>
			</div>
			<div className="flex flex-col gap-y-2 text-xl md:text-3xl font-semibold">
				<h1>Visulaze your ideas with Image AI</h1>
				<p className="text-xs md:text-sm mb-2 ">
					Turn inspiration into design in no time. Simply upload an image and
					let AI do the rest
				</p>
				<Button
					variant="secondary"
					className="w-[160px] "
					onClick={onClick}
					disabled={mutation.isPending}
				>
					{" "}
					Start Creating
					<ArrowRight className="size-4 ml-2" />
				</Button>
			</div>
		</div>
	);
};
