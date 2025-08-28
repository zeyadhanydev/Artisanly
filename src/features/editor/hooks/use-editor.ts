import { fabric } from "fabric";
import type { ITextboxOptions } from "fabric/fabric-impl";
import { useCallback, useMemo, useState } from "react";
import { useAutoResize } from "@/features/editor/hooks/use-auto-resize";
import { useCanvasEvents } from "@/features/editor/hooks/use-canvas-events";
import {
	type buildEditorProps,
	CIRCLE_OPTIONS,
	DIAMOND_OPTIONS,
	type Editor,
	type EditorHookProps,
	FILL_COLOR,
	FONT_FAMILY,
	FONT_SIZE,
	FONT_WEIGHT,
	RECTANGLE_OPTIONS,
	STROKE_COLOR,
	STROKE_DASH_ARRAY,
	STROKE_WIDTH,
	TEXT_OPTIONS,
	TRIANGLE_OPTIONS,
} from "@/features/editor/types";
import { createFilter, isTextType } from "@/features/editor/utils";
import { useClipboard } from "./use-clipboard";

const buildEditor = ({
	canvas,
	fillColor,
	setFillColor,
	setStrokeColor,
	setStrokeWidth,
	strokeColor,
	strokeWidth,
	selectedObjects,
	setStrokeDashArray,
	strokeDashArray,
	fontFamily,
	setFontFamily,
	copy, paste
}: buildEditorProps): Editor => {
	const getWorkspace = () => {
		return canvas
			.getObjects()
			.find((obj) => obj.name === "clip") as fabric.Rect;
	};
	const center = (object: fabric.Object) => {
		const workspace = getWorkspace();
		const center = workspace?.getCenterPoint();
		if (!center) return;
		//@ts-expect-error _centerObject is not in types in fabric
		canvas._centerObject(object, center);
	};
	const addToCanvas = (object: fabric.Object) => {
		center(object);
		canvas.add(object);
		canvas.setActiveObject(object);
	};
	return {
	onCopy: () => copy(),
	onPaste: () => paste(),
	changeImageFilter: (value: string) => {
	const objects = canvas.getActiveObjects()
	objects.forEach((object) => {
	if (object.type === 'image') {
    const imageObject = object as fabric.Image;
    const effect = createFilter(value);
    imageObject.filters = effect ? [effect] : [];
    imageObject.applyFilters()
    canvas.renderAll();
	}
	})
	},
	addImage: (value: string)=> {
	fabric.Image.fromURL(value, (image) => {
    const workspace = getWorkspace();
    image.scaleToWidth(workspace.width || 0)
    image.scaleToHeight(workspace.height || 0)
  addToCanvas(image);
	}, {
	crossOrigin: 'anonymous'
	})

	},
	delete: () => {

	canvas.getActiveObjects().forEach((object) => {canvas.remove(object)})
      canvas.discardActiveObject();
      canvas.renderAll();
	},
		addText: (value, options) => {
			const object = new fabric.Textbox(value, {
				...TEXT_OPTIONS,
				fill: fillColor,
				...options,
			});
			addToCanvas(object);
		},
		changeOpacity: (value: number) => {
			canvas.getActiveObjects().forEach((object) => {
				object.set({ opacity: value });
			});
			canvas.renderAll();
		},
		changeFontWeight: (value: number) => {
			canvas.getActiveObjects().forEach((object) => {
				if (isTextType(object.type)) {
					object.set({ fontWeight: value });
				}
			});
			canvas.renderAll();
		},
		changeFontStyle: (value: string) => {
			canvas.getActiveObjects().forEach((object) => {
				if (isTextType(object.type)) {
					object.set({ fontStyle: value });
				}
			});
			canvas.renderAll();
		},
		bringForward: () => {
			canvas.getActiveObjects().forEach((object) => {
				canvas.bringForward(object);
			});
			canvas.renderAll();
			const workspace = getWorkspace();
			workspace.sendToBack();
			// TODO: Elements could go below workspace overflow
		},
		sendBackwards: () => {
			canvas.getActiveObjects().forEach((object) => {
				canvas.sendBackwards(object);
			});
			canvas.renderAll();

			const workspace = getWorkspace();
			workspace.sendToBack();

			// TODO: Elements could go below workspace overflow
		},
		changeFillColor: (value: string) => {
			setFillColor(value);
			canvas.getActiveObjects().forEach((object) => {
				object.set({ fill: value });
			});
			canvas.renderAll();
		},
		changeStrokeWidth: (value: number) => {
			setStrokeWidth(value);
			canvas.getActiveObjects().forEach((object) => {
				object.set({ strokeWidth: value });
			});
			canvas.renderAll();
		},
		changeStrokeDashArray: (value: number[]) => {
			setStrokeDashArray(value);
			canvas.getActiveObjects().forEach((object) => {
				object.set({ strokeDashArray: value });
			});
			canvas.renderAll();
		},
		changeStrokeColor: (value: string) => {
			setStrokeColor(value);
			canvas.getActiveObjects().forEach((object) => {
				// if object is text type then change the fill color not stroke
				// Text Types not have stroke
				if (isTextType(object.type)) {
					object.set({ fill: value });

					return;
				}
				object.set({ stroke: value });
			});
			canvas.renderAll();
		},
		changeFontFamily: (value) => {
			setFontFamily(value);
			canvas.getActiveObjects().forEach((object) => {
				if (isTextType(object.type)) {
					object._set("fontFamily", value);
				}
			});
			canvas.renderAll();
		},

		addCircle() {
			const object = new fabric.Circle({
				...CIRCLE_OPTIONS,
				fill: fillColor,
				stroke: strokeColor,
				strokeWidth: strokeWidth,
				strokeDashArray: strokeDashArray,
			});
			addToCanvas(object);
		},
		addSoftRectangle() {
			const object = new fabric.Rect({
				...RECTANGLE_OPTIONS,
				rx: 10,
				ry: 10,
				fill: fillColor,
				stroke: strokeColor,
				strokeWidth: strokeWidth,
				strokeDashArray: strokeDashArray,
			});
			addToCanvas(object);
		},
		addRectangle() {
			const object = new fabric.Rect({
				...RECTANGLE_OPTIONS,
				fill: fillColor,
				stroke: strokeColor,
				strokeWidth: strokeWidth,
				strokeDashArray: strokeDashArray,
			});

			addToCanvas(object);
		},
		addTriangle() {
			const object = new fabric.Triangle({
				...TRIANGLE_OPTIONS,
				fill: fillColor,
				stroke: strokeColor,
				strokeWidth: strokeWidth,
				strokeDashArray: strokeDashArray,
			});
			addToCanvas(object);
		},
		addInverseTriangle() {
			const HEIGHT = TRIANGLE_OPTIONS.height;
			const WIDTH = TRIANGLE_OPTIONS.width;
			const object = new fabric.Polygon(
				[
					{ x: 0, y: 0 },
					{ x: WIDTH, y: 0 },
					{ x: WIDTH / 2, y: HEIGHT },
				],
				{
					...TRIANGLE_OPTIONS,
					fill: fillColor,
					stroke: strokeColor,
					strokeWidth: strokeWidth,
					strokeDashArray: strokeDashArray,
				},
			);
			addToCanvas(object);
		},
		addDiamond() {
			const HEIGHT = DIAMOND_OPTIONS.height;
			const WIDTH = DIAMOND_OPTIONS.width;
			const object = new fabric.Polygon(
				[
					{ x: WIDTH / 2, y: 0 },
					{ x: WIDTH, y: HEIGHT / 2 },
					{ x: WIDTH / 2, y: HEIGHT },
					{ x: 0, y: HEIGHT / 2 },
				],
				{
					...DIAMOND_OPTIONS,
					fill: fillColor,
					stroke: strokeColor,
					strokeWidth: strokeWidth,
					strokeDashArray: strokeDashArray,
				},
			);
			addToCanvas(object);
		},
		getActiveFillColor: () => {
			const selectedObject = selectedObjects[0];
			if (!selectedObject) {
				return fillColor;
			}
			const value = selectedObject.get("fill") || fillColor;
			// curretly , gradiant & patterns are not supported
			return value as string;
		},
		getActiveStrokeColor: () => {
			const selectedObject = selectedObjects[0];
			if (!selectedObject) {
				return strokeColor;
			}
			const value = selectedObject.get("stroke") || strokeColor;
			return value as string;
		},
		getActiveStrokeWidth: () => {
			const selectedObject = selectedObjects[0];
			if (!selectedObject) {
				return strokeWidth;
			}
			const value = selectedObject.get("strokeWidth") || strokeWidth;
			return value;
		},
		getActiveStrokeDashArray: () => {
			const selectedObject = selectedObjects[0];
			if (!selectedObject) {
				return strokeDashArray;
			}
			const value = selectedObject.get("strokeDashArray") || strokeDashArray;
			return value;
		},
		getActiveOpacity: () => {
			const selectedObject = selectedObjects[0];
			if (!selectedObject) {
				return 1;
			}
			const value = selectedObject.get("opacity") || 1;
			return value;
		},

		getActiveFontFamily: () => {
			const selectedObject = selectedObjects[0];
			if (!selectedObject) {
				return fontFamily;
			}
			const value = selectedObject.get("fontFmaily") || fontFamily;
			// curretly , gradiant & patterns are not supported
			return value;
		},
		getActiveFontWeight: () => {
			const selectedObject = selectedObjects[0];
			if (!selectedObject) {
				return FONT_WEIGHT;
			}
			const value = selectedObject.get("fontWeight") || FONT_WEIGHT;
			// curretly , gradiant & patterns are not supported
			return value;
		},
		getActiveFontStyle: () => {
			const selectedObject = selectedObjects[0];
			if (!selectedObject) {
				return "normal";
			}
			const value = selectedObject.get("fontStyle") || "normal";
			// curretly , gradiant & patterns are not supported
			return value;
		},
		getActiveFontLinethrough: () => {
			const selectedObject = selectedObjects[0];
			if (!selectedObject) {
				return false;
			}
			const value = selectedObject.get("linethrough") || false;
			// curretly , gradiant & patterns are not supported
			return value;
		},
		changeFontLinethrough: (value: boolean) => {
			canvas.getActiveObjects().forEach((object) => {
				if (isTextType(object.type)) {
					object._set("linethrough", value);
				}
			});
			canvas.renderAll();
		},

		getActiveFontUnderline: () => {
			const selectedObject = selectedObjects[0];
			if (!selectedObject) {
				return false;
			}
			const value = selectedObject.get("underline") || false;
			// curretly , gradiant & patterns are not supported
			return value;
		},
		changeFontUnderline: (value: boolean) => {
			canvas.getActiveObjects().forEach((object) => {
				if (isTextType(object.type)) {
					object._set("underline", value);
				}
			});
			canvas.renderAll();
		},
		getActiveTextAlign: () => {
			const selectedObject = selectedObjects[0];
			if (!selectedObject) {
				return 'left';
			}
			const value = selectedObject.get("textAlign") || 'left';
			// curretly , gradiant & patterns are not supported
			return value;
		},
		changeTextAlign: (value: ITextboxOptions["textAlign"]) => {
			canvas.getActiveObjects().forEach((object) => {
				if (isTextType(object.type)) {
					object._set("textAlign", value);
				}
			});
			canvas.renderAll();
		},
		getActiveFontSize: () => {
			const selectedObject = selectedObjects[0];
			if (!selectedObject) {
				return FONT_SIZE
			}
			const value = selectedObject.get("fontSize") || FONT_SIZE;
			// curretly , gradiant & patterns are not supported
			return value;
		},
		changeFontSize: (value: number) => {
			canvas.getActiveObjects().forEach((object) => {
				if (isTextType(object.type)) {
					object._set("fontSize", value);
				}
			});
			canvas.renderAll();
		},
		canvas,
		selectedObjects,
	};
};
export const useEditor = ({ clearSelectionCallback }: EditorHookProps) => {
	const [canvas, setCanvas] = useState<null | fabric.Canvas>(null);
	const [container, setContainer] = useState<HTMLDivElement | null>(null);
	const [selectedObjects, setSelectedObjects] = useState<fabric.Object[]>([]);

	const [fillColor, setFillColor] = useState<string>(FILL_COLOR);
	const [strokeColor, setStrokeColor] = useState<string>(STROKE_COLOR);
	const [strokeWidth, setStrokeWidth] = useState<number>(STROKE_WIDTH);
	const [strokeDashArray, setStrokeDashArray] =
		useState<number[]>(STROKE_DASH_ARRAY);
	const [fontFamily, setFontFamily] = useState<string>(FONT_FAMILY);
	const {copy, paste} = useClipboard({canvas})

	useAutoResize({
		canvas,
		container,
	});

	useCanvasEvents({
		canvas,
		setSelectedObjects,
		clearSelectionCallback,
	});

	const editor = useMemo(() => {
		if (canvas)
			return buildEditor({
				canvas,
				fillColor,
				setFillColor,
				strokeColor,
				setStrokeColor,
				strokeWidth,
				setStrokeWidth,
				selectedObjects,
				strokeDashArray,
				setStrokeDashArray,
				fontFamily,
				setFontFamily,
				copy,
			 paste
			});
		return undefined;
	}, [
		canvas,
		fillColor,
		fontFamily,
		strokeColor,
		strokeWidth,
		selectedObjects,
		strokeDashArray,
		copy, paste
	]);

	const init = useCallback(
		({
			initialCanvas,
			initialContainer,
		}: {
			initialCanvas: fabric.Canvas;
			initialContainer: HTMLDivElement;
		}) => {
			fabric.Object.prototype.set({
				cornerColor: "#FFF",
				cornerStyle: "circle",
				borderColor: "#3b82f6",
				borderScaleFactor: 1.5,
				transparentCorners: false,
				borderOpacityWhenMoving: 1,
				cornerStrokeColor: "#3b82f6",
			});
			const initialWorkspace = new fabric.Rect({
				width: 600,
				height: 900,
				name: "clip",
				fill: "white",
				selectable: false,
				hasControls: false,
				shadow: new fabric.Shadow({
					color: "rgba(0,0,0,0.1)",
					blur: 5,
				}),
			});
			// Set canvas dimensions first
			initialCanvas.setWidth(initialContainer.offsetWidth);
			initialCanvas.setHeight(initialContainer.offsetHeight);

			// Add to canvas first
			initialCanvas.add(initialWorkspace);

			// Set as clip path
			initialCanvas.clipPath = initialWorkspace;
			// Then center it
			initialCanvas.centerObject(initialWorkspace);
			setCanvas(initialCanvas);
			setContainer(initialContainer);
		},
		[],
	);

	return { init, editor };
};
