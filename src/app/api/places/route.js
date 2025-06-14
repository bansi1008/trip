// app/api/places/route.js
import axios from "axios";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const input = searchParams.get("input");

  const apiKey = process.env.GOOGLE_MAPS_API_KEY; // store key in .env

  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&types=(cities)&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch suggestions" }),
      {
        status: 500,
      }
    );
  }
}
