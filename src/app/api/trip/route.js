import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

export async function POST(req) {
  try {
    const { location, days, interests } = await req.json();

    if (!location || !days || !interests || !interests.length) {
      return NextResponse.json(
        { message: "Missing required fields." },
        { status: 400 }
      );
    }
    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
      responseMimeType: "application/json",
    };
    const prompt = `Create a travel itinerary for ${location} for ${days} days. The user is interested in ${interests.join(
      ", "
    )}  .`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      generationConfig,
      contents: prompt,
    });

    const aiMessage = response.text || "No plan generated.";

    return NextResponse.json({ itinerary: aiMessage }, { status: 200 });
  } catch (error) {
    console.error("Error from Google GenAI:", error);
    return NextResponse.json(
      { message: "Failed to generate itinerary." },
      { status: 500 }
    );
  }
}
