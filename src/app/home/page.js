"use client";
import axios from "axios";
import { useState, useEffect } from "react";

export default function Home() {
  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Search City</h1>
      <CitySearch />
    </div>
  );
}

const CitySearch = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [photoUrl, setPhotoUrl] = useState("");
  const apiKey = process.env.NEXT_PUBLIC_MAP;

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const res = await fetch(
          `/api/places?input=${encodeURIComponent(query)}`
        );
        const data = await res.json();

        const cities = data.predictions.map((item) => ({
          description: item.description,
          place_id: item.place_id,
        }));

        setSuggestions(cities);
      } catch (error) {
        console.error("Error fetching city suggestions:", error);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 400);
    return () => clearTimeout(debounce);
  }, [query]);

  const fetchCityPhoto = async (place_id) => {
    try {
      const res = await fetch(
        `/api/photo?place_id=${encodeURIComponent(place_id)}`
      );
      const data = await res.json();

      if (res.ok && data.photoUrl) {
        setPhotoUrl(data.photoUrl);
      } else {
        setPhotoUrl("");
        alert(data.error || "No photo available.");
      }
    } catch (err) {
      console.error("Error fetching photo:", err);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter city name"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border p-2 w-full rounded"
      />

      {suggestions.length > 0 && (
        <ul className="bg-white border rounded mt-1 shadow max-h-60 overflow-auto">
          {suggestions.map((place) => (
            <li
              key={place.place_id}
              className="flex justify-between items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              <div
                onClick={() => {
                  setQuery(place.description);
                  setSuggestions([]);
                }}
              >
                {place.description}
              </div>
              <button
                onClick={() => fetchCityPhoto(place.place_id)}
                className="text-sm text-blue-500 hover:underline ml-2"
              >
                Get Image
              </button>
            </li>
          ))}
        </ul>
      )}

      {photoUrl && (
        <div className="mt-4">
          <img
            src={photoUrl}
            alt="City"
            className="rounded shadow max-w-full"
          />
        </div>
      )}
    </div>
  );
};
