"use client";
import { AlertTriangle, Loader } from "lucide-react";
import Image from "next/image";
import { FaSpinner } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRemoveBgImage } from "@/features/ai/api/use-remove-bg";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";
import type { ActiveTool, Editor } from "@/features/editor/types";
import { cn } from "@/lib/utils";
import { ToolSidebarClose } from "./tool-sidebar-close";

interface RemoveBgSidebarProps {
	activeTool: ActiveTool;
	onChangeActiveTool: (tool: ActiveTool) => void;
	editor: Editor | undefined;
}

export const RemoveBgSidebar = ({
	activeTool,
	editor,
	onChangeActiveTool,
}: RemoveBgSidebarProps) => {
	const selectedObject = editor?.selectedObjects[0];
	// @ts-expect-error _originalElement not recognized by fabric types
	const imageSrc = selectedObject?._originalElement?.currentSrc;
	const mutation = useRemoveBgImage();

	const onClose = () => {
		onChangeActiveTool("select");
	};
	const onClick = () => {
		/// TODO: Block with paywall if no credits left
		mutation.mutate(
			{
				image: imageSrc!,
			},
			{
				onSuccess: ({ data }) => {
					editor?.addImage(data);
				},
			},
		);
	};

	return (
		<aside
			className={cn(
				"bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
				activeTool === "remove-bg" ? "visible" : "hidden",
			)}
		>
			<ToolSidebarHeader
				title="Remove Background"
				description="remove background using AI"
			/>

			{!imageSrc && (
				<div className="flex flex-col gap-y-4 items-center justify-center flex-1 ">
					<AlertTriangle className="size-4 text-muted-foreground" />

					<p className="text-muted-foreground text-xs">
						Feature not available for this object
					</p>
				</div>
			)}
			{imageSrc && (
				<ScrollArea>
					<div className="p-4 space-y-4">
						<div
							className={cn(
								"relative aspect-square rounded-md overflow-hidden transition bg-muted",
								false && "opacity-50",
							)}
						>
							<Image src={imageSrc} fill alt="Image" className="object-cover" />
						</div>
						<Button
							onClick={onClick}
							className={cn(
								"w-full",
								mutation.isPending && "cursor-not-allowed",
							)}
							disabled={mutation.isPending}
						>
							{mutation.isPending ? (
								<Loader className="animate-spin text-muted-foreground" />
							) : (
								"Remove Background"
							)}
						</Button>
					</div>
				</ScrollArea>
			)}

			<ToolSidebarClose onClick={onClose} />
		</aside>
	);
};
