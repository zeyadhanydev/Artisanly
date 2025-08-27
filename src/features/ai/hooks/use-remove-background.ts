import { useState } from "react";
import { useRemoveBgImage } from "@/features/ai/api/use-remove-bg";
import {
  initRemoveBackgroundModel,
  isModelLoaded,
  removeBackground,
} from "@/lib/remove-bg-model";

interface UseRemoveBackgroundOptions {
  preferClientSide?: boolean;
}

interface RemoveBackgroundResult {
  imageUrl: string | null;
  isLoading: boolean;
  error: string | null;
  progress: string;
}

export function useRemoveBackground(options: UseRemoveBackgroundOptions = {}) {
  const [result, setResult] = useState<RemoveBackgroundResult>({
    imageUrl: null,
    isLoading: false,
    error: null,
    progress: "",
  });

  // Server-side API call
  const { mutateAsync: removeBgServer } = useRemoveBgImage();

  // Function to remove background
  const removeBackgroundFromImage = async (imageUrl: string) => {
    setResult({
      imageUrl: null,
      isLoading: true,
      error: null,
      progress: "Processing image...",
    });

    try {
      // Decide whether to use client-side or server-side processing
      if (options.preferClientSide && typeof window !== "undefined") {
        // Use client-side processing
        setResult((prev) => ({
          ...prev,
          progress: "Initializing client-side model...",
        }));

        // Check if model is loaded, if not, initialize it
        if (!isModelLoaded()) {
          setResult((prev) => ({
            ...prev,
            progress: "Loading background removal model...",
          }));
          await initRemoveBackgroundModel();
        }

        setResult((prev) => ({
          ...prev,
          progress: "Removing background...",
        }));

        // Process the image
        const result = await removeBackground(imageUrl);

        if (result.error) {
          throw new Error(result.error);
        }

        setResult({
          imageUrl: result.image,
          isLoading: false,
          error: null,
          progress: "Complete",
        });
      } else {
        // Use server-side processing
        setResult((prev) => ({
          ...prev,
          progress: "Sending to server...",
        }));

        const response = await removeBgServer({ image: imageUrl });

        if (response.error) {
          throw new Error(response.error);
        }

        if (response.fallbackToClient) {
          // Server-side processing failed, fallback to client-side
          setResult((prev) => ({
            ...prev,
            progress: "Falling back to client-side processing...",
          }));
          return removeBackgroundFromImage(imageUrl);
        }

        setResult({
          imageUrl: response.data,
          isLoading: false,
          error: null,
          progress: "Complete",
        });
      }
    } catch (error) {
      console.error("Error removing background:", error);
      setResult({
        imageUrl: null,
        isLoading: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
        progress: "Failed",
      });
    }
  };

  return {
    ...result,
    removeBackground: removeBackgroundFromImage,
    isClientSideAvailable: typeof window !== "undefined",
  };
}
