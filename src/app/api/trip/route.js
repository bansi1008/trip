// import { NextResponse } from "next/server";

// import { GoogleGenAI } from "@google/genai";

// const ai = new GoogleGenAI({
//   apiKey: process.env.GOOGLE_API_KEY,
// });

// export async function POST(req) {
//   try {
//     const { location, days, interests, travelgroup, budget } = await req.json();

//     if (!location || !days || !interests || !travelgroup || !budget) {
//       return NextResponse.json(
//         { message: "Missing required fields." },

//         { status: 400 }
//       );
//     }

//     const generationConfig = {
//       temperature: 0.2,
//       topP: 0.85,
//       topK: 40,
//       maxOutputTokens: 2500,
//     };

//     const prompt = `Create a travel itinerary for the location ${location} for ${days} days, based on interests ${interests} and based on group like ${travelgroup} and must not forget the budget like the trip budget is ${budget}.
//   Return the itinerary as a single valid JSON object only.
//   The JSON object should have keys "day1", "day2", etc.
//   Each day is an array containing:
//   - "morning": an array of objects with the following keys do not ever give any other keys:
//     - "activityName": string
//     - "activitydescription": string
//   - "price": string or number only and make sure the currency
//     - "notes": string

//   Each activity should be a separate object within the respective time of day and Ensure that all activities for each day are within 3-5 kilometers of each other to minimize travel

//   Do NOT include any explanations, markdown formatting, or text outside the JSON.
//   follow this format strictly and ensure the JSON is valid. and for all array of day like morning, afternoon, evening, and night only one ectivity must be there and the activity must be in this format:

//   {

//   "day1": {

//     "morning": {

//     {

//       "activityName": "Fremantle Prison",
//       "activitydescription": "Visit the historic Fremantle Prison, a UNESCO World Heritage site.(you can genrate funny descrption when it's funny add funny emoji)",
//       "price": "$20",

//       "notes": "Buy tickets online"

//     },

//     }
//     "afternoon": {
//   {

//       "activityName": "Cottesloe Beach",
//       "activitydescription": "Relax at Cottesloe Beach, famous for its stunning sunsets.",
//       "price": "$0",
//       "notes": "Bring sunscreen",

//     },

//     },

//     "evening": {

//     same format for evening activities

//     },

//     "night": {

//     {

//       same format for night activities

//     }

//     }
//   please follow this format strictly and ensure the JSON is valid.

//   }`;
//     const totalBudgetNum = Number(budget.match(/\d+/)[0]);

//     const estimatedActivityCost = 100 * days;

//     const hotelBudget = totalBudgetNum - estimatedActivityCost;

//     const hotelPrompt = `Suggest only 3 hotels in ${location}, within 3 to 5 km of the main tourist attractions.
//   Hotels must be suitable for a ${travelgroup} traveler and my total budget to spend in hotel is${hotelBudget}.
//   For example, if the budget is ${hotelBudget} for ${days} days, suggest hotels with pricePerNight around ${
//       hotelBudget / days
//     }- ${hotelBudget / days + 50}.

//   Return a valid JSON array only. Each hotel must be an object with:
//   - "hotelName": string
//   - "distanceFromCenterInKm": number
//   - "pricePerNight": string (with currency)
//   - "rating": number (out of 5)
//   - "address": string`;

//     const response = await ai.models.generateContentStream({
//       model: "gemini-2.0-flash",
//       generationConfig,
//       contents: prompt,
//     });

//     let rawText = "";
//     for await (const chunk of stream) {
//       rawText += chunk.text;
//     }

//     const codeBlockRegex = /^```json\s*([\s\S]*?)```$/;

//     const match = rawText.match(codeBlockRegex);

//     if (match && match[1]) {
//       rawText = match[1].trim();
//     }

//     let itineraryData;

//     try {
//       itineraryData = JSON.parse(rawText);
//     } catch (e) {
//       console.error("Failed to parse JSON:", e);

//       return NextResponse.json(
//         { message: "Invalid JSON response from AI." },

//         { status: 500 }
//       );
//     }

//     const hotelsRes = await ai.models.generateContent({
//       model: "gemini-2.0-flash",
//       generationConfig,
//       contents: hotelPrompt,
//     });

//     const hotelsText = hotelsRes.text;
//     const parsedHotels = parseJSON(hotelsText);

//     if (!Array.isArray(parsedHotels)) {
//       return NextResponse.json(
//         { message: "Invalid hotel format." },
//         { status: 500 }
//       );
//     }

//     return NextResponse.json(
//       { itinerary: itineraryData, hotel: parsedHotels },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error from Google GenAI:", error);

//     return NextResponse.json(
//       { message: "Failed to generate itinerary." },

//       { status: 500 }
//     );
//   }
// }

// function parseJSON(text) {
//   try {
//     const codeBlockRegex = /^```(?:json)?\s*([\s\S]*?)\s*```$/;
//     const match = text.match(codeBlockRegex);
//     const raw = match ? match[1].trim() : text;
//     return JSON.parse(raw);
//   } catch (e) {
//     console.error("JSON parse error:", e);
//     return null;
//   }
// }

export const runtime = "edge"; // Use Edge Functions for lower latency
import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { authenticateRequest } from "../../../lib/authMiddleware";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

export async function POST(req) {
  const user = await authenticateRequest(req);

  if (!user) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();
    const { location, days, interests, travelgroup, budget } = body;

    if (!location) {
      return NextResponse.json(
        { message: "Missing location fields." },
        { status: 400 }
      );
    }

    if (!days) {
      return NextResponse.json(
        { message: "Missing days fields." },
        { status: 400 }
      );
    }
    if (!interests) {
      return NextResponse.json(
        { message: "Missing interests fields." },
        { status: 400 }
      );
    }
    if (!travelgroup) {
      return NextResponse.json(
        { message: "Missing travelgroup fields." },
        { status: 400 }
      );
    }
    if (!budget) {
      return NextResponse.json(
        { message: "Missing budget fields." },
        { status: 400 }
      );
    }

    const generationConfig = {
      temperature: 0.2,
      topP: 0.85,
      topK: 40,
      maxOutputTokens: 2500,
    };

    const prompt = `Create a travel itinerary for the location ${location} for ${days} days, based on interests ${interests} and based on group like ${travelgroup} and must not forget the budget like the trip budget is ${budget}.
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
    },
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
  }
  please follow this format strictly and ensure the JSON is valid.
}`;

    const totalBudgetNum = Number(budget.match(/\d+/)[0]);
    const estimatedActivityCost = 60 * days;
    const fin = estimatedActivityCost * travelgroup;
    const hotelBudget = totalBudgetNum - estimatedActivityCost;

    const hotelPrompt = `Suggest only 3 hotels in ${location}, within 3 to 5 km of the main tourist attractions.
  Hotels must be suitable for a ${travelgroup} traveler and my total budget to spend in hotel is${hotelBudget}.
  For example, if the budget is ${hotelBudget} for ${days} days, suggest hotels with pricePerNight around ${
      hotelBudget / days
    }- ${hotelBudget / days + 50}.

  Return a valid JSON array only. Each hotel must be an object with:
  - "hotelName": string
  - "distanceFromCenterInKm": number
  - "pricePerNight": string (with currency)
  - "rating": number (out of 5)
  - "address": string`;

    // Parallelize streaming API calls
    const [itineraryStream, hotelsStream] = await Promise.all([
      ai.models.generateContentStream({
        model: "gemini-2.0-flash",
        generationConfig,
        contents: prompt,
      }),
      ai.models.generateContentStream({
        model: "gemini-2.0-flash",
        generationConfig,
        contents: hotelPrompt,
      }),
    ]);

    let itineraryText = "";
    for await (const chunk of itineraryStream) {
      itineraryText += chunk.text;
    }

    let hotelsText = "";
    for await (const chunk of hotelsStream) {
      // Use streaming for hotels
      hotelsText += chunk.text;
    }

    const codeBlockRegex = /^```json\s*([\s\S]*?)```$/;
    const match = itineraryText.match(codeBlockRegex);
    if (match && match[1]) {
      itineraryText = match[1].trim();
    }

    let itineraryData;
    try {
      itineraryData = JSON.parse(itineraryText);
    } catch (e) {
      console.error("Failed to parse JSON:", e);
      return NextResponse.json(
        { message: "Invalid JSON response from AI." },
        { status: 500 }
      );
    }

    const parsedHotels = parseJSON(hotelsText);
    if (!Array.isArray(parsedHotels)) {
      return NextResponse.json(
        { message: "Invalid hotel format." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { itinerary: itineraryData, hotel: parsedHotels },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error from Google GenAI:", error);
    return NextResponse.json(
      { message: "Failed to generate itinerary." },
      { status: 500 }
    );
  }
}

function parseJSON(text) {
  try {
    const codeBlockRegex = /^```(?:json)?\s*([\s\S]*?)\s*```$/;
    const match = text.match(codeBlockRegex);
    const raw = match ? match[1].trim() : text;
    return JSON.parse(raw);
  } catch (e) {
    console.error("JSON parse error:", e);
    return null;
  }
}
