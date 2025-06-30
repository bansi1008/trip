import { getAmadeusToken } from "../../../lib/amadeusToken";
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get("keyword");

  try {
    const token = await getAmadeusToken();

    const response = await fetch(
      `https://test.api.amadeus.com/v1/reference-data/locations?keyword=${encodeURIComponent(
        keyword
      )}&subType=AIRPORT`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();
    const firstAirport = data?.data?.[0];

    return new Response(
      JSON.stringify({ iataCode: firstAirport?.iataCode || "Not found" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("IATA lookup error:", error);
    return new Response(JSON.stringify({ error: "IATA lookup failed" }), {
      status: 500,
    });
  }
}
