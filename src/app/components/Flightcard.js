"use client";
import { useState, useEffect } from "react";

export default function Flightcard() {
  const [flightdata, setflightdata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIATACode = async (location) => {
      // Common city to IATA code mappings for major cities
      const cityMappings = {
        london: "LHR",
        "new york": "JFK",
        "new york city": "JFK",
        nyc: "JFK",
        paris: "CDG",
        tokyo: "NRT",
        "los angeles": "LAX",
        chicago: "ORD",
        miami: "MIA",
        "san francisco": "SFO",
        boston: "BOS",
        seattle: "SEA",
        atlanta: "ATL",
        denver: "DEN",
        "las vegas": "LAS",
        philadelphia: "PHL",
        washington: "DCA",
        dallas: "DFW",
        houston: "IAH",
        toronto: "YYZ",
        vancouver: "YVR",
        sydney: "SYD",
        melbourne: "MEL",
        amsterdam: "AMS",
        frankfurt: "FRA",
        munich: "MUC",
        rome: "FCO",
        madrid: "MAD",
        barcelona: "BCN",
        dublin: "DUB",
        zurich: "ZUR",
        vienna: "VIE",
        brussels: "BRU",
        stockholm: "ARN",
        copenhagen: "CPH",
        oslo: "OSL",
        helsinki: "HEL",
        moscow: "SVO",
        istanbul: "IST",
        dubai: "DXB",
        doha: "DOH",
        singapore: "SIN",
        "hong kong": "HKG",
        bangkok: "BKK",
        mumbai: "BOM",
        delhi: "DEL",
        beijing: "PEK",
        shanghai: "PVG",
        seoul: "ICN",
        taipei: "TPE",
        manila: "MNL",
        jakarta: "CGK",
        "kuala lumpur": "KUL",
        cairo: "CAI",
        johannesburg: "JNB",
        "cape town": "CPT",
        lagos: "LOS",
        nairobi: "NBO",
        casablanca: "CMN",
        "rio de janeiro": "GIG",
        "sao paulo": "GRU",
        "buenos aires": "EZE",
        lima: "LIM",
        bogota: "BOG",
        santiago: "SCL",
        "mexico city": "MEX",
        montreal: "YUL",
        calgary: "YYC",
        edmonton: "YEG",
        winnipeg: "YWG",
        ottawa: "YOW",
      };

      const isValidIATACode = (code) => {
        return (
          code &&
          typeof code === "string" &&
          code.length === 3 &&
          /^[A-Z]{3}$/.test(code) &&
          code !== "NOT" && // Avoid "Not found" shortened
          !code.includes("found")
        );
      };

      try {
        // Extract city name from location string (e.g., "Paris, France" -> "Paris")
        const city = location.split(",")[0].trim().toLowerCase();

        // Check if we have a direct mapping for this city
        if (cityMappings[city]) {
          console.log(
            `Using direct mapping for ${city}: ${cityMappings[city]}`
          );
          return cityMappings[city];
        }

        // Try API lookup
        const res = await fetch(
          `/api/iata?keyword=${encodeURIComponent(city)}`
        );

        if (!res.ok) {
          throw new Error(`IATA API error: ${res.status}`);
        }

        const data = await res.json();

        // Validate the returned IATA code
        if (isValidIATACode(data.iataCode)) {
          console.log(
            `API returned valid IATA code for ${city}: ${data.iataCode}`
          );
          return data.iataCode;
        }

        console.log(
          `API returned invalid IATA code for ${city}: ${data.iataCode}`
        );

        // Try to find partial matches in our mappings
        const partialMatch = Object.keys(cityMappings).find(
          (mappedCity) => city.includes(mappedCity) || mappedCity.includes(city)
        );

        if (partialMatch) {
          console.log(
            `Using partial mapping match for ${city}: ${cityMappings[partialMatch]}`
          );
          return cityMappings[partialMatch];
        }

        // Last resort: generate a code from the city name
        const fallbackCode = city
          .replace(/[^a-z]/g, "")
          .substring(0, 3)
          .toUpperCase();
        console.log(`Using fallback code for ${city}: ${fallbackCode}`);
        return fallbackCode || "UNK";
      } catch (error) {
        console.error(`Failed to fetch IATA code for ${location}:`, error);

        // Emergency fallback: try city mappings again
        const city = location.split(",")[0].trim().toLowerCase();
        if (cityMappings[city]) {
          return cityMappings[city];
        }

        // Final fallback: generate from city name
        const fallbackCode = city
          .replace(/[^a-z]/g, "")
          .substring(0, 3)
          .toUpperCase();
        return fallbackCode || "UNK";
      }
    };

    const generateCacheKey = (searchParams) => {
      // Create a unique cache key based on search parameters
      return `flightResults_${searchParams.origin}_${searchParams.destination}_${searchParams.departureDate}_${searchParams.returnDate}_${searchParams.adults}`;
    };

    const getCachedResults = (cacheKey) => {
      try {
        const cached = sessionStorage.getItem(cacheKey);
        if (!cached) return null;

        const { data, timestamp } = JSON.parse(cached);

        // Cache expires after 30 minutes (1800000 ms)
        const CACHE_DURATION = 30 * 60 * 1000;
        const isExpired = Date.now() - timestamp > CACHE_DURATION;

        if (isExpired) {
          sessionStorage.removeItem(cacheKey);
          return null;
        }

        return data;
      } catch (error) {
        console.error("Error reading cache:", error);
        return null;
      }
    };

    const setCachedResults = (cacheKey, data) => {
      try {
        const cacheEntry = {
          data,
          timestamp: Date.now(),
        };
        sessionStorage.setItem(cacheKey, JSON.stringify(cacheEntry));
      } catch (error) {
        console.error("Error setting cache:", error);
      }
    };

    const fetchFlightOffers = async () => {
      // Filter flights based on budget function
      const filterFlightsByBudget = (flights, userBudget) => {
        if (!userBudget || !flights?.length) return flights;

        // Extract budget amount from string (e.g., "$2000" -> 2000)
        const budgetMatch = userBudget.toString().match(/(\d+)/);
        if (!budgetMatch) return flights;

        const budgetAmount = parseInt(budgetMatch[1]);
        console.log("User budget amount:", budgetAmount);

        // Calculate per-person flight budget (typically 20-40% of total trip budget)
        const flightBudgetPercentage = 0.3; // 30% of total budget for flights
        const maxFlightBudget = budgetAmount * flightBudgetPercentage;
        const minFlightBudget = maxFlightBudget * 0.5; // At least 50% of flight budget

        console.log(
          `Flight budget range: $${minFlightBudget} - $${maxFlightBudget}`
        );

        const filteredFlights = flights.filter((flight) => {
          // Extract price from flight.price (e.g., "575.11 USD" -> 575.11)
          const priceMatch = flight.price.match(/(\d+\.?\d*)/);
          if (!priceMatch) return false;

          const flightPrice = parseFloat(priceMatch[1]);

          // Filter flights within budget range
          const withinBudget =
            flightPrice >= minFlightBudget && flightPrice <= maxFlightBudget;

          if (withinBudget) {
            console.log(
              `✅ Flight ${flight.airline} $${flightPrice} - within budget`
            );
          } else {
            console.log(
              `❌ Flight ${flight.airline} $${flightPrice} - outside budget range`
            );
          }

          return withinBudget;
        });

        // If no flights match the budget, show closest ones
        if (filteredFlights.length === 0) {
          console.log("No flights within budget, showing closest options");

          // Sort all flights by how close they are to the target budget
          const sortedByCloseness = flights
            .map((flight) => {
              const priceMatch = flight.price.match(/(\d+\.?\d*)/);
              if (!priceMatch) return { ...flight, distance: Infinity };

              const flightPrice = parseFloat(priceMatch[1]);
              const targetPrice = maxFlightBudget;
              const distance = Math.abs(flightPrice - targetPrice);

              return { ...flight, distance };
            })
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 5); // Show 5 closest options

          return sortedByCloseness;
        }

        return filteredFlights.slice(0, 10); // Limit to 10 flights max
      };

      try {
        setLoading(true);
        setError(null);

        // Get flight data from sessionStorage (stored by TripForm)
        const stored = sessionStorage.getItem("flightData");
        if (!stored) {
          setError(
            "No flight data found. Please fill out the trip form first."
          );
          setLoading(false);
          return;
        }

        const flightData = JSON.parse(stored);
        console.log("Retrieved flight data:", flightData);

        // Extract data with correct field names from sessionStorage
        const {
          origin,
          destination,
          startDate, // Note: it's startDate, not departureDate
          returnDate,
          numberOfAdults, // Note: it's numberOfAdults, not adults
          budget, // User's budget for the trip
        } = flightData;

        if (!origin || !destination || !startDate) {
          setError(
            "Missing required flight information. Please complete the trip form."
          );
          setLoading(false);
          return;
        }

        // Get IATA codes for origin and destination
        console.log("Fetching IATA codes...");
        const [originCode, destinationCode] = await Promise.all([
          fetchIATACode(origin),
          fetchIATACode(destination),
        ]);

        console.log("IATA codes:", { originCode, destinationCode });

        // Build search parameters for caching
        const searchParams = {
          origin: originCode,
          destination: destinationCode,
          departureDate: startDate,
          returnDate: returnDate,
          adults: numberOfAdults.toString(),
        };

        // Generate cache key
        const cacheKey = generateCacheKey(searchParams);

        // Check for cached results first
        const cachedResults = getCachedResults(cacheKey);
        if (cachedResults) {
          console.log("Using cached flight results:", cachedResults);

          // Apply budget filtering to cached results if budget has changed
          if (budget && cachedResults.budget !== budget) {
            console.log("Budget changed, re-filtering cached flights");
            const reFilteredFlights = filterFlightsByBudget(
              cachedResults.flights,
              budget
            );
            const updatedResults = {
              ...cachedResults,
              flights: reFilteredFlights,
              budget,
              flightsShown: reFilteredFlights?.length || 0,
            };
            setflightdata(updatedResults);
          } else {
            setflightdata(cachedResults);
          }
          setLoading(false);
          return;
        }

        console.log("No cached results found, calling API...");

        // Build API parameters
        const params = new URLSearchParams({
          ...searchParams,
          currencyCode: "USD",
          maxFlightOffers: "10",
        });

        console.log("Calling flight API with params:", params.toString());

        // Call flight API
        const res = await fetch(`/api/flight?${params.toString()}`);

        if (!res.ok) {
          throw new Error(`Flight API error: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        console.log("Flight API response:", data);

        if (data.error) {
          throw new Error(data.error);
        }

        const budgetFilteredFlights = filterFlightsByBudget(
          data.flights,
          budget
        );

        const flightResults = {
          flights: budgetFilteredFlights || [],
          origin,
          destination,
          originCode,
          destinationCode,
          budget,
          totalFlightsFound: data.flights?.length || 0,
          flightsShown: budgetFilteredFlights?.length || 0,
        };

        // Cache the results
        setCachedResults(cacheKey, flightResults);
        console.log("Flight results cached with key:", cacheKey);

        setflightdata(flightResults);
      } catch (err) {
        console.error("Flight fetch failed:", err);
        setError(err.message || "Failed to fetch flight data");
      } finally {
        setLoading(false);
      }
    };

    fetchFlightOffers();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          padding: "2rem",
          textAlign: "center",
          background: "#f8f9fa",
          borderRadius: "8px",
          margin: "1rem 0",
        }}
      >
        <div style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>
          ✈️ Searching for flights...
        </div>
        <div style={{ color: "#666" }}>This may take a few moments</div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          padding: "2rem",
          textAlign: "center",
          background: "#fee",
          borderRadius: "8px",
          border: "1px solid #fcc",
          margin: "1rem 0",
        }}
      >
        <div
          style={{ fontSize: "1.2rem", marginBottom: "1rem", color: "#d00" }}
        >
          ❌ Flight Search Error
        </div>
        <div style={{ color: "#666" }}>{error}</div>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "1.5rem",
        background: "white",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        margin: "1rem 0",
      }}
    >
      <div style={{ marginBottom: "1.5rem" }}>
        <h2
          style={{
            margin: "0 0 0.5rem 0",
            color: "#333",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          ✈️ Available Flights
        </h2>
        <p
          style={{
            margin: "0 0 1rem 0",
            color: "#666",
            fontSize: "1rem",
          }}
        >
          {flightdata?.origin} ({flightdata?.originCode}) →{" "}
          {flightdata?.destination} ({flightdata?.destinationCode})
        </p>

        {/* Budget Filter Summary */}
        {flightdata?.budget && (
          <div
            style={{
              background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
              padding: "1rem",
              borderRadius: "8px",
              border: "1px solid #dee2e6",
              marginBottom: "1rem",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "0.5rem",
              }}
            >
              <span style={{ fontSize: "1.1rem" }}>💰</span>
              <strong style={{ color: "#495057" }}>Budget Filter Active</strong>
            </div>
            <div
              style={{
                fontSize: "0.9rem",
                color: "#6c757d",
                marginBottom: "0.5rem",
              }}
            >
              Total Trip Budget: <strong>{flightdata.budget}</strong>
            </div>
            <div
              style={{
                display: "flex",
                gap: "1rem",
                fontSize: "0.8rem",
                color: "#6c757d",
              }}
            >
              <span>
                Showing:{" "}
                <strong style={{ color: "#28a745" }}>
                  {flightdata?.flightsShown || 0}
                </strong>{" "}
                flights
              </span>
              {flightdata?.totalFlightsFound && (
                <span>
                  Total Found: <strong>{flightdata.totalFlightsFound}</strong>
                </span>
              )}
            </div>
            {flightdata?.flightsShown === 0 &&
              flightdata?.totalFlightsFound > 0 && (
                <div
                  style={{
                    marginTop: "0.5rem",
                    padding: "0.5rem",
                    background: "#fff3cd",
                    borderRadius: "4px",
                    fontSize: "0.8rem",
                    color: "#856404",
                  }}
                >
                  ⚠️ No flights found within budget range. Showing closest
                  alternatives.
                </div>
              )}
          </div>
        )}
      </div>

      {flightdata?.flights?.length > 0 ? (
        <div style={{ display: "grid", gap: "1rem" }}>
          {flightdata.flights.map((flight, index) => (
            <div
              key={index}
              style={{
                padding: "1.5rem",
                border: "1px solid #e9ecef",
                borderRadius: "8px",
                background: "#f8f9fa",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
                e.target.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.boxShadow = "none";
                e.target.style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "1rem",
                }}
              >
                <div>
                  <h3
                    style={{
                      margin: "0 0 0.5rem 0",
                      color: "#333",
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                    }}
                  >
                    {flight.airline}
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      gap: "1rem",
                      fontSize: "0.9rem",
                      color: "#666",
                    }}
                  >
                    <span>💺 {flight.travelClass}</span>
                    <span>🕒 {flight.duration}</span>
                  </div>
                </div>
                <div
                  style={{
                    textAlign: "right",
                    padding: "0.5rem 1rem",
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    borderRadius: "6px",
                    color: "white",
                  }}
                >
                  <div
                    style={{
                      fontSize: "1.4rem",
                      fontWeight: "bold",
                      lineHeight: 1,
                    }}
                  >
                    {flight.price}
                  </div>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      opacity: 0.9,
                    }}
                  >
                    per person
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          style={{
            padding: "2rem",
            textAlign: "center",
            background: "#f8f9fa",
            borderRadius: "8px",
            border: "1px dashed #ddd",
          }}
        >
          <div style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>
            🔍 No flights found
          </div>
          <div style={{ color: "#666" }}>
            Try adjusting your search criteria or check your travel dates.
          </div>
        </div>
      )}
    </div>
  );
}
