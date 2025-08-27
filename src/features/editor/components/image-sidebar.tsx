"use client";

import { AlertTriangle, Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";
import { type ActiveTool, type Editor, fonts } from "@/features/editor/types";
import { useGetImages } from "@/features/images/api/use-get-images";
import { UploadButton } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";
import { ToolSidebarClose } from "./tool-sidebar-close";

interface ImageSidebarProps {
	activeTool: ActiveTool;
	onChangeActiveTool: (tool: ActiveTool) => void;
	editor: Editor | undefined;
}

export const ImageSidebar = ({
	activeTool,
	editor,
	onChangeActiveTool,
}: ImageSidebarProps) => {
	const onClose = useCallback(() => {
		onChangeActiveTool("select");
	}, [onChangeActiveTool]);
	const { data, isLoading, isError } = useGetImages();
	return (
		<aside
			className={cn(
				"bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
				activeTool === "images" ? "visible" : "hidden",
			)}
		>
			<ToolSidebarHeader
				title="Images"
				description="Add Imagas to your canvas"
			/>
			<div className="p-4 border-b">
			<UploadButton
				endpoint="imageUploader"
				onClientUploadComplete={(res) => {
					editor?.addImage(res[0].url);
				}}
				appearance={{
					button: "w-full text-sm font-medium",
					allowedContent: "hidden"
				}}
				content={{
					button: "Upload Image"
				}}
			/>

			</div>
			{isLoading && (
				<div className="flex items-center justify-center flex-1">
					<Loader className="size-4 text-muted-foreground animate-spin" />
				</div>
			)}
			{isError && (
				<div className="flex flex-col gap-y-4 items-center justify-center flex-1">
					<AlertTriangle className="size-4 text-muted-foreground" />
					<p className="text-muted-foreground text-xs">
						Failed to fetch images
					</p>
				</div>
			)}


			<ScrollArea className="flex-1 overflow-y-auto">
				<div className="p-4 grid grid-cols-2 gap-4">
					{data?.map((image) => {
						return (
							<button
								type="button"
								key={image.id}
								className="relative w-full h-[100px] group hover:opacity-75 transition bg-muted rounded-sm overflow-hidden border"
								onClick={() => editor?.addImage(image.urls.regular)}
							>
								<Image
									fill
									src={image.urls.small}
									alt={image.alt_description || ""}
									className="object-cover"
								/>
								<Link
									href={image.links.html}
									target="_blank"
									className="opacity-0 group-hover:opacity-100 absolute left-0 bottom-0 w-full text-[10px] truncate text-white hover:underline p-1 bg-black/50 text-left"
								>
									{image.user.name}
								</Link>
							</button>
						);
					})}
				</div>
			</ScrollArea>

			<ToolSidebarClose onClick={onClose} />
		</aside>
	);
};
