"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  FaHeart,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaRoute,
  FaHotel,
  FaTrash,
  FaEye,
  FaInfoCircle,
  FaArrowLeft,
  FaClock,
} from "react-icons/fa";
import TripNavbar from "../components/TripNavbar";
import styles from "./saved-trips.module.css";

export default function SavedTripsPage() {
  const [savedTrips, setSavedTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadSavedTrips();
  }, []);

  const loadSavedTrips = () => {
    try {
      const trips = JSON.parse(localStorage.getItem("savedTrips") || "[]");
      setSavedTrips(trips);
    } catch (error) {
      console.error("Error loading saved trips:", error);
      setSavedTrips([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTrip = (tripId) => {
    try {
      const updatedTrips = savedTrips.filter((trip) => trip.id !== tripId);
      localStorage.setItem("savedTrips", JSON.stringify(updatedTrips));
      setSavedTrips(updatedTrips);

      toast.success("Trip deleted successfully!");
    } catch (error) {
      console.error("Error deleting trip:", error);
      toast.error("Failed to delete trip. Please try again.");
    }
  };

  const handleViewTrip = (trip) => {
    try {
      // Store the trip data in sessionStorage for the results page
      sessionStorage.setItem("tripData", JSON.stringify(trip.tripData));
      sessionStorage.setItem("tripParams", JSON.stringify(trip.tripParams));

      // Navigate to results page
      router.push("/results");
    } catch (error) {
      console.error("Error viewing trip:", error);
      toast.error("Failed to open trip. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTotalActivities = (itinerary) => {
    if (!itinerary) return 0;
    let total = 0;
    Object.values(itinerary).forEach((day) => {
      total +=
        (day.morning?.length || 0) +
        (day.afternoon?.length || 0) +
        (day.evening?.length || 0) +
        (day.night?.length || 0);
    });
    return total;
  };

  if (loading) {
    return (
      <>
        <TripNavbar />
        <div className={styles.loadingContainer}>
          <div className={styles.loader}>Loading your saved trips...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <TripNavbar />
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <button
              onClick={() => router.push("/home")}
              className={styles.backBtn}
            >
              <FaArrowLeft />
            </button>

            <div className={styles.headerInfo}>
              <h1 className={styles.title}>
                <FaHeart className={styles.titleIcon} />
                Saved Trips
              </h1>
              <p className={styles.subtitle}>
                Your collection of memorable journeys
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {savedTrips.length === 0 ? (
            <div className={styles.emptyState}>
              <FaInfoCircle className={styles.emptyIcon} />
              <h3>No saved trips yet</h3>
              <p>
                Start planning your next adventure and save your favorite
                itineraries here!
              </p>
              <button
                onClick={() => router.push("/home")}
                className={styles.planTripBtn}
              >
                Plan Your First Trip
              </button>
            </div>
          ) : (
            <div className={styles.tripsGrid}>
              {savedTrips.map((trip) => (
                <div key={trip.id} className={styles.tripCard}>
                  {/* Trip Header */}
                  <div className={styles.tripHeader}>
                    <div className={styles.locationInfo}>
                      <h3 className={styles.tripLocation}>
                        <FaMapMarkerAlt className={styles.locationIcon} />
                        {trip.location}
                      </h3>
                      <span className={styles.savedDate}>
                        <FaClock />
                        Saved {formatDate(trip.savedAt)}
                      </span>
                    </div>
                  </div>

                  {/* Trip Stats */}
                  <div className={styles.tripStats}>
                    <div className={styles.stat}>
                      <FaCalendarAlt className={styles.statIcon} />
                      <span className={styles.statValue}>{trip.days}</span>
                      <span className={styles.statLabel}>Days</span>
                    </div>

                    <div className={styles.stat}>
                      <FaRoute className={styles.statIcon} />
                      <span className={styles.statValue}>
                        {getTotalActivities(trip.tripData?.itinerary)}
                      </span>
                      <span className={styles.statLabel}>Activities</span>
                    </div>

                    {trip.tripData?.hotel && (
                      <div className={styles.stat}>
                        <FaHotel className={styles.statIcon} />
                        <span className={styles.statValue}>
                          {trip.tripData.hotel.length}
                        </span>
                        <span className={styles.statLabel}>Hotels</span>
                      </div>
                    )}

                    <div className={styles.stat}>
                      <FaMoneyBillWave className={styles.statIcon} />
                      <span className={styles.statValue}>{trip.budget}</span>
                      <span className={styles.statLabel}>Budget</span>
                    </div>
                  </div>

                  {/* Trip Actions */}
                  <div className={styles.tripActions}>
                    <button
                      onClick={() => handleViewTrip(trip)}
                      className={styles.viewBtn}
                    >
                      <FaEye />
                      View Trip
                    </button>
                    <button
                      onClick={() => handleDeleteTrip(trip.id)}
                      className={styles.deleteBtn}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
