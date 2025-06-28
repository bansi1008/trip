import { getAmadeusToken } from "../../../lib/amadeusToken";

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const origin = searchParams.get("origin");
  const destination = searchParams.get("destination");
  const departureDate = searchParams.get("departureDate");
  const returnDate = searchParams.get("returnDate");
  const adults = parseInt(searchParams.get("adults")) || 1;
  const currencyCode = searchParams.get("currencyCode") || "USD";
  const maxPrice = parseInt(searchParams.get("maxPrice"));
  // set a high maxFlightOffers to get a good sample
  const maxFlightOffers = 100;

  try {
    const token = await getAmadeusToken();

    const body = {
      originDestinations: [
        {
          id: "1",
          originLocationCode: origin,
          destinationLocationCode: destination,
          departureDateTimeRange: { date: departureDate },
        },
      ],
      travelers: Array.from({ length: adults }, (_, i) => ({
        id: `${i + 1}`,
        travelerType: "ADULT",
      })),
      sources: ["GDS"],
      searchCriteria: {
        maxFlightOffers,
      },
      currencyCode,
    };

    if (returnDate) {
      body.originDestinations.push({
        id: "2",
        originLocationCode: destination,
        destinationLocationCode: origin,
        departureDateTimeRange: { date: returnDate },
      });
    }

    const response = await fetch(
      "https://test.api.amadeus.com/v2/shopping/flight-offers",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    // Filter offers within maxPrice
    const filteredOffers = (data.data || []).filter((offer) => {
      const price = parseFloat(offer.price?.grandTotal || "0");
      return maxPrice ? price <= maxPrice : true;
    });

    // Sort descending by price (closest to maxPrice first)
    filteredOffers.sort((a, b) => {
      const priceA = parseFloat(a.price?.grandTotal || "0");
      const priceB = parseFloat(b.price?.grandTotal || "0");
      return priceB - priceA; // descending
    });

    // Pick top 3 offers
    const topOffers = filteredOffers.slice(0, 3);

    const results = topOffers.map((offer) => {
      const airlineCode = offer.validatingAirlineCodes?.[0] || "N/A";
      const airlineName =
        data.dictionaries?.carriers?.[airlineCode] || airlineCode;
      const price = offer.price?.grandTotal;
      const currency = offer.price?.currency || currencyCode;
      const totalDuration = offer.itineraries
        .map((itin) => itin.duration)
        .join(", ");

      const travelerPricing = offer.travelerPricings?.[0];
      const cabin =
        travelerPricing?.fareDetailsBySegment?.[0]?.cabin || "ECONOMY";

      return {
        airline: airlineName,
        price: `${price} ${currency}`,
        travelClass: cabin,
        duration: totalDuration,
      };
    });

    return new Response(JSON.stringify({ flights: results }), { status: 200 });
  } catch (error) {
    console.error("Flight Search Error:", error);
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
    });
  }
}

// import { getAmadeusToken } from "../../../lib/amadeusToken";

// export async function GET(request) {
//   const { searchParams } = new URL(request.url);

//   const origin = searchParams.get("origin");
//   const destination = searchParams.get("destination");
//   const departureDate = searchParams.get("departureDate");
//   const returnDate = searchParams.get("returnDate");
//   const adults = parseInt(searchParams.get("adults")) || 1;
//   const currencyCode = searchParams.get("currencyCode") || "USD";
//   const maxFlightOffers = parseInt(searchParams.get("maxFlightOffers")) || 10;
//   const maxPrice = parseInt(searchParams.get("maxPrice"));

//   try {
//     const token = await getAmadeusToken();

//     const searchCriteria = {
//       maxFlightOffers,
//       flightFilters: {},
//     };

//     if (maxPrice) {
//       searchCriteria.priceRange = { max: maxPrice };
//     }

//     const body = {
//       originDestinations: [
//         {
//           id: "1",
//           originLocationCode: origin,
//           destinationLocationCode: destination,
//           departureDateTimeRange: { date: departureDate },
//         },
//       ],
//       travelers: Array.from({ length: adults }, (_, i) => ({
//         id: `${i + 1}`,
//         travelerType: "ADULT",
//       })),
//       sources: ["GDS"],
//       searchCriteria,
//       currencyCode,
//     };

//     if (returnDate) {
//       body.originDestinations.push({
//         id: "2",
//         originLocationCode: destination,
//         destinationLocationCode: origin,
//         departureDateTimeRange: { date: returnDate },
//       });
//     }

//     const response = await fetch(
//       "https://test.api.amadeus.com/v2/shopping/flight-offers",
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(body),
//       }
//     );

//     const data = await response.json();

//     const filteredOffers = (data.data || []).filter((offer) => {
//       const price = parseFloat(offer.price?.grandTotal || "0");
//       return maxPrice ? price <= maxPrice : true;
//     });

//     const uniqueAirlines = new Map();

//     for (const offer of filteredOffers) {
//       const airlineCode = offer.validatingAirlineCodes?.[0] || "N/A";
//       if (!uniqueAirlines.has(airlineCode)) {
//         const airlineName =
//           data.dictionaries?.carriers?.[airlineCode] || airlineCode;
//         const price = offer.price?.grandTotal;
//         const currency = offer.price?.currency || currencyCode;
//         const totalDuration = offer.itineraries
//           .map((itin) => itin.duration)
//           .join(", ");

//         const travelerPricing = offer.travelerPricings?.[0];
//         const cabin =
//           travelerPricing?.fareDetailsBySegment?.[0]?.cabin || travelClass;

//         const bagInfo =
//           travelerPricing?.fareDetailsBySegment?.[0]?.includedCheckedBags;
//         const baggageAllowance = bagInfo
//           ? `${bagInfo.weight} ${bagInfo.weightUnit}`
//           : "No checked bags";

//         uniqueAirlines.set(airlineCode, {
//           airline: airlineName,
//           price: `${price} ${currency}`,
//           travelClass: cabin,
//           duration: totalDuration,
//           baggageAllowance,
//         });

//         if (uniqueAirlines.size >= 4) break;
//       }
//     }

//     return new Response(
//       JSON.stringify({ flights: Array.from(uniqueAirlines.values()) }),
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Flight Search Error:", error);
//     return new Response(JSON.stringify({ error: "Something went wrong" }), {
//       status: 500,
//     });
//   }
// }

// export async function GET(request) {
//   const { searchsearchParams } = new URL(request.url);

//   const origin = searchsearchParams.get("origin");
//   const destination = searchsearchParams.get("destination");
//   const departureDate = searchsearchParams.get("departureDate");
//   const returnDate = searchsearchParams.get("returnDate"); // optional
//   const adults = parseInt(searchsearchParams.get("adults")) || 1;
//   const children = parseInt(searchsearchParams.get("children")) || 0;
//   const infants = parseInt(searchsearchParams.get("infants")) || 0;
//   const travelClass = searchsearchParams.get("travelClass") || "ECONOMY";
//   const maxFlightOffers = parseInt(searchsearchParams.get("maxFlightOffers")) || 20;
//   const currencyCode = searchsearchParams.get("currencyCode") || "USD";
//   const nonStop = searchsearchParams.get("nonStop") === "true" || false;
//   const includedAirlineCodes = searchsearchParams.get("includedAirlineCodes");
//   const excludedAirlineCodes = searchsearchParams.get("excludedAirlineCodes");

//   try {
//     const token = await getAmadeusToken();

//     // Build originDestinations
//     const originDestinations = [
//       {
//         id: "1",
//         originLocationCode: origin,
//         destinationLocationCode: destination,
//         departureDateTimeRange: { date: departureDate },
//       },
//     ];
//     if (returnDate) {
//       originDestinations.push({
//         id: "2",
//         originLocationCode: destination,
//         destinationLocationCode: origin,
//         departureDateTimeRange: { date: returnDate },
//       });
//     }

//     // Build travelers
//     const travelers = [];
//     let travelerId = 1;
//     for (let i = 0; i < adults; i++) {
//       travelers.push({ id: `${travelerId++}`, travelerType: "ADULT" });
//     }
//     for (let i = 0; i < children; i++) {
//       travelers.push({ id: `${travelerId++}`, travelerType: "CHILD" });
//     }
//     for (let i = 0; i < infants; i++) {
//       travelers.push({ id: `${travelerId++}`, travelerType: "HELD_INFANT" });
//     }

//     const cabinRestrictions = [
//       {
//         cabin: travelClass,
//         coverage: "MOST_SEGMENTS",
//         originDestinationIds: originDestinations.map((od) => od.id),
//       },
//     ];

//     const flightFilters = {
//       cabinRestrictions,
//     };
//     if (nonStop) {
//       flightFilters.connectionRestriction = {
//         maxNumberOfConnections: 0,
//       };
//     }

//     const body = {
//       originDestinations,
//       travelers,
//       sources: ["GDS"],
//       searchCriteria: {
//         maxFlightOffers,
//         flightFilters,
//       },
//       currencyCode,
//     };

//     if (includedAirlineCodes) {
//       body.searchCriteria.includedAirlineCodes =
//         includedAirlineCodes.split(",");
//     }
//     if (excludedAirlineCodes) {
//       body.searchCriteria.excludedAirlineCodes =
//         excludedAirlineCodes.split(",");
//     }

//     const response = await fetch(
//       "https://test.api.amadeus.com/v2/shopping/flight-offers",
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(body),
//       }
//     );

//     const data = await response.json();
//     const uniqueAirlines = new Map();

//     data.data?.forEach((offer) => {
//       const airlineCode = offer.validatingAirlineCodes?.[0] || "";
//       const airlineName =
//         data.dictionaries?.carriers?.[airlineCode] || airlineCode;
//       const priceValue = parseFloat(offer.price?.total || "0");
//       const currency = offer.price?.currency || "";

//       const travelerPricing = offer.travelerPricings?.[0];
//       const bagInfo =
//         travelerPricing?.fareDetailsBySegment?.[0]?.includedCheckedBags;
//       const baggageAllowance = bagInfo
//         ? `${bagInfo.weight} ${bagInfo.weightUnit}`
//         : "No checked bags";

//       const flightInfo = {
//         airline: airlineName,
//         price: `${priceValue} ${currency}`,
//         priceValue,
//         baggageAllowance,
//       };

//       // Add only first offer per airline
//       if (!uniqueAirlines.has(airlineName)) {
//         uniqueAirlines.set(airlineName, flightInfo);
//       }
//     });

//     const top4 = [...uniqueAirlines.values()]
//       .sort((a, b) => a.priceValue - b.priceValue)
//       .slice(0, 4)
//       .map(({ airline, price, baggageAllowance }) => ({
//         airline,
//         price,
//         baggageAllowance,
//       }));

//     return new Response(JSON.stringify({ flights: top4 }), {
//       status: 200,
//       headers: { "Content-Type": "application/json" },
//     });
//   } catch (error) {
//     console.error("Flight Search Error:", error);
//     return new Response(JSON.stringify({ error: "Something went wrong" }), {
//       status: 500,
//       headers: { "Content-Type": "application/json" },
//     });
//   }
// }
