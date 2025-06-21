"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FaMapMarkerAlt,
  FaHotel,
  FaClock,
  FaStar,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaRoute,
  FaSun,
  FaCloudSun,
  FaCloudMoon,
  FaMoon,
  FaInfoCircle,
  FaArrowLeft,
  FaShare,
  FaDownload,
  FaHeart,
} from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import ItineraryDisplay from "../components/ItineraryDisplay";
import HotelCard from "../components/HotelCard";
import LoadingSpinner from "../components/LoadingSpinner";
import styles from "./results.module.css";
import TripNavbar from "../components/TripNavbar";

export default function Results() {
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("itinerary");
  const router = useRouter();

  useEffect(() => {
    const loadTripData = () => {
      try {
        const storedData = sessionStorage.getItem("tripData");
        if (!storedData) {
          setError("No trip data found. Please plan a new trip.");
          setLoading(false);
          return;
        }

        const data = JSON.parse(storedData);
        console.log("Loaded trip data:", data);

        if (!data.itinerary && !data.hotel) {
          setError("Invalid trip data format.");
          setLoading(false);
          return;
        }

        setTripData(data);
        setLoading(false);
      } catch (err) {
        console.error("Error loading trip data:", err);
        setError("Failed to load trip data.");
        setLoading(false);
      }
    };

    // Small delay for better UX
    setTimeout(loadTripData, 500);
  }, []);

  const handleBackToPlanning = () => {
    router.push("/home");
  };

  const handleShareTrip = () => {
    if (navigator.share) {
      navigator.share({
        title: "My AI Generated Trip",
        text: "Check out my amazing trip itinerary!",
        url: window.location.href,
      });
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Trip link copied to clipboard!");
    }
  };

  const getDaysCount = () => {
    if (!tripData?.itinerary) return 0;
    return Object.keys(tripData.itinerary).length;
  };

  const getTotalActivities = () => {
    if (!tripData?.itinerary) return 0;
    let total = 0;
    Object.values(tripData.itinerary).forEach((day) => {
      total +=
        (day.morning?.length || 0) +
        (day.afternoon?.length || 0) +
        (day.evening?.length || 0) +
        (day.night?.length || 0);
    });
    return total;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorCard}>
          <FaInfoCircle className={styles.errorIcon} />
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <button onClick={handleBackToPlanning} className={styles.backButton}>
            <FaArrowLeft /> Plan New Trip
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <TripNavbar />
      <div className={styles.container}>
        {/* Header Section */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <button onClick={handleBackToPlanning} className={styles.backBtn}>
              <FaArrowLeft />
            </button>

            <div className={styles.headerInfo}>
              <h1 className={styles.title}>
                <FaRoute className={styles.titleIcon} />
                Your Perfect Trip Awaits
              </h1>
              <p className={styles.subtitle}>
                AI-crafted itinerary tailored just for you
              </p>
            </div>

            <div className={styles.headerActions}>
              <button onClick={handleShareTrip} className={styles.actionBtn}>
                <FaShare />
              </button>
              <button className={styles.actionBtn}>
                <FaHeart />
              </button>
            </div>
          </div>

          {/* Trip Stats */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <FaCalendarAlt className={styles.statIcon} />
              <div className={styles.statInfo}>
                <span className={styles.statNumber}>{getDaysCount()}</span>
                <span className={styles.statLabel}>Days</span>
              </div>
            </div>

            <div className={styles.statCard}>
              <FaRoute className={styles.statIcon} />
              <div className={styles.statInfo}>
                <span className={styles.statNumber}>
                  {getTotalActivities()}
                </span>
                <span className={styles.statLabel}>Activities</span>
              </div>
            </div>

            {tripData?.hotel && (
              <div className={styles.statCard}>
                <FaHotel className={styles.statIcon} />
                <div className={styles.statInfo}>
                  <span className={styles.statNumber}>
                    {tripData.hotel.length}
                  </span>
                  <span className={styles.statLabel}>Hotels</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className={styles.tabNavigation}>
          <button
            className={`${styles.tab} ${
              activeTab === "itinerary" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("itinerary")}
          >
            <FaCalendarAlt />
            Itinerary
          </button>

          {tripData?.hotel && (
            <button
              className={`${styles.tab} ${
                activeTab === "hotels" ? styles.activeTab : ""
              }`}
              onClick={() => setActiveTab("hotels")}
            >
              <FaHotel />
              Hotels
            </button>
          )}
        </div>

        {/* Content Area */}
        <div className={styles.content}>
          {activeTab === "itinerary" && tripData?.itinerary && (
            <ItineraryDisplay itinerary={tripData.itinerary} />
          )}

          {activeTab === "hotels" && tripData?.hotel && (
            <div className={styles.hotelsSection}>
              <div className={styles.sectionHeader}>
                <h2>
                  <FaHotel className={styles.sectionIcon} />
                  Recommended Hotels
                </h2>
                <p>Handpicked accommodations for your perfect stay</p>
              </div>

              <div className={styles.hotelsGrid}>
                {tripData.hotel.map((hotel, index) => (
                  <HotelCard key={index} hotel={hotel} index={index} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
