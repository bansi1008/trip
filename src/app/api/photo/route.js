// app/api/photo/route.js
import axios from "axios";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const place_id = searchParams.get("place_id");

  if (!place_id) {
    return new Response(
      JSON.stringify({ error: "Missing place_id parameter" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  try {
    // Get place details including photos
    const detailsRes = await axios.get(
      "https://maps.googleapis.com/maps/api/place/details/json",
      {
        params: {
          place_id,
          key: apiKey,
          fields: "photos",
        },
      }
    );

    const photos = detailsRes.data.result.photos;

    if (photos && photos.length > 0) {
      const photo_reference = photos[0].photo_reference;

      // Construct photo URL to send back to frontend
      const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photo_reference}&key=${apiKey}`;

      return new Response(JSON.stringify({ photoUrl }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      return new Response(
        JSON.stringify({ error: "No photo available for this place" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error("Error fetching photo:", error.message);
    return new Response(JSON.stringify({ error: "Failed to fetch photo" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
