import { use, useCallback, useRef, useState } from "react";
import { TbHistoryToggle } from "react-icons/tb";
import { JSON_KEYS } from "../types";

type UseHistoryProps = {
	canvas: fabric.Canvas | null;
};

export const useHistory = ({ canvas }: UseHistoryProps) => {
	const [historyIndex, setHistoryIndex] = useState(0);

	const canvasHistory = useRef<string[]>([]);
	// not save when undo and redo
	// prevent canvas events from saving the state again
	// because undo and redo will change the canvas state
	// then there is unwanted save
	const skipSave = useRef(false);

	const canUndo = useCallback(() => {
		// if the current history index is greater than 0 we can undo
		return historyIndex > 0;
	}, [historyIndex]);
	const canRedo = useCallback(() => {
		// if the current history index is less than the length
		// of the history array minus 1 we can redo
		// because the index is 0 based and length is 1 based
		// --- if the current index is 1 then 1 - 1 = 0 the condition is not valid
		return historyIndex < canvasHistory.current.length - 1;
	}, [historyIndex]);

	// Placeholder for history management logic
	const save = useCallback(
		// skip when we want directly save without adding to history
		// like when we load a new image or clear the canvas
		(skip = false) => {
			if (!canvas) return;
			const currentState = canvas.toJSON(JSON_KEYS);
			const json = JSON.stringify(currentState);

			if (!skip && !skipSave.current) {
				canvasHistory.current.push(json);
				setHistoryIndex(canvasHistory.current.length - 1);
			}

			// TODO: Save Callback
		},
		[canvas],
	);
	const undo = useCallback(() => {
		if (canUndo()) {
			skipSave.current = true;
			canvas?.clear().renderAll();

			const previousIndex = historyIndex - 1;
			const previousState = JSON.parse(canvasHistory.current[previousIndex]);
			console.log(previousState);
			canvas?.loadFromJSON(previousState, () => {
				canvas?.renderAll();
				setHistoryIndex(previousIndex);
				skipSave.current = false;
			});
		}
	}, [canUndo, canvas, historyIndex]);

	const redo = useCallback(() => {
		if (canRedo()) {
			skipSave.current = true;
			canvas?.clear().renderAll();

			const nextIndex = historyIndex + 1;
			const nextState = JSON.parse(canvasHistory.current[nextIndex]);

			console.log(nextState);
			canvas?.loadFromJSON(nextState, () => {
				canvas?.renderAll();
				setHistoryIndex(nextIndex);
				skipSave.current = false;
			});
		}
	}, [canRedo, canvas, historyIndex]);
	return { save, redo, undo, canRedo, canUndo, setHistoryIndex, canvasHistory };
};
