import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req) {
  try {
    const { location, days, interests } = await req.json();

    if (!location || !days || !interests || !interests.length) {
      return NextResponse.json(
        { message: "Missing required fields." },
        { status: 400 }
      );
    }

    const prompt = `
You are a smart travel planner. Suggest a detailed ${days}-day itinerary for a trip to ${location}.
Focus on interests like ${interests.join(", ")}.
Each day's plan should include sightseeing spots, food places, and activities.
`;

    const ollamaResponse = await axios.post("http://localhost:11434/api/chat", {
      model: "llama3", // or whatever model you’re using
      messages: [{ role: "user", content: prompt }],
      stream: false,
    });

    const aiMessage =
      ollamaResponse.data.message?.content || "No plan generated.";

    return NextResponse.json({ itinerary: aiMessage }, { status: 200 });
  } catch (error) {
    console.error("Error from Ollama:", error.message);
    return NextResponse.json(
      { message: "Failed to generate itinerary." },
      { status: 500 }
    );
  }
}
