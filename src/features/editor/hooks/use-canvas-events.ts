import type { fabric } from "fabric";
import { useEffect } from "react";

interface UseCanvasEventsProps {
	save: () => void;
	canvas: fabric.Canvas | null;
	setSelectedObjects: (objects: fabric.Object[]) => void;
	clearSelectionCallback?: () => void;
}

export const useCanvasEvents = ({
	canvas,
	setSelectedObjects,
	clearSelectionCallback,
	save,
}: UseCanvasEventsProps) => {
	useEffect(() => {
		if (canvas) {
			// save the canvas object state to history on add, remove, modify
			canvas.on("object:added", () => save());
			canvas.on("object:removed", () => save());
			canvas.on("object:modified", () => save());
			canvas.on("selection:created", (e) => {
				setSelectedObjects(e.selected || []);
			});
			canvas.on("selection:updated", (e) => {
				setSelectedObjects(e.selected || []);
			});
			canvas.on("selection:cleared", () => {
				setSelectedObjects([]);
				clearSelectionCallback?.();
			});
		}
		return () => {
			if (canvas) {
				// save the canvas state before removing event listeners
				canvas.off("object:added");
				canvas.off("object:removed");
				canvas.off("object:modified");

				canvas.off("selection:created");
				canvas.off("selection:updated");
				canvas.off("selection:cleared");
			}
		};
	}, [canvas, setSelectedObjects, clearSelectionCallback, save]);
};
