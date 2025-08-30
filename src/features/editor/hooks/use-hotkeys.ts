import { fabric } from "fabric";
import { useEvent } from "react-use";

interface UseHotkeys {
	canvas: fabric.Canvas | null;
	undo: () => void;
	redo: () => void;
	copy: () => void;
	paste: () => void;
	save: (skip?: boolean) => void;
	autoZoom?: (() => void) | undefined;
	zoomIn?: (() => void) | undefined;
	zoomOut?: (() => void) | undefined;
}
export const useHotkeys = ({
	canvas,
	autoZoom,
	copy,
	paste,
	redo,
	save,
	undo,
	zoomIn,
	zoomOut,
}: UseHotkeys) => {
	useEvent("keydown", (event) => {
		const isCtrlKey = event.ctrlKey || event.metaKey;
		const isBackspace = event.key === "Backspace";
		const isInput = ["INPUT", "TEXTAREA"].includes(
			(event.target as HTMLElement).tagName,
		);

		if (isInput) return;
		if (isBackspace) {
			canvas?.remove(...canvas.getActiveObjects());
			canvas?.discardActiveObject();
		}
		if (isCtrlKey && event.key === "z") {
			event.preventDefault();
			undo();
		}
		if (isCtrlKey && event.key === "y") {
			event.preventDefault();
			redo();
		}
		if (isCtrlKey && event.key === "=") {
			event.preventDefault();
			zoomIn?.();
		}
		if (isCtrlKey && event.key === "-") {
			event.preventDefault();
			zoomOut?.();
		}
		if (isCtrlKey && event.key === "0") {
			event.preventDefault();
			autoZoom?.();
		}
		if (isCtrlKey && event.key === "c") {
			event.preventDefault();
			copy();
		}
		if (isCtrlKey && event.key === "v") {
			event.preventDefault();
			paste();
		}
		if (isCtrlKey && event.key === "s") {
			// skip the save in browser
			event.preventDefault();
			save(true);
		}
		if (isCtrlKey && event.key === "a") {
			// skip the save in browser
			event.preventDefault();
			canvas?.discardActiveObject();
			// there is two ways to select all object make call
			// object selectable to false
			// or filter the obj where obj.name !== 'clip'
			// which is the initial workspace
			const allObjects = canvas?.getObjects().filter((obj) => obj.selectable);

			canvas?.setActiveObject(
				new fabric.ActiveSelection(allObjects, { canvas }),
			);
			canvas?.renderAll();
		}
	});
};
