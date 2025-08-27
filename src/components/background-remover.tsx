"use client";

import { DownloadCloud, Link as LinkIcon, Loader2, Upload } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	fetchImageAsBlob,
	initRemoveBackgroundModel,
	isModelLoaded,
	removeBackground,
} from "@/lib/remove-bg-model";

export interface BackgroundRemoverProps {
	initialImage?: string;
	onProcessed?: (result: string) => void;
}

export function BackgroundRemover({
	initialImage,
	onProcessed,
}: BackgroundRemoverProps) {
	const [originalImage, setOriginalImage] = useState<string | null>(
		initialImage || null,
	);
	const [resultImage, setResultImage] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isModelReady, setIsModelReady] = useState<boolean>(false);
	const [status, setStatus] = useState<string>("Initializing...");
	const [imageUrl, setImageUrl] = useState<string>("");
	const [error, setError] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Initialize the model on component mount
	useEffect(() => {
		async function loadModel() {
			if (typeof window === "undefined") return;

			try {
				setStatus("Loading background removal model...");
				await initRemoveBackgroundModel();
				setIsModelReady(true);
				setStatus("Model ready");
			} catch (err) {
				console.error("Failed to load model:", err);
				setStatus("Failed to load model");
				setError(
					"Could not load the background removal model. Please try again later.",
				);
			}
		}

		if (!isModelLoaded()) {
			loadModel();
		} else {
			setIsModelReady(true);
			setStatus("Model ready");
		}
	}, []);

	// Handle file upload
	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		try {
			setError(null);
			const fileUrl = URL.createObjectURL(file);
			setOriginalImage(fileUrl);
			setResultImage(null);
		} catch (err) {
			setError("Failed to load image. Please try another file.");
			console.error("Error loading file:", err);
		}
	};

	// Handle image URL input
	const handleUrlSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!imageUrl.trim()) {
			setError("Please enter a valid image URL");
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			setStatus("Fetching image...");
			const blobUrl = await fetchImageAsBlob(imageUrl);
			setOriginalImage(blobUrl);
			setResultImage(null);
			setStatus("Image loaded");
		} catch (err) {
			setError("Failed to load image from URL. Check the URL and try again.");
			console.error("Error loading image from URL:", err);
		} finally {
			setIsLoading(false);
		}
	};

	// Process the image to remove background
	const processImage = async () => {
		if (!originalImage || !isModelReady) return;

		setIsLoading(true);
		setError(null);

		try {
			setStatus("Removing background...");
			const result = await removeBackground(originalImage);

			if (result.error) {
				throw new Error(result.error);
			}

			setResultImage(result.image);
			setStatus("Background removed successfully");

			if (onProcessed) {
				onProcessed(result.image);
			}
		} catch (err) {
			setError("Failed to remove background. Please try another image.");
			console.error("Error removing background:", err);
		} finally {
			setIsLoading(false);
		}
	};

	// Handle download of the processed image
	const handleDownload = () => {
		if (!resultImage) return;

		const link = document.createElement("a");
		link.href = resultImage;
		link.download = "image-without-background.png";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	return (
		<div className="flex flex-col gap-6 w-full max-w-3xl mx-auto">
			{error && (
				<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
					{error}
				</div>
			)}

			<div className="flex flex-col gap-3">
				<div className="text-sm font-medium text-gray-700">Upload Image</div>

				<div className="flex flex-col sm:flex-row gap-3">
					<Input
						type="file"
						accept="image/*"
						ref={fileInputRef}
						onChange={handleFileChange}
						className="hidden"
					/>

					<Button
						onClick={() => fileInputRef.current?.click()}
						className="flex-1"
						variant="outline"
					>
						<Upload className="mr-2 h-4 w-4" /> Select Image
					</Button>

					<div className="flex-1 flex gap-2">
						<Input
							type="text"
							placeholder="Or enter image URL..."
							value={imageUrl}
							onChange={(e) => setImageUrl(e.target.value)}
							className="flex-1"
						/>
						<Button
							onClick={handleUrlSubmit}
							disabled={isLoading || !imageUrl.trim()}
							variant="outline"
						>
							<LinkIcon className="h-4 w-4" />
						</Button>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
				<div className="flex flex-col gap-2">
					<div className="text-sm font-medium text-gray-700">
						Original Image
					</div>
					<div className="border rounded-lg aspect-square flex items-center justify-center bg-gray-50 overflow-hidden relative">
						{originalImage ? (
							<Image
								src={originalImage}
								alt="Original"
								fill
								className="object-contain"
							/>
						) : (
							<div className="text-gray-400 text-sm text-center p-4">
								No image selected
							</div>
						)}
					</div>
				</div>

				<div className="flex flex-col gap-2">
					<div className="text-sm font-medium text-gray-700">Result</div>
					<div className="border rounded-lg aspect-square flex items-center justify-center bg-gray-50 overflow-hidden relative">
						{resultImage ? (
							<Image
								src={resultImage}
								alt="Result"
								fill
								className="object-contain"
							/>
						) : (
							<div className="text-gray-400 text-sm text-center p-4">
								Process an image to see result
							</div>
						)}
					</div>
				</div>
			</div>

			<div className="flex flex-col sm:flex-row gap-3 justify-center">
				<Button
					onClick={processImage}
					disabled={!originalImage || isLoading || !isModelReady}
					className="flex-1 sm:flex-initial"
				>
					{isLoading ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							{status}
						</>
					) : (
						"Remove Background"
					)}
				</Button>

				<Button
					onClick={handleDownload}
					disabled={!resultImage || isLoading}
					variant="outline"
					className="flex-1 sm:flex-initial"
				>
					<DownloadCloud className="mr-2 h-4 w-4" />
					Download Result
				</Button>
			</div>

			<div className="text-xs text-gray-500 text-center">
				{!isModelReady ? (
					<div className="flex items-center justify-center">
						<Loader2 className="mr-2 h-3 w-3 animate-spin" />
						{status}
					</div>
				) : (
					status
				)}
			</div>
		</div>
	);
}
