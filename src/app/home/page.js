"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import TripForm from "../components/TripForm";
import TripNavbar from "../components/TripNavbar";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Map interest IDs to full names for API compatibility
  const interestMapping = {
    beach: "Beach holidays",
    city: "City exploration",
    historical: "Historical sites",
    "theme-parks": "Theme parks",
    shopping: "Shopping & Fashion",
    adventure: "Adventure Activities",
    nightlife: "Night Life",
    theater: "Theatre & performing arts",
  };

  const handleFormSubmit = async (formData) => {
    setIsLoading(true);

    try {
      // Convert interest IDs to full names
      const mappedInterests = formData.interests.map(
        (id) => interestMapping[id]
      );

      const payload = {
        location: formData.location,
        days: formData.days,
        interests: mappedInterests,
        travelgroup: formData.travelgroup,
        budget: formData.budget,
      };

      console.log("Sending payload:", payload);

      const response = await fetch("/api/trip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Trip generated successfully!");
        console.log("Response data:", data);

        sessionStorage.setItem("tripData", JSON.stringify(data));
        sessionStorage.setItem("tripParams", JSON.stringify(formData));

        router.push("/results");
      } else {
        console.error("API Error:", data);
        alert(`Error: ${data.message || "Failed to generate trip"}`);
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--background)" }}>
      {isLoading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            color: "white",
            fontSize: "1.2rem",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div style={{ marginBottom: "1rem" }}>
              ✨ Creating your perfect itinerary...
            </div>
            <div className="animate-pulse">
              Please wait, this may take a moment
            </div>
          </div>
        </div>
      )}

      <TripForm onSubmit={handleFormSubmit} />
    </div>
  );
}
