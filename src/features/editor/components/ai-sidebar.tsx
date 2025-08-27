"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useGenerateImage } from "@/features/ai/api/use-generate-image";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";
import type { ActiveTool, Editor } from "@/features/editor/types";
import { cn } from "@/lib/utils";
import { ToolSidebarClose } from "./tool-sidebar-close";

interface AiSidebarProps {
	activeTool: ActiveTool;
	onChangeActiveTool: (tool: ActiveTool) => void;
	editor: Editor | undefined;
}

export const AiSidebar = ({
	activeTool,
	editor,
	onChangeActiveTool,
}: AiSidebarProps) => {
	const [value, setValue] = useState("");
	const [aiModel, setAiModel] = useState('google')
	const mutation = useGenerateImage();

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		// TODO: Block with paywall if no credits left
		console.log(value)
		console.log(aiModel);
		mutation.mutate(
			{
				prompt: value,
				model: aiModel
			},
			{
				onSuccess: ({ data }) => {
					editor?.addImage(data);
				},
			},
		);
	};

	const onClose = () => {
		onChangeActiveTool("select");
	};

	return (
		<aside
			className={cn(
				"bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
				activeTool === "ai" ? "visible" : "hidden",
			)}
		>
			<ToolSidebarHeader
				title="AI"
				description="generate images using artificial intelligence"
			/>

			<ScrollArea>
				<form onSubmit={onSubmit} className="p-4 space-y-6">
				<Select value={aiModel} onValueChange={setAiModel}>
				<SelectTrigger className="w-[180px]">
				<SelectValue placeholder="AI Provider" />
				</SelectTrigger>
				<SelectContent>
						<SelectItem value="google" key={'google'}>Google</SelectItem>
						<SelectItem value="huggingface" key={'huggingface'}>Hugging Face</SelectItem>
					<SelectItem value="artisanly" key={'artisanly'}>Artisanly</SelectItem>
				</SelectContent>
				</Select>
					<Textarea
						placeholder="Describe the image you want to generate..."
						value={value}
						disabled={mutation.isPending}
						onChange={(e) => setValue(e.target.value)}
						cols={30}
						rows={10}
						required
						minLength={3}
					/>

					<Button 	disabled={mutation.isPending} type="submit" className="w-full">
						Generate
					</Button>
				</form>
			</ScrollArea>

			<ToolSidebarClose onClick={onClose} />
		</aside>
	);
};
