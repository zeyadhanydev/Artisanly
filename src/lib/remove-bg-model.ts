import type { Pipeline } from "@huggingface/transformers";

/**
 * Interface for the remove background result
 */
interface RemoveBackgroundResult {
	image: string; // Base64 encoded image with transparent background
	error?: string; // Error message if processing failed
}

let pipe: Pipeline | null = null;

/**
 * Initializes the background removal model
 * @returns Promise that resolves when the model is loaded
 */
export async function initRemoveBackgroundModel(): Promise<void> {
	if (typeof window === "undefined") {
		console.warn(
			"Background removal model can only be initialized in browser environment",
		);
		return;
	}

	if (pipe) {
		return; // Already initialized
	}

	try {
		// Dynamically import transformers.js to avoid SSR issues
		const { pipeline } = await import("@huggingface/transformers");

		// Initialize the pipeline with RMBG-1.4 model
		pipe = await pipeline("image-segmentation", "briaai/RMBG-1.4", {
			trust_remote_code: true,
		});

		console.log("Background removal model initialized successfully");
	} catch (error) {
		console.error("Failed to initialize background removal model:", error);
		throw new Error("Failed to initialize background removal model");
	}
}

/**
 * Removes the background from an image
 * @param imageUrl URL of the image (can be a blob URL, data URL, or remote URL)
 * @returns Promise that resolves with the processed image as a base64 string
 */
export async function removeBackground(
	imageUrl: string,
): Promise<RemoveBackgroundResult> {
	try {
		if (!pipe) {
			await initRemoveBackgroundModel();

			if (!pipe) {
				throw new Error("Background removal model not initialized");
			}
		}

		// Create an image element to load the image
		const imageEl = new Image();
		imageEl.crossOrigin = "anonymous"; // Enable CORS for remote images

		// Wait for the image to load
		await new Promise<void>((resolve, reject) => {
			imageEl.onload = () => resolve();
			imageEl.onerror = () => reject(new Error("Failed to load image"));
			imageEl.src = imageUrl;
		});

		// Process the image with the model
		const result = await pipe(imageEl.src);

		if (!result || !result[0] || !result[0].mask) {
			throw new Error("Invalid model output");
		}

		// Get the mask from the model output
		const mask = result[0].mask;

		// Get original image dimensions
		const origWidth = imageEl.naturalWidth;
		const origHeight = imageEl.naturalHeight;

		// Create canvas for result
		const canvas = document.createElement("canvas");
		canvas.width = origWidth;
		canvas.height = origHeight;
		const ctx = canvas.getContext("2d");

		if (!ctx) {
			throw new Error("Failed to get canvas context");
		}

		// Draw original image
		ctx.drawImage(imageEl, 0, 0);
		const imageData = ctx.getImageData(0, 0, origWidth, origHeight);

		// Process mask data
		if (!mask || !mask.data || !mask.width || !mask.height) {
			throw new Error("Invalid mask data");
		}

		// Convert mask data to array and find min/max values
		const maskArray = new Float32Array(mask.width * mask.height);
		let min = Infinity;
		let max = -Infinity;

		for (let i = 0; i < mask.width * mask.height; i++) {
			const value = mask.data[i] || 0;
			maskArray[i] = value;
			min = Math.min(min, value);
			max = Math.max(max, value);
		}

		// Normalize mask values
		for (let i = 0; i < maskArray.length; i++) {
			maskArray[i] = (maskArray[i] - min) / (max - min);
		}

		// Apply mask to image alpha channel
		const data = imageData.data;
		const scaleX = origWidth / mask.width;
		const scaleY = origHeight / mask.height;

		for (let y = 0; y < origHeight; y++) {
			for (let x = 0; x < origWidth; x++) {
				// Calculate mask position
				const maskX = Math.floor(x / scaleX);
				const maskY = Math.floor(y / scaleY);
				const maskIndex = maskY * mask.width + maskX;

				// Calculate target image position
				const imageIndex = (y * origWidth + x) * 4;

				// Set alpha channel based on mask value
				const alpha = Math.round(maskArray[maskIndex] * 255);
				data[imageIndex + 3] = alpha;
			}
		}

		// Put processed data back to canvas
		ctx.putImageData(imageData, 0, 0);

		// Convert to base64
		const base64Image = canvas.toDataURL("image/png");

		return { image: base64Image };
	} catch (error) {
		console.error("Error removing background:", error);
		return {
			image: imageUrl, // Return original image on error
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

/**
 * Checks if the background removal model is loaded
 * @returns Boolean indicating if the model is loaded
 */
export function isModelLoaded(): boolean {
	return pipe !== null;
}

/**
 * Fetches an image from a URL and returns a Blob URL
 * Useful for handling CORS issues with remote images
 * @param url The URL of the image to fetch
 * @returns Promise that resolves with a Blob URL
 */
export async function fetchImageAsBlob(url: string): Promise<string> {
	try {
		const response = await fetch(url, { mode: "cors" });
		if (!response.ok) {
			throw new Error(
				`Failed to fetch image: ${response.status} ${response.statusText}`,
			);
		}

		const blob = await response.blob();
		return URL.createObjectURL(blob);
	} catch (error) {
		console.error("Error fetching image:", error);
		throw error;
	}
}
