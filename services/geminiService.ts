

import { GoogleGenAI, Modality } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

// Fix: Added an interface to define the return type of the fileToBase64 function.
interface FileConversionResult {
    base64Data: string;
    mimeType: string;
}

// Fix: Added types to the function parameter and return value to allow TypeScript to correctly infer the type of the resolved promise.
export const fileToBase64 = (file: File): Promise<FileConversionResult> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result;
            if (typeof result === 'string') {
                const base64Data = result.split(',')[1];
                resolve({ base64Data, mimeType: file.type });
            } else {
                reject(new Error("Failed to read file as a data URL."));
            }
        };
        reader.onerror = (error) => reject(error);
    });
};

// Fix: Added types to function parameters for improved type safety.
export const generateImage = async (prompt: string, aspectRatio: string) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/png',
            aspectRatio,
        },
    });

    const base64ImageBytes = response.generatedImages[0]?.image.imageBytes;
    if (!base64ImageBytes) {
        throw new Error("Image generation failed, no image bytes returned.");
    }
    return base64ImageBytes;
};

// Fix: Added types to function parameters for improved type safety.
export const editImage = async (base64Data: string, mimeType: string, prompt: string) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                { inlineData: { data: base64Data, mimeType } },
                { text: prompt },
            ],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            return part.inlineData.data;
        }
    }

    throw new Error("Image editing failed, no image data in response.");
};

// Fix: Added types to function parameters for improved type safety.
export const analyzeImageSimple = async (base64Data: string, mimeType: string, prompt: string) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
            parts: [
                { inlineData: { data: base64Data, mimeType } },
                { text: prompt },
            ],
        },
    });
    return response.text;
};

// Fix: Added types to function parameters for improved type safety.
export const analyzeImageComplex = async (base64Data: string, mimeType: string, prompt: string) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: {
            parts: [
                { inlineData: { data: base64Data, mimeType } },
                { text: prompt },
            ],
        },
        config: {
            thinkingConfig: { thinkingBudget: 32768 },
        },
    });
    return response.text;
};