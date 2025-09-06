"use client";

import { fabric } from "fabric";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { AiSidebar } from "@/features/editor/components/ai-sidebar";
import { FillColorSidebar } from "@/features/editor/components/fill-color-sidebar";
import { FilterSidebar } from "@/features/editor/components/filter-sidebar";
import { FontSidebar } from "@/features/editor/components/font-sidebar";
import { Footer } from "@/features/editor/components/footer";
import { ImageSidebar } from "@/features/editor/components/image-sidebar";
import { Navbar } from "@/features/editor/components/navbar";
import { OpacitySidebar } from "@/features/editor/components/opacity-sidebar";
import { RemoveBgSidebar } from "@/features/editor/components/remove-bg-sidebar";
import { ShapeSidebar } from "@/features/editor/components/shape-sidebar";
import { Sidebar } from "@/features/editor/components/sidebar";
import { StrokeColorSidebar } from "@/features/editor/components/stroke-color-sidebar";
import { StrokeWidthSidebar } from "@/features/editor/components/stroke-width-sidebar";
import { TextSidebar } from "@/features/editor/components/text-sidebar";
import { Toolbar } from "@/features/editor/components/toolbar";
import { useEditor } from "@/features/editor/hooks/use-editor";
import {
	type ActiveTool,
	selectionDependentTools,
} from "@/features/editor/types";
import type { ResponseType } from "@/features/projects/api/use-get-project";
import { DrawSidebar } from "./draw-sidebar";
import { SettingsSidebar } from "./settings-sidebar";

interface EditorProps {
	initalData: ResponseType["data"];
}
export const Editor = ({ initalData }: EditorProps) => {
	const [activeTool, setActiveTool] = useState<ActiveTool>("select");
	const onClearSelection = useCallback(() => {
		if (selectionDependentTools.includes(activeTool)) {
			setActiveTool("select");
		}
	}, [activeTool]);
	const { init, editor } = useEditor({
		clearSelectionCallback: onClearSelection,
	});

	const onChangeActiveTool = useCallback(
		(tool: ActiveTool) => {
			if (tool === "draw") {
				editor?.enableDrawingMode();
			}
			if (activeTool === "draw") {
				editor?.disableDrawingMode();
			}
			if (tool === activeTool) return setActiveTool("select");

			setActiveTool(tool);
		},
		[activeTool, editor],
	);

	const canvasRef = useRef(null);
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const canvas = new fabric.Canvas(canvasRef.current, {
			controlsAboveOverlay: true,
			preserveObjectStacking: true,
		});
		init({
			initialCanvas: canvas,
			initialContainer: containerRef.current!,
		});
		return () => {
			canvas.dispose();
		};
	}, [init]);
	return (
		<div className="h-full flex flex-col">
			<Navbar
				activeTool={activeTool}
				onChangeActiveTool={onChangeActiveTool}
				editor={editor}
			/>
			<div className="absolute h-[calc(100%-68px)] w-full top-[68px] flex">
				<Sidebar
					activeTool={activeTool}
					onChangeActiveTool={onChangeActiveTool}
				/>

				<ShapeSidebar
					editor={editor}
					activeTool={activeTool}
					onChangeActiveTool={onChangeActiveTool}
				/>
				<FillColorSidebar
					editor={editor}
					activeTool={activeTool}
					onChangeActiveTool={onChangeActiveTool}
				/>
				<StrokeColorSidebar
					editor={editor}
					activeTool={activeTool}
					onChangeActiveTool={onChangeActiveTool}
				/>
				<StrokeWidthSidebar
					editor={editor}
					activeTool={activeTool}
					onChangeActiveTool={onChangeActiveTool}
				/>
				<OpacitySidebar
					editor={editor}
					activeTool={activeTool}
					onChangeActiveTool={onChangeActiveTool}
				/>
				<TextSidebar
					editor={editor}
					activeTool={activeTool}
					onChangeActiveTool={onChangeActiveTool}
				/>
				<FontSidebar
					editor={editor}
					activeTool={activeTool}
					onChangeActiveTool={onChangeActiveTool}
				/>

				<ImageSidebar
					editor={editor}
					activeTool={activeTool}
					onChangeActiveTool={onChangeActiveTool}
				/>
				<FilterSidebar
					editor={editor}
					activeTool={activeTool}
					onChangeActiveTool={onChangeActiveTool}
				/>
				<AiSidebar
					editor={editor}
					activeTool={activeTool}
					onChangeActiveTool={onChangeActiveTool}
				/>
				<RemoveBgSidebar
					editor={editor}
					activeTool={activeTool}
					onChangeActiveTool={onChangeActiveTool}
				/>
				<DrawSidebar
					editor={editor}
					activeTool={activeTool}
					onChangeActiveTool={onChangeActiveTool}
				/>
				<SettingsSidebar
					editor={editor}
					activeTool={activeTool}
					onChangeActiveTool={onChangeActiveTool}
				/>
				<main className="bg-muted flex-1 overflow-auto relative flex flex-col">
					<Toolbar
						editor={editor}
						activeTool={activeTool}
						onChangeActiveTool={onChangeActiveTool}
						key={JSON.stringify(editor?.canvas.getActiveObject())}
					/>
					<div
						ref={containerRef}
						className="flex-1 bg-muted h-[calc(100%-124px)]"
					>
						{/* containerRef, canvasRef control the canvas area responsive in the page and centerd in the page */}
						<canvas ref={canvasRef} />
					</div>
					<Footer editor={editor} />
				</main>
			</div>
		</div>
	);
};
