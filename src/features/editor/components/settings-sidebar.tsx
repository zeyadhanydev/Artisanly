"use client";
import { Label } from "@radix-ui/react-label";
import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ColorPicker } from "@/features/editor/components/color-picker";
import { ToolSidebarHeader } from "@/features/editor/components/tool-sidebar-header";
import {
	type ActiveTool,
	type Editor,
	FILL_COLOR,
} from "@/features/editor/types";
import { cn } from "@/lib/utils";
import { ToolSidebarClose } from "./tool-sidebar-close";

interface SettingsSidebarProps {
	activeTool: ActiveTool;
	onChangeActiveTool: (tool: ActiveTool) => void;
	editor: Editor | undefined;
}

export const SettingsSidebar = ({
	activeTool,
	editor,
	onChangeActiveTool,
}: SettingsSidebarProps) => {
	const onClose = () => {
		onChangeActiveTool("select");
	};
	const workspace = editor?.getWorkspace();
	const initialWidth = useMemo(() => {
		return `${workspace?.width || 0}`;
	}, [workspace]);
	const initialHeight = useMemo(() => {
		return `${workspace?.height || 0}`;
	}, [workspace]);
	const initialBackground = useMemo(() => {
		return `${workspace?.fill || "#FFFFFF"}`;
	}, [workspace]);
	const [width, setWidth] = useState(initialWidth);
	const [height, setHeight] = useState(initialHeight);
	const [backgournd, setBackground] = useState(initialBackground);

	useEffect(() => {
		setWidth(initialWidth);
		setHeight(initialHeight);
		setBackground(initialBackground);
	}, [initialWidth, initialHeight, initialBackground]);
	const changeWidth = (value: string) => setWidth(value);
	const changeHeight = (value: string) => setHeight(value);
	const changeBackground = (value: string) => {
		setBackground(value);
		editor?.changeBackground(value);
	};
	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		editor?.changeSize({
			width: parseInt(width, 10),
			height: parseInt(height, 10),
		});
	};

	return (
		<aside
			className={cn(
				"bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
				activeTool === "settings" ? "visible" : "hidden",
			)}
		>
			<ToolSidebarHeader title="Settings" description="Change the look of your workspace" />

			<ScrollArea>
				<form className="p-4 space-y-4" onSubmit={onSubmit}>
					<div className="space-y-2">
						<Label>Height</Label>
						<Input
							placeholder="Height"
							value={height}
							type="number"
							onChange={(e) => changeHeight(e.target.value)}
						/>
					</div>

					<div className="space-y-2">
						<Label>Width</Label>
						<Input
							placeholder="Width"
							value={width}
							type="number"
							onChange={(e) => changeWidth(e.target.value)}
						/>
					</div>
					<Button type="submit" className="w-full">
						Resize{" "}
					</Button>
				</form>
				<div className="p-4">
				<ColorPicker value={backgournd as string} onChange={changeBackground}></ColorPicker>

				</div>
			</ScrollArea>

			<ToolSidebarClose onClick={onClose} />
		</aside>
	);
};
