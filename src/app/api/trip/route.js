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
      temperature: 0.2,
      topP: 0.85,
      topK: 40,
      maxOutputTokens: 100,
    };

    const prompt = `Create a travel itinerary for the location ${location} for ${days} days, based on interests ${interests}.
 Return the itinerary as a single valid JSON object only.
 The JSON object should have keys "day1", "day2", etc.
 Each day is an array containing:
 - "morning": an array of objects with the following keys do not ever give any other keys:
  - "activityName": string
  - "activitydescription": string
 - "price": string or number only and make sure the currency
  - "notes": string

 Each activity should be a separate object within the respective time of day and Ensure that all activities for each day are within 3-5 kilometers of each other to minimize travel

 Do NOT include any explanations, markdown formatting, or text outside the JSON.
 follow this format strictly and ensure the JSON is valid. and for all array of day like morning, afternoon, evening, and night only one ectivity must be there and the activity must be in this format:

 {

 "day1": {

  "morning": {

   {

    "activityName": "Fremantle Prison",
    "activitydescription": "Visit the historic Fremantle Prison, a UNESCO World Heritage site.(you can genrate funny descrption when it's funny add funny emoji)",
    "price": "$20",

    "notes": "Buy tickets online"

   },

  }
  "afternoon": {
 {

    "activityName": "Cottesloe Beach",
    "activitydescription": "Relax at Cottesloe Beach, famous for its stunning sunsets.",
    "price": "$0",
    "notes": "Bring sunscreen",

  },

  },

  "evening": {

  same format for evening activities

  },

  "night": {

   {

     same format for night activities

   }

  }
 please follow this format strictly and ensure the JSON is valid.

 }`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",

      generationConfig,

      contents: prompt,
      stream: true,
    });

    let rawText = response.text;

    const codeBlockRegex = /^```json\s*([\s\S]*?)```$/;

    const match = rawText.match(codeBlockRegex);

    if (match && match[1]) {
      rawText = match[1].trim();
    }

    let itineraryData;

    try {
      itineraryData = JSON.parse(rawText);
    } catch (e) {
      console.error("Failed to parse JSON:", e);

      return NextResponse.json(
        { message: "Invalid JSON response from AI." },

        { status: 500 }
      );
    }

    return NextResponse.json({ itinerary: itineraryData }, { status: 200 });
  } catch (error) {
    console.error("Error from Google GenAI:", error);

    return NextResponse.json(
      { message: "Failed to generate itinerary." },

      { status: 500 }
    );
  }
}
