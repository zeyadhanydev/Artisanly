"use client";
import { AlertTriangle, Loader, ToggleLeft, ToggleRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRemoveBackground } from "@/features/ai/hooks/use-remove-background";
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
	const [useClientSide, setUseClientSide] = useState(true);
	const {
		removeBackground,
		isLoading,
		imageUrl,
		error,
		progress,
		isClientSideAvailable
	} = useRemoveBackground({ preferClientSide: useClientSide });

	const onClose = () => {
		onChangeActiveTool("select");
	};
	const onClick = async () => {
		/// TODO: Block with paywall if no credits left
		if (!imageSrc) return;

		await removeBackground(imageSrc);

		// Add the image to the editor when processing is complete
		if (imageUrl) {
			editor?.addImage(imageUrl);
		}
	};

	const toggleProcessingMode = () => {
		setUseClientSide(prev => !prev);
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
						{isClientSideAvailable && (
							<div className="flex items-center justify-between mb-2 text-sm">
								<span className="text-muted-foreground">Processing mode:</span>
								<button
									onClick={toggleProcessingMode}
									className="flex items-center text-xs font-medium"
									disabled={isLoading}
								>
									{useClientSide ?
										<>Browser-based <ToggleRight className="ml-2 h-4 w-4 text-primary" /></> :
										<>Server-based <ToggleLeft className="ml-2 h-4 w-4" /></>
									}
								</button>
							</div>
						)}

						{error && (
							<div className="p-2 bg-red-50 text-red-700 rounded-md text-xs mb-2">
								{error}
							</div>
						)}

						<Button
							onClick={onClick}
							className={cn(
								"w-full",
								isLoading && "cursor-not-allowed",
							)}
							disabled={isLoading}
						>
							{isLoading ? (
								<>
									<Loader className="mr-2 animate-spin text-muted-foreground" />
									{progress}
								</>
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
