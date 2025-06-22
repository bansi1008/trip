"use client";
import toast from "react-hot-toast";
import { useState } from "react";
import {
  FaSun,
  FaCloudSun,
  FaCloudMoon,
  FaMoon,
  FaMoneyBillWave,
  FaInfoCircle,
  FaClock,
  FaMapMarkerAlt,
  FaChevronDown,
  FaChevronUp,
  FaMapPin,
  FaTimes,
  FaSpinner,
} from "react-icons/fa";
import styles from "./ItineraryDisplay.module.css";

export default function ItineraryDisplay({ itinerary }) {
  const [expandedDays, setExpandedDays] = useState({});
  const [mapData, setMapData] = useState({});
  const [loadingMaps, setLoadingMaps] = useState({});
  const [showMaps, setShowMaps] = useState({});

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!itinerary || Object.keys(itinerary).length === 0) {
    return (
      <div className={styles.emptyState}>
        <FaInfoCircle className={styles.emptyIcon} />
        <h3>No itinerary available</h3>
        <p>Your trip itinerary will appear here once generated.</p>
      </div>
    );
  }

  const toggleDay = (dayKey) => {
    setExpandedDays((prev) => ({
      ...prev,
      [dayKey]: !prev[dayKey],
    }));
  };

  const getTimeIcon = (timeOfDay) => {
    switch (timeOfDay.toLowerCase()) {
      case "morning":
        return (
          <FaSun className={styles.timeIcon} style={{ color: "#f59e0b" }} />
        );
      case "afternoon":
        return (
          <FaCloudSun
            className={styles.timeIcon}
            style={{ color: "#f97316" }}
          />
        );
      case "evening":
        return (
          <FaCloudMoon
            className={styles.timeIcon}
            style={{ color: "#8b5cf6" }}
          />
        );
      case "night":
        return (
          <FaMoon className={styles.timeIcon} style={{ color: "#6366f1" }} />
        );
      default:
        return <FaClock className={styles.timeIcon} />;
    }
  };

  const formatDayNumber = (dayKey) => {
    const dayNumber = dayKey.replace("day", "");
    return `Day ${dayNumber}`;
  };

  const getActivitiesCount = (day) => {
    let count = 0;
    ["morning", "afternoon", "evening", "night"].forEach((timeOfDay) => {
      if (day[timeOfDay] && Array.isArray(day[timeOfDay])) {
        count += day[timeOfDay].length;
      }
    });
    return count;
  };

  const calculateDayBudget = (day) => {
    let total = 0;
    ["morning", "afternoon", "evening", "night"].forEach((timeOfDay) => {
      if (day[timeOfDay] && Array.isArray(day[timeOfDay])) {
        day[timeOfDay].forEach((activity) => {
          if (activity.price) {
            // Extract number from price string (e.g., "$20" -> 20)
            const priceMatch = activity.price.match(/[\d.]+/);
            if (priceMatch) {
              total += parseFloat(priceMatch[0]);
            }
          }
        });
      }
    });
    return total;
  };

  const geocodeActivity = async (activityName, activityId) => {
    if (!apiKey) {
      alert(
        "Google Maps API key is not configured. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your environment variables."
      );
      return;
    }

    setLoadingMaps((prev) => ({ ...prev, [activityId]: true }));

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          activityName
        )}&key=${apiKey}`
      );
      const data = await response.json();

      if (data.status === "OK") {
        const { lat, lng } = data.results[0].geometry.location;
        setMapData((prev) => ({
          ...prev,
          [activityId]: { lat, lng, activityName },
        }));
        setShowMaps((prev) => ({ ...prev, [activityId]: true }));
      } else {
        toast.error(
          `Location not found for "${activityName}". Please try with a more specific location name.`
        );
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      toast.error("Error loading map. Please check your internet connection.");
    }

    setLoadingMaps((prev) => ({ ...prev, [activityId]: false }));
  };

  const closeMap = (activityId) => {
    setShowMaps((prev) => ({ ...prev, [activityId]: false }));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          <FaMapMarkerAlt className={styles.titleIcon} />
          Your Itinerary
        </h2>
        <p className={styles.subtitle}>
          Perfectly planned activities for your amazing journey
        </p>
      </div>

      <div className={styles.daysContainer}>
        {Object.entries(itinerary).map(([dayKey, dayData], index) => {
          const isExpanded = expandedDays[dayKey] !== false; // Default to expanded
          const activitiesCount = getActivitiesCount(dayData);
          const dayBudget = calculateDayBudget(dayData);

          return (
            <div key={dayKey} className={styles.dayCard}>
              <div
                className={styles.dayHeader}
                onClick={() => toggleDay(dayKey)}
              >
                <div className={styles.dayInfo}>
                  <h3 className={styles.dayTitle}>{formatDayNumber(dayKey)}</h3>
                  <div className={styles.dayStats}>
                    <span className={styles.activityCount}>
                      {activitiesCount} Activities
                    </span>
                    {dayBudget > 0 && (
                      <span className={styles.dayBudget}>
                        <FaMoneyBillWave className={styles.budgetIcon} />$
                        {dayBudget.toFixed(0)}
                      </span>
                    )}
                  </div>
                </div>

                <button className={styles.toggleButton}>
                  {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                </button>
              </div>

              {isExpanded && (
                <div className={styles.dayContent}>
                  {["morning", "afternoon", "evening", "night"].map(
                    (timeOfDay) => {
                      const activities = dayData[timeOfDay];

                      if (
                        !activities ||
                        !Array.isArray(activities) ||
                        activities.length === 0
                      ) {
                        return null;
                      }

                      return (
                        <div key={timeOfDay} className={styles.timeSection}>
                          <div className={styles.timeHeader}>
                            {getTimeIcon(timeOfDay)}
                            <h4 className={styles.timeTitle}>
                              {timeOfDay.charAt(0).toUpperCase() +
                                timeOfDay.slice(1)}
                            </h4>
                          </div>

                          <div className={styles.activitiesGrid}>
                            {activities.map((activity, activityIndex) => {
                              const activityId = `${dayKey}-${timeOfDay}-${activityIndex}`;

                              return (
                                <div
                                  key={activityIndex}
                                  className={styles.activityCard}
                                >
                                  <div className={styles.activityHeader}>
                                    <h5 className={styles.activityName}>
                                      {activity.activityName || "Activity"}
                                    </h5>
                                    {activity.price && (
                                      <span className={styles.activityPrice}>
                                        {activity.price}
                                      </span>
                                    )}
                                  </div>

                                  {activity.activitydescription && (
                                    <p className={styles.activityDescription}>
                                      {activity.activitydescription}
                                    </p>
                                  )}

                                  {activity.notes && (
                                    <div className={styles.activityNotes}>
                                      <FaInfoCircle
                                        className={styles.notesIcon}
                                      />
                                      <span className={styles.notesText}>
                                        {activity.notes}
                                      </span>
                                    </div>
                                  )}

                                  {/* Map Button */}
                                  <div className={styles.activityActions}>
                                    <button
                                      className={styles.mapButton}
                                      onClick={() =>
                                        geocodeActivity(
                                          activity.activityName,
                                          activityId
                                        )
                                      }
                                      disabled={loadingMaps[activityId]}
                                    >
                                      {loadingMaps[activityId] ? (
                                        <>
                                          <FaSpinner
                                            className={styles.spinningIcon}
                                          />
                                          Loading...
                                        </>
                                      ) : (
                                        <>
                                          <FaMapPin />
                                          See Location
                                        </>
                                      )}
                                    </button>
                                  </div>

                                  {/* Map Display */}
                                  {showMaps[activityId] &&
                                    mapData[activityId] && (
                                      <div className={styles.mapContainer}>
                                        <div className={styles.mapHeader}>
                                          <h6 className={styles.mapTitle}>
                                            {mapData[activityId].activityName}
                                          </h6>
                                          <button
                                            className={styles.closeMapButton}
                                            onClick={() => closeMap(activityId)}
                                          >
                                            <FaTimes />
                                          </button>
                                        </div>
                                        <iframe
                                          className={styles.mapIframe}
                                          loading="lazy"
                                          allowFullScreen
                                          src={`https://www.google.com/maps/embed/v1/view?key=${apiKey}&center=${mapData[activityId].lat},${mapData[activityId].lng}&zoom=17`}
                                        ></iframe>
                                      </div>
                                    )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
