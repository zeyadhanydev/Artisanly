import { use, useCallback, useRef, useState } from "react";
import { TbHistoryToggle } from "react-icons/tb";

export const useHistory = () => {
	const [historyIndex, setHistoryIndex] = useState(0);

	const canvasHistory = useRef<string[]>([]);
	// not save when undo and redo
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
	const save = useCallback(() => {
		console.log("saving...");
	}, []);
	return { save };
};
