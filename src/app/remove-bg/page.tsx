import type { Metadata } from "next";
import { BackgroundRemover } from "@/components/background-remover";

export const metadata: Metadata = {
	title: "Remove Background - Image AI",
	description: "Remove the background from any image using AI",
};

export default function RemoveBackgroundPage() {
	return (
		<div className="container mx-auto py-8 px-4">
			<div className="max-w-3xl mx-auto">
				<div className="mb-8 text-center">
					<h1 className="text-3xl font-bold mb-2">Remove Background</h1>
					<p className="text-gray-600">
						Upload an image and remove its background using AI. Processing
						happens directly in your browser.
					</p>
				</div>

				<BackgroundRemover />

				<div className="mt-12 bg-gray-50 p-6 rounded-lg border text-sm text-gray-600">
					<h3 className="text-lg font-medium text-gray-900 mb-2">
						About this tool
					</h3>
					<p className="mb-4">
						This tool uses the RMBG-1.4 model from BriaAI to remove backgrounds
						from images. The model runs entirely in your browser using WebGL
						acceleration, ensuring your images never leave your device.
					</p>
					<p className="mb-4">
						When you first use this tool, it needs to download the model
						(approximately 60MB). This may take a moment depending on your
						internet connection, but it will be cached for future use.
					</p>
					<p>
						For best results, use images with clear subjects and backgrounds.
						The model works well with people, products, animals, and objects
						with defined edges.
					</p>
				</div>
			</div>
		</div>
	);
}
