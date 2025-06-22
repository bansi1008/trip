"use client";

import { useState } from "react";
import {
  FaHotel,
  FaStar,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaRoute,
  FaWifi,
  FaSwimmingPool,
  FaCar,
  FaHeart,
  FaShareAlt,
  FaSpinner,
  FaMapPin,
  FaTimes,
} from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import styles from "./HotelCard.module.css";

export default function HotelCard({ hotel, index }) {
  const [mapData, setMapData] = useState({});
  const [loadingMaps, setLoadingMaps] = useState({});
  const [showMaps, setShowMaps] = useState({});

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!hotel) return null;

  const {
    hotelName = "Hotel Name",
    distanceFromCenterInKm = 0,
    pricePerNight = "$0",
    rating = 0,
    address = "Address not available",
  } = hotel;

  const hotelId = `hotel-${index}`;

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
        alert(
          `Location not found for "${activityName}". Please try with a more specific location name.`
        );
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      alert("Error loading map. Please check your internet connection.");
    }

    setLoadingMaps((prev) => ({ ...prev, [activityId]: false }));
  };

  const closeMap = (activityId) => {
    setShowMaps((prev) => ({ ...prev, [activityId]: false }));
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className={styles.starFilled} />);
    }

    if (hasHalfStar) {
      stars.push(<FaStar key="half" className={styles.starHalf} />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className={styles.starEmpty} />);
    }

    return stars;
  };

  const formatPrice = (price) => {
    // Extract numeric value and currency symbol
    const match = price.toString().match(/([₹$€£]?)(\d+)/);
    if (match) {
      const currency = match[1] || "₹";
      const amount = parseInt(match[2]).toLocaleString();
      return `${currency}${amount}`;
    }
    return price;
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return "#059669"; // green
    if (rating >= 4.0) return "#0ea5e9"; // blue
    if (rating >= 3.5) return "#f59e0b"; // amber
    return "#ef4444"; // red
  };

  const getRatingText = (rating) => {
    if (rating >= 4.5) return "Excellent";
    if (rating >= 4.0) return "Very Good";
    if (rating >= 3.5) return "Good";
    if (rating >= 3.0) return "Average";
    return "Fair";
  };

  return (
    <div className={styles.hotelCard}>
      {/* Hotel Image Placeholder */}
      <div className={styles.imageContainer}>
        <div className={styles.imagePlaceholder}>
          <FaHotel className={styles.hotelIcon} />
        </div>

        <div className={styles.imageOverlay}>
          <button className={styles.actionBtn}>
            <FaHeart />
          </button>
          <button className={styles.actionBtn}>
            <FaShareAlt />
          </button>
        </div>

        <div className={styles.ratingBadge}>
          <span className={styles.ratingNumber}>{rating.toFixed(1)}</span>
          <span className={styles.ratingText}>{getRatingText(rating)}</span>
        </div>
      </div>

      {/* Hotel Content */}
      <div className={styles.hotelContent}>
        <div className={styles.hotelHeader}>
          <h3 className={styles.hotelName}>{hotelName}</h3>
          <div className={styles.priceContainer}>
            <span className={styles.priceLabel}>per night</span>
            <span className={styles.price}>{formatPrice(pricePerNight)}</span>
          </div>
        </div>

        <div className={styles.ratingContainer}>
          <div className={styles.starsContainer}>{renderStars(rating)}</div>
          <span
            className={styles.ratingScore}
            style={{ color: getRatingColor(rating) }}
          >
            {rating.toFixed(1)}/5.0
          </span>
        </div>

        <div className={styles.locationContainer}>
          <MdLocationOn className={styles.locationIcon} />
          <span className={styles.address}>{address}</span>
        </div>

        <div className={styles.distanceContainer}>
          <FaRoute className={styles.distanceIcon} />
          <span className={styles.distance}>
            {distanceFromCenterInKm} km from city center
          </span>
        </div>

        {/* Amenities */}
        <div className={styles.amenities}>
          <div className={styles.amenity}>
            <FaWifi className={styles.amenityIcon} />
            <span>Free WiFi</span>
          </div>
          <div className={styles.amenity}>
            <FaCar className={styles.amenityIcon} />
            <span>Parking</span>
          </div>
          <div className={styles.amenity}>
            <FaSwimmingPool className={styles.amenityIcon} />
            <span>Pool</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles.actionButtons}>
          <button
            className={styles.viewDetailsBtn}
            onClick={() => geocodeActivity(hotelName, hotelId)}
            disabled={loadingMaps[hotelId]}
          >
            {loadingMaps[hotelId] ? (
              <>
                <FaSpinner className={styles.spinningIcon} />
                Loading...
              </>
            ) : (
              <>
                <FaMapPin />
                View Location
              </>
            )}
          </button>
          <button className={styles.bookNowBtn}>Book Now</button>
        </div>

        {/* Map Display */}
        {showMaps[hotelId] && mapData[hotelId] && (
          <div className={styles.mapContainer}>
            <div className={styles.mapHeader}>
              <h6 className={styles.mapTitle}>
                {mapData[hotelId].activityName}
              </h6>
              <button
                className={styles.closeMapButton}
                onClick={() => closeMap(hotelId)}
              >
                <FaTimes />
              </button>
            </div>
            <iframe
              className={styles.mapIframe}
              loading="lazy"
              allowFullScreen
              src={`https://www.google.com/maps/embed/v1/view?key=${apiKey}&center=${mapData[hotelId].lat},${mapData[hotelId].lng}&zoom=15`}
            ></iframe>
          </div>
        )}
      </div>
    </div>
  );
}
