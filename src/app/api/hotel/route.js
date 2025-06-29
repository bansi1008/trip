// File: src/app/api/hotel/route.js
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city");
  const adults = searchParams.get("adults") || "2";
  const nights = searchParams.get("nights") || "2";

  if (!city) {
    return new Response(JSON.stringify({ error: "City is required" }), {
      status: 400,
    });
  }

  const headers = {
    "x-rapidapi-key": "40760bf1a2mshd5763c0b64bacc5p1d2d79jsn3bf6908bc8ab", // replace with your key
    "x-rapidapi-host": "travel-advisor.p.rapidapi.com",
  };

  try {
    const locRes = await fetch(
      `https://travel-advisor.p.rapidapi.com/locations/search?query=${city}&lang=en_US`,
      { headers }
    );
    const locData = await locRes.json();
    const locationId = locData?.data?.[0]?.result_object?.location_id;

    if (!locationId) {
      return new Response(JSON.stringify({ hotels: [] }), { status: 200 });
    }

    const hotelRes = await fetch(
      `https://travel-advisor.p.rapidapi.com/hotels/list?location_id=${locationId}&adults=${adults}&rooms=1&nights=${nights}&offset=0&currency=USD&order=asc&limit=10&sort=recommended&lang=en_US`,
      { headers }
    );
    const hotelData = await hotelRes.json();

    const hotels = (hotelData?.data || [])
      .filter((h) => h.name && h.price)
      .map((h) => ({
        name: h.name,
        price: h.price,
        rating: h.rating,
        location: h.location_string,
        distance: h.distance,
        hotel_class: h.hotel_class,
      }));

    return new Response(JSON.stringify({ hotels }), { status: 200 });
  } catch (error) {
    console.error("Hotel Search Error:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch hotels" }), {
      status: 500,
    });
  }
}
