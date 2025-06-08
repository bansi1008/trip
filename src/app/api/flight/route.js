// src/app/api/flight/route.js
import { GoogleGenAI, Modality } from "@google/genai";

export async function GET(req) {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const contents =
      "Hi, can you create a image of a pig " +
      "with wings and a top hat flying over a happy " +
      "futuristic scifi city with lots of greenery?";

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: contents,
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });

    const parts = response.candidates[0].content.parts;
    let imageBuffer = null;
    let textDescription = "";

    for (const part of parts) {
      if (part.text) {
        textDescription = part.text;
      } else if (part.inlineData) {
        imageBuffer = Buffer.from(part.inlineData.data, "base64");
      }
    }

    if (imageBuffer) {
      return new Response(imageBuffer, {
        status: 200,
        headers: {
          "Content-Type": "image/png",
          "Content-Disposition": "inline; filename=generated.png",
        },
      });
    } else {
      return new Response(
        JSON.stringify({ error: "Image generation failed." }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    console.error("Error generating image:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
