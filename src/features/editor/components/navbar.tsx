"use client";
import {
	ChevronDown,
	Download,
	MousePointerClick,
	Redo2,
	Undo2,
} from "lucide-react";
import React from "react";
import { BsCloudCheck } from "react-icons/bs";
import { CiFileOn } from "react-icons/ci";
import { useFilePicker } from "use-file-picker";
import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Logo } from "@/features/editor/components/logo";
import type { ActiveTool, Editor } from "@/features/editor/types";
import { cn } from "@/lib/utils";

interface NavbarProps {
	editor: Editor | undefined;
	activeTool: ActiveTool;
	onChangeActiveTool: (tool: ActiveTool) => void;
}

export const Navbar = ({
	activeTool,
	onChangeActiveTool,
	editor,
}: NavbarProps) => {
	const { openFilePicker } = useFilePicker({
		accept: ".json",
		onFilesSuccessfullySelected: ({ plainFiles }: any) => {
			if (plainFiles && plainFiles.length > 0) {
				const file = plainFiles[0];
				const reader = new FileReader();
				reader.readAsText(file, "UTF-8");
				reader.onload = () => {
					editor?.loadJson(reader.result as string);
				};
			}
		},
	});
	return (
		<div className="w-full flex items-center p-4 h-[68px] gap-x-8 border-b lg:pl-[34px]">
			<Logo />
			<div className="w-full flex items-center gap-x-1 h-full">
				<DropdownMenu modal={false}>
					<DropdownMenuTrigger asChild>
						<Button size="sm" variant={"ghost"}>
							File
							<ChevronDown className="size-4 ml-2" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start" className="min-w-60">
						<DropdownMenuItem
							onClick={openFilePicker}
							className="flex items-center gap-x-2"
						>
							<CiFileOn className="size-8" />
							<div>
								<p>Open</p>
								<p className="text-xs text-muted-foreground">
									Open a JSON file
								</p>
							</div>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
				<Separator orientation="vertical" className="mx-2" />
				<Hint label="Select" side="bottom" sideOffset={10}>
					<Button
						variant={"ghost"}
						size={"icon"}
						onClick={() => {
							onChangeActiveTool("select");
						}}
						className={cn(activeTool === "select" && "bg-gray-100")}
					>
						<MousePointerClick className="size-4" />
					</Button>
				</Hint>
				<Hint label="Undo" side="bottom" sideOffset={10}>
					<Button
						variant={"ghost"}
						disabled={!editor?.canUndo()}
						size={"icon"}
						onClick={() => {
							editor?.onUndo();
						}}
					>
						<Undo2 className="size-4" />
					</Button>
				</Hint>
				<Hint label="Redo" side="bottom" sideOffset={10}>
					<Button
						variant={"ghost"}
						size={"icon"}
						disabled={!editor?.canRedo()}
						onClick={() => {
							editor?.onRedo();
						}}
					>
						<Redo2 className="size-4" />
					</Button>
				</Hint>
				<Separator orientation="vertical" className="mx-2" />
				<div className="flex items-center gap-x-2">
					<BsCloudCheck className="size-[20px] text-muted-foreground" />
					<p className="text-xs text-muted-foreground">Saved</p>
				</div>

				<div className="ml-auto flex items-center gap-x-4">
					<DropdownMenu modal={false}>
						<DropdownMenuTrigger asChild>
							<Button variant={"ghost"} size={"sm"}>
								Export
								<Download className="size-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="min-w-60">
							<DropdownMenuItem
								className="flex items-center gap-x-2"
								onClick={() => {
									editor?.saveJson();
								}}
							>
								<CiFileOn className="size-8" />
								<div>
									<p>JSON</p>
									<p className="text-xs text-muted-foreground">
										Save for later editing
									</p>
								</div>
							</DropdownMenuItem>
							<DropdownMenuItem
								className="flex items-center gap-x-2"
								onClick={() => {
									editor?.savePng();
								}}
							>
								<CiFileOn className="size-8" />
								<div>
									<p>PNG</p>
									<p className="text-xs text-muted-foreground">
										Best for sharing on the web
									</p>
								</div>
							</DropdownMenuItem>
							<DropdownMenuItem
								className="flex items-center gap-x-2"
								onClick={() => {
									editor?.saveJpg();
								}}
							>
								<CiFileOn className="size-8" />
								<div>
									<p>JPG</p>
									<p className="text-xs text-muted-foreground">
										Best for printing
									</p>
								</div>
							</DropdownMenuItem>
							<DropdownMenuItem
								className="flex items-center gap-x-2"
								onClick={() => {
									editor?.saveSvg();
								}}
							>
								<CiFileOn className="size-8" />
								<div>
									<p>SVG</p>
									<p className="text-xs text-muted-foreground">
										Best for editing in vector software
									</p>
								</div>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
					{/* add user icon button  */}
				</div>
			</div>
		</div>
	);
};
