import type { fabric } from "fabric";
import type { ITextboxOptions } from "fabric/fabric-impl";
import * as material from "material-colors";
export const JSON_KEYS = [
	"name",
	"gradientAngle",
	"selectable",
	"hasControls",
	"linkData",
	"editable",
	"extensionType",
	"extension",
];
export const filters = [
	"none",
	"polaroid",
	"sepia",
	"kodachrome",
	"contrast",
	"brightness",
	"brownie",
	"technicolor",
	"pixelate",
	"invert",
	"blur",
	"grayscale",
	"sharpen",
	"emboss",
	"removecolor",
	"blackwhite",
	"vibrance",
	"blendcolor",
	"huerotate",
	"resize",
	"gamma",
	"saturation",
];

export const fonts = [
	"Arial",
	"Arial Black",
	"Verdana",
	"Helvetica",
	"Tahoma",
	"Trebuchet MS",
	"Times New Roman",
	"Georgia",
	"Garamond",
	"Courier New",
	"Brush Script MT",
	"Palatino",
	"Bookman",
	"Comic Sans MS",
	"Impact",
	"Lucida Sans Unicode",
	"Geneva",
	"Lucida Console",
];

export const selectionDependentTools = [
	"fill",
	"font",
	"filter",
	"opacity",
	"stroke-color",
	"remove-bg",
	"stroke-width",
];

export const colors = [
	material.red["500"],
	material.pink["500"],
	material.purple["500"],
	material.deepPurple["500"],
	material.blue["500"],
	material.lightBlue["500"],
	material.cyan["500"],
	material.teal["500"],
	material.green["500"],
	material.lightGreen["500"],
	material.lime["500"],
	material.yellow["500"],
	material.amber["500"],
	material.orange["500"],
	material.deepOrange["500"],
	material.brown["500"],
	material.blueGrey["500"],
	"transparent",
];

export type ActiveTool =
	| "select"
	| "shapes"
	| "text"
	| "images"
	| "draw"
	| "fill"
	| "stroke-color"
	| "stroke-width"
	| "font"
	| "opacity"
	| "filter"
	| "settings"
	| "ai"
	| "remove-bg"
	| "templates";

export const FILL_COLOR = "rgba(0,0,0,1)";
export const STROKE_COLOR = "rgba(0,0,0,1)";
export const STROKE_WIDTH = 2;
export const STROKE_DASH_ARRAY = [];
export const FONT_WEIGHT = 400;
export const FONT_FAMILY = "Arial";
export const FONT_SIZE = 32;
export const CIRCLE_OPTIONS = {
	radius: 150,
	left: 100,
	top: 100,
	fill: FILL_COLOR,
	stroke: STROKE_COLOR,
	strokeWidth: STROKE_WIDTH,
};

export const RECTANGLE_OPTIONS = {
	left: 100,
	top: 100,
	width: 300,
	height: 300,
	fill: FILL_COLOR,
	angle: 0,
	strokeWidth: STROKE_WIDTH,
};
export const TRIANGLE_OPTIONS = {
	left: 100,
	top: 100,
	width: 300,
	height: 300,
	fill: FILL_COLOR,
	angle: 0,
	strokeWidth: STROKE_WIDTH,
};
export const TEXT_OPTIONS = {
	type: "textbox",
	left: 100,
	top: 100,
	fill: FILL_COLOR,
	fontSize: FONT_SIZE,
	fontFamily: FONT_FAMILY,
};
export const DIAMOND_OPTIONS = {
	left: 100,
	top: 100,
	width: 420,
	height: 420,
	fill: FILL_COLOR,
	angle: 0,
	strokeWidth: STROKE_WIDTH,
};

export type buildEditorProps = {
	save: (skip?: boolean) => void;
	undo: () => void;
	redo: () => void;
	canUndo: () => boolean;
	canRedo: () => boolean;
	canvas: fabric.Canvas;
	fillColor: string;
	strokeColor: string;
	strokeWidth: number;
	fontFamily: string;
	setFillColor: (value: string) => void;
	setStrokeColor: (value: string) => void;
	setStrokeWidth: (value: number) => void;
	selectedObjects: fabric.Object[];
	strokeDashArray: number[];
	setStrokeDashArray: (value: number[]) => void;
	setFontFamily: (value: string) => void;
	copy: () => void;
	paste: () => void;
	autoZoom: () => void;
};

export interface Editor {
	canUndo: () => boolean;
	canRedo: () => boolean;
	onUndo: () => void;
	onRedo: () => void;
	autoZoom: () => void;
	zoomIn: () => void;
	zoomOut: () => void;
	addCircle: () => void;
	addSoftRectangle: () => void;
	addRectangle: () => void;
	addTriangle: () => void;
	addInverseTriangle: () => void;
	addDiamond: () => void;
	changeFillColor: (value: string) => void;
	changeStrokeColor: (value: string) => void;
	changeStrokeWidth: (value: number) => void;
	changeStrokeDashArray: (value: number[]) => void;
	// strokeColor: string;
	// strokeWidth: number;
	canvas: fabric.Canvas;

	changeOpacity: (value: number) => void;
	selectedObjects: fabric.Object[];
	getActiveFillColor: () => string;
	getActiveStrokeColor: () => string;
	getActiveStrokeWidth: () => number;
	getActiveStrokeDashArray: () => number[];
	getActiveOpacity: () => number;
	bringForward: () => void;
	sendBackwards: () => void;
	addText: (value: string, options?: ITextboxOptions) => void;
	changeFontFamily: (value: string) => void;
	getActiveFontFamily: () => string;
	getActiveFontWeight: () => number;
	changeFontWeight: (value: number) => void;
	changeFontStyle: (value: string) => void;
	getActiveFontStyle: () => string;
	changeFontLinethrough: (value: boolean) => void;
	getActiveFontLinethrough: () => boolean;
	changeFontUnderline: (value: boolean) => void;
	getActiveFontUnderline: () => boolean;
	changeTextAlign: (value: ITextboxOptions["textAlign"]) => void;
	getActiveTextAlign: () => string;
	changeFontSize: (value: number) => void;
	getActiveFontSize: () => number;
	delete: () => void;
	addImage: (value: string) => void;
	changeImageFilter: (value: string) => void;
	onCopy: () => void;
	onPaste: () => void;
	enableDrawingMode: () => void;
	disableDrawingMode: () => void;
	changeSize: (value: { width: number; height: number }) => void;
	changeBackground: (value: string) => void;
	getWorkspace: () => fabric.Object | undefined;
}

export interface EditorHookProps {
	clearSelectionCallback?: () => void;
}
