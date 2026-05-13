import { GoogleGenerativeAI } from "@google/generative-ai";
import type { GenerateImageRequest, GeneratedImage } from "../image-types";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function generateGeminiImages(
  req: GenerateImageRequest,
  count = 4
): Promise<GeneratedImage[]> {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured in .env.local");
  }

  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  
  // Using the latest Imagen 3 model available through the Gemini API
  const model = genAI.getGenerativeModel({ model: "imagen-3.0-generate-001" });

  // Build a rich POD-focused prompt based on style and niche
  const enhancedPrompt = `
    Design for Print-on-Demand (POD). 
    Product: ${req.platform.toUpperCase()} apparel or accessory.
    Style: ${req.style !== 'none' ? req.style : 'Commercial graphic design'}.
    Subject: ${req.prompt}.
    Niche: ${req.platform}.
    Technical: High resolution, clean edges, isolated on plain background if applicable, 
    professional quality, trend-focused.
    Aspect Ratio: ${req.aspectRatio}.
  `.trim();

  // The Gemini Image Generation API currently generates one image per call 
  // or may have specific parameters for multiple. 
  // We'll run them in parallel to match the expected 'count'.
  
  const tasks = Array.from({ length: count }).map(async (_, i) => {
    try {
      const result = await model.generateContent(enhancedPrompt);
      const response = await result.response;
      
      // The response for Imagen usually contains the image data in candidates[0].content.parts[0].inlineData
      // or similar depending on the specific SDK version and model behavior.
      // NOTE: As of current SDK, image generation returns a URL or base64.
      // We will handle the response extraction carefully.
      
      const candidate = response.candidates?.[0];
      const part = candidate?.content?.parts?.[0];
      
      if (!part || !('inlineData' in part) || !part.inlineData) {
        throw new Error("No image data returned from Gemini");
      }

      // Convert base64 to a data URL for immediate display
      const dataUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;

      return {
        id: `gemini-${Math.random().toString(36).slice(2, 10)}`,
        url: dataUrl,
        prompt: req.prompt,
        style: req.style,
        aspectRatio: req.aspectRatio,
        platform: req.platform,
        createdAt: new Date().toISOString(),
        isFavorite: false,
      };
    } catch (err) {
      console.error(`Gemini Image Gen Error (Task ${i}):`, err);
      throw err;
    }
  });

  return Promise.all(tasks);
}
