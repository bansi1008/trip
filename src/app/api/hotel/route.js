import { getAmadeusToken } from "../../../lib/amadeusToken";

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const cityCode = searchParams.get("cityCode"); // e.g. LON
  const checkInDate = searchParams.get("checkInDate"); // YYYY-MM-DD
  const checkOutDate = searchParams.get("checkOutDate"); // YYYY-MM-DD
  const adults = parseInt(searchParams.get("adults")) || 1;
  const maxPrice = searchParams.get("maxPrice"); // total price
  const currency = searchParams.get("currency") || "USD";

  if (!cityCode || !checkInDate || !checkOutDate) {
    return new Response(JSON.stringify({ error: "Missing required params" }), {
      status: 400,
    });
  }

  try {
    const token = await getAmadeusToken();

    let apiUrl = `https://test.api.amadeus.com/v2/shopping/hotel-offers?cityCode=${cityCode}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&adults=${adults}&bestRateOnly=true`;

    if (maxPrice) {
      apiUrl += `&priceRange=0-${maxPrice}&currency=${currency}`;
    }

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    const hotels = (data.data || []).map((offer) => {
      const hotel = offer.hotel;
      const hotelName = hotel.name;
      const hotelId = hotel.hotelId;
      const latitude = hotel.latitude;
      const longitude = hotel.longitude;

      const firstOffer = offer.offers?.[0];
      const total = firstOffer?.price?.total;
      const currency = firstOffer?.price?.currency;

      return {
        hotelId,
        hotelName,
        price: `${total} ${currency}`,
        location: { latitude, longitude },
      };
    });

    return new Response(JSON.stringify({ hotels }), { status: 200 });
  } catch (err) {
    console.error("Hotel Search Error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to fetch hotel offers" }),
      { status: 500 }
    );
  }
}
