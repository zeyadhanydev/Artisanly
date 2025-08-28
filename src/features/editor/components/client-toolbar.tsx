"use client";

import {
	AlignCenter,
	AlignLeft,
	AlignRight,
	ArrowDown,
	ArrowUp,
	ChevronDown,
	CopyIcon,
	SquareSplitHorizontal,
	TrashIcon,
} from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BsBorderWidth } from "react-icons/bs";
import {
	FaBold,
	FaItalic,
	FaStrikethrough,
	FaUnderline,
} from "react-icons/fa";
import { RxTransparencyGrid } from "react-icons/rx";
import { TbColorFilter } from "react-icons/tb";
import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
	type ActiveTool,
	type Editor,
	FILL_COLOR,
	FONT_SIZE,
	FONT_WEIGHT,
} from "../types";
import { isTextType } from "../utils";
import { FontSizeInput } from "./fontsize-input";

interface ToolbarProps {
	editor: Editor | undefined;
	activeTool: ActiveTool;
	onChangeActiveTool: (tool: string) => void;
}

interface ToolbarButtonProps {
	label: string;
	onClick: () => void;
	isActive?: boolean;
	variant?: "ghost" | "default";
	size?: "icon" | "sm" | "lg";
	className?: string;
	children: React.ReactNode;
	disabled?: boolean;
}

const ToolbarButton = ({
	label,
	onClick,
	isActive = false,
	variant = "ghost",
	size = "icon",
	className,
	children,
	disabled = false,
}: ToolbarButtonProps) => (
	<div className="flex items-center h-full justify-center">
		<Hint label={label} side="bottom" sideOffset={5}>
			<Button
				onClick={onClick}
				variant={variant}
				size={size}
				disabled={disabled}
				className={cn(isActive && "bg-gray-100", className)}
				aria-label={label}
				aria-pressed={isActive}
			>
				{children}
			</Button>
		</Hint>
	</div>
);

interface EditorProperties {
	fontWeight: number;
	fillColor: string;
	strokeColor: string;
	fontFamily: string;
	fontStyle: string;
	fontLinethrough: boolean;
	fontUnderline: boolean;
	textAlign: string;
	fontSize: number;
}

export const ClientToolbar = ({
	activeTool,
	editor,
	onChangeActiveTool,
}: ToolbarProps) => {
	// Default properties to use initially
	const defaultProperties: EditorProperties = {
		fontWeight: FONT_WEIGHT,
		fillColor: FILL_COLOR,
		strokeColor: "#000000",
		fontFamily: "Arial",
		fontStyle: "normal",
		fontLinethrough: false,

		fontUnderline: false,
		textAlign: "left",
		fontSize: FONT_SIZE,
	};

	// Initialize with default values
	const [properties, setProperties] =
		useState<EditorProperties>(defaultProperties);

	// Initialize properties from editor once component mounts
	useEffect(() => {
		if (!editor) return;

		// Initialize properties from editor
		setProperties({
			fontWeight: editor.getActiveFontWeight() || FONT_WEIGHT,
			fillColor: editor.getActiveFillColor() || FILL_COLOR,
			strokeColor: editor.getActiveStrokeColor() || "#000000",
			fontFamily: editor.getActiveFontFamily() || "Arial",
			fontStyle: editor.getActiveFontStyle() || "normal",
			fontLinethrough: editor.getActiveFontLinethrough() || false,
			fontUnderline: editor.getActiveFontUnderline() || false,
			textAlign: editor.getActiveTextAlign() || "left",
			fontSize: editor.getActiveFontSize() || FONT_SIZE,
		});
	}, [editor]);

	// Update properties when editor changes or selection changes
	useEffect(() => {
		if (!editor) return;

		const updateProperties = () => {
			setProperties({
				fontWeight: editor.getActiveFontWeight() || FONT_WEIGHT,
				fillColor: editor.getActiveFillColor() || FILL_COLOR,
				strokeColor: editor.getActiveStrokeColor() || "#000000",
				fontFamily: editor.getActiveFontFamily() || "Arial",
				fontStyle: editor.getActiveFontStyle() || "normal",
				fontLinethrough: editor.getActiveFontLinethrough() || false,
				fontUnderline: editor.getActiveFontUnderline() || false,
				textAlign: editor.getActiveTextAlign() || "left",
				fontSize: editor.getActiveFontSize() || FONT_SIZE,
			});
		};

		// Initial update
		updateProperties();

		// Listen for selection changes or property updates
		editor.on?.("selection:changed", updateProperties);
		editor.on?.("object:modified", updateProperties);

		return () => {
			editor.off?.("selection:changed", updateProperties);
			editor.off?.("object:modified", updateProperties);
		};
	}, [editor]);

	// Memoize derived values
	const selectedObject = useMemo(
		() => editor?.selectedObjects[0],
		[editor?.selectedObjects],
	);
	const selectedObjectType = useMemo(
		() => selectedObject?.type,
		[selectedObject],
	);
	const isText = useMemo(
		() => isTextType(selectedObjectType),
		[selectedObjectType],
	);
	const isImage = selectedObjectType === "image";
	const hasSelection = useMemo(
		() => editor?.selectedObjects.length > 0,
		[editor?.selectedObjects?.length],
	);

	// Memoized event handlers
	const toggleBold = useCallback(() => {
		if (!selectedObject || !editor) return;

		const newWeight = properties.fontWeight > 500 ? 400 : 700;
		editor.changeFontWeight(newWeight);
		setProperties((prev) => ({ ...prev, fontWeight: newWeight }));
	}, [selectedObject, editor, properties.fontWeight]);

	const toggleItalic = useCallback(() => {
		if (!selectedObject || !editor) return;

		const isItalic = properties.fontStyle === "italic";
		const newStyle = isItalic ? "normal" : "italic";
		editor.changeFontStyle(newStyle);
		setProperties((prev) => ({ ...prev, fontStyle: newStyle }));
	}, [selectedObject, editor, properties.fontStyle]);

	const onChangeTextAlign = (value: string) => {
		if (!selectedObject) {
			return;
		}
		editor?.changeTextAlign(value);
		setProperties((current) => ({ ...current, textAlign: value }));
	};

	const toggleLineThrough = useCallback(() => {
		if (!selectedObject || !editor) return;

		const newStyle = properties.fontLinethrough ? false : true;
		editor.changeFontLinethrough(newStyle);
		setProperties((current) => ({ ...current, fontLinethrough: newStyle }));
	}, [selectedObject, editor, properties.fontLinethrough]);

	const toggleFontUnderline = useCallback(() => {
		if (!selectedObject || !editor) return;

		const newStyle = properties.fontUnderline ? false : true;
		editor.changeFontUnderline(newStyle);
		setProperties((current) => ({ ...current, fontUnderline: newStyle }));
	}, [selectedObject, editor, properties.fontUnderline]);

	const handleBringForward = useCallback(() => {
		editor?.bringForward();
	}, [editor]);

	const handleSendBackwards = useCallback(() => {
		editor?.sendBackwards();
	}, [editor]);

	const createToolHandler = useCallback(
		(tool: string) => () => {
			onChangeActiveTool(tool);
		},
		[onChangeActiveTool],
	);
	const onChangeFontSize = (value: number) => {
		if (!selectedObject) {
			return;
		}
		editor?.changeFontSize(value);
		setProperties((current) => ({ ...current, fontSize: value }));
	};

	// Early return for no editor or no selection
	if (!editor || !hasSelection) {
		return (
			<div className="shrink-0 h-[56px] border-b bg-white w-full flex items-center overflow-x-auto z-[49] p-2 gap-x-2">
				<div className="text-sm text-muted-foreground">
					Select an object to edit
				</div>
			</div>
		);
	}

	return (
		<div className="shrink-0 h-[56px] border-b bg-white w-full flex items-center overflow-x-auto z-[49] p-2 gap-x-2">
			{/* Fill Color */}
			{!isImage && (
				<ToolbarButton
					label="Fill Color"
					onClick={createToolHandler("fill")}
					isActive={activeTool === "fill"}
				>
					<div
						className="rounded-sm size-4 border"
						style={{ backgroundColor: properties.fillColor }}
					/>
				</ToolbarButton>
			)}

			{/* Stroke Color - Only for non-text objects */}
			{!isText && (
				<ToolbarButton
					label="Stroke Color"
					onClick={createToolHandler("stroke-color")}
					isActive={activeTool === "stroke-color"}
				>
					<div
						className="rounded size-4 border-2 bg-white"
						style={{ borderColor: properties.strokeColor }}
					/>
				</ToolbarButton>
			)}

			{/* Stroke Width - Only for non-text objects */}
			{!isText && (
				<ToolbarButton
					label="Stroke Width"
					onClick={createToolHandler("stroke-width")}
					isActive={activeTool === "stroke-width"}
				>
					<BsBorderWidth className="size-4" />
				</ToolbarButton>
			)}

			{/* Font Family - Only for text objects */}
			{isText && (
				<ToolbarButton
					label="Font Family"
					onClick={createToolHandler("font")}
					isActive={activeTool === "font"}
					className="w-auto px-2 text-sm"
				>
					<div className="max-w-[100px] truncate">{properties.fontFamily}</div>
					<ChevronDown className="size-4 shrink-0 ml-2" />
				</ToolbarButton>
			)}

			{/* Bold - Only for text objects */}
			{isText && (
				<ToolbarButton
					label={`${properties.fontWeight > 500 ? "Remove" : "Apply"} Bold`}
					onClick={toggleBold}
					isActive={properties.fontWeight > 500}
				>
					<FaBold className="size-4" />
				</ToolbarButton>
			)}

			{/* Italic - Only for text objects */}
			{isText && (
				<ToolbarButton
					label={`${properties.fontStyle === "italic" ? "Remove" : "Apply"} Italic`}
					onClick={toggleItalic}
					isActive={properties.fontStyle === "italic"}
				>
					<FaItalic className="size-4" />
				</ToolbarButton>
			)}
			{isText && (
				<ToolbarButton
					label={`${properties.fontLinethrough === true ? "Remove" : "Apply"} Strike`}
					onClick={toggleLineThrough}
					isActive={properties.fontLinethrough === true}
				>
					<FaStrikethrough className="size-4" />
				</ToolbarButton>
			)}
			{isText && (
				<ToolbarButton
					label={`${properties.fontUnderline === true ? "Remove" : "Apply"} Underline`}
					onClick={toggleFontUnderline}
					isActive={properties.fontUnderline === true}
				>
					<FaUnderline className="size-4" />
				</ToolbarButton>
			)}
			{isText && (
				<div className="flex items-center h-full justify-center">
					<FontSizeInput
						value={properties.fontSize}
						onChange={onChangeFontSize}
					/>
				</div>
			)}
			{isImage && (
				<div className="flex justify-center items-center h-full">
					<Hint label="Filters" side="bottom" sideOffset={5}>
						<Button
							onClick={() => onChangeActiveTool("filter")}
							size={"icon"}
							variant={"ghost"}
							className={cn(activeTool === "filter" && "bg-gray-100")}
						>
							<TbColorFilter className="size-4" />
						</Button>
					</Hint>
				</div>
			)}
			{isImage && (
				<div className="flex justify-center items-center h-full">
					<Hint label="Remove background" side="bottom" sideOffset={5}>
						<Button
							onClick={() => onChangeActiveTool("remove-bg")}
							size={"icon"}
							variant={"ghost"}
							className={cn(activeTool === "remove-bg" && "bg-gray-100")}
						>
							<SquareSplitHorizontal className="size-4" />
						</Button>
					</Hint>
				</div>
			)}
			{isText && (
				<ToolbarButton
					label={`${properties.textAlign === "left" ? "Remove" : "Apply"} Align left`}
					onClick={() => onChangeTextAlign("left")}
					isActive={properties.textAlign === "left"}
				>
					<AlignLeft className="size-4" />
				</ToolbarButton>
			)}

			{isText && (
				<ToolbarButton
					label={`${properties.textAlign === "center" ? "Remove" : "Apply"} Align center`}
					onClick={() => onChangeTextAlign("center")}
					isActive={properties.textAlign === "center"}
				>
					<AlignCenter className="size-4" />
				</ToolbarButton>
			)}
			{isText && (
				<ToolbarButton
					label={`${properties.textAlign === "right" ? "Remove" : "Apply"} Align right`}
					onClick={() => onChangeTextAlign("right")}
					isActive={properties.textAlign === "right"}
				>
					<AlignRight className="size-4" />
				</ToolbarButton>
			)}
			{/* Layer Controls */}
			<ToolbarButton label="Bring Forward" onClick={handleBringForward}>
				<ArrowUp className="size-4" />
			</ToolbarButton>

			<ToolbarButton label="Send Backward" onClick={handleSendBackwards}>
				<ArrowDown className="size-4" />
			</ToolbarButton>

			{/* Opacity */}
			<ToolbarButton
				label="Opacity"
				onClick={createToolHandler("opacity")}
				isActive={activeTool === "opacity"}
			>
				<RxTransparencyGrid className="size-4" />
			</ToolbarButton>
			<ToolbarButton label="Delete" onClick={() => editor.delete()}>
				<TrashIcon className="size-4" />
			</ToolbarButton>
			<ToolbarButton label="Duplicate" onClick={() => {
			 editor.onCopy()
				editor.onPaste()
			}}>
				<CopyIcon className="size-4" />
			</ToolbarButton>

		</div>
	);
};
