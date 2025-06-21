"use client";
import { useState } from "react";
import styles from "./TripForm.module.css";
import TripNavbar from "./TripNavbar";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaHeart,
  FaUsers,
  FaDollarSign,
  FaPlus,
  FaMinus,
  FaStar,
  FaUmbrellaBeach,
  FaCity,
  FaLandmark,
  FaGamepad,
  FaShoppingBag,
  FaMountain,
  FaGlassCheers,
  FaTheaterMasks,
  FaUtensils,
  FaCameraRetro,
  FaMusic,
  FaSpa,
  FaTree,
  FaWater,
  FaSkiing,
  FaUser,
  FaUserFriends,
  FaHome,
  FaBaby,
  FaGraduationCap,
  FaBusinessTime,
} from "react-icons/fa";

const TripForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    location: "",
    days: 3,
    interests: [],
    travelgroup: "1",
    budget: "",
  });

  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const interestOptions = [
    {
      id: "beach",
      label: "Beach & Coastal",
      icon: FaUmbrellaBeach,
      color: "#00d4ff",
    },
    { id: "city", label: "City Exploration", icon: FaCity, color: "#ff006e" },
    {
      id: "historical",
      label: "Historical Sites",
      icon: FaLandmark,
      color: "#8338ec",
    },
    {
      id: "theme-parks",
      label: "Theme Parks",
      icon: FaGamepad,
      color: "#ff4757",
    },
    {
      id: "shopping",
      label: "Shopping & Fashion",
      icon: FaShoppingBag,
      color: "#00d4ff",
    },
    {
      id: "adventure",
      label: "Adventure Sports",
      icon: FaMountain,
      color: "#ff006e",
    },
    {
      id: "nightlife",
      label: "Night Life & Bars",
      icon: FaGlassCheers,
      color: "#8338ec",
    },
    {
      id: "theater",
      label: "Theater & Arts",
      icon: FaTheaterMasks,
      color: "#ff4757",
    },
    { id: "food", label: "Food & Cuisine", icon: FaUtensils, color: "#00d4ff" },
    {
      id: "photography",
      label: "Photography Spots",
      icon: FaCameraRetro,
      color: "#ff006e",
    },
    { id: "music", label: "Music & Concerts", icon: FaMusic, color: "#8338ec" },
    { id: "wellness", label: "Wellness & Spa", icon: FaSpa, color: "#ff4757" },
    {
      id: "nature",
      label: "Nature & Wildlife",
      icon: FaTree,
      color: "#00d4ff",
    },
    {
      id: "water-sports",
      label: "Water Sports",
      icon: FaWater,
      color: "#ff006e",
    },
    {
      id: "winter-sports",
      label: "Winter Sports",
      icon: FaSkiing,
      color: "#8338ec",
    },
  ];

  const travelGroupOptions = [
    {
      value: "1",
      label: "Solo Traveler",
      icon: FaUser,
      description: "Just me, myself & I",
    },
    {
      value: "2",
      label: "Couple",
      icon: FaUserFriends,
      description: "Romantic getaway",
    },
    {
      value: "3",
      label: "Small Group",
      icon: FaUsers,
      description: "3-5 people",
    },
    {
      value: "4",
      label: "Family",
      icon: FaHome,
      description: "Family vacation",
    },
    {
      value: "5",
      label: "Friends",
      icon: FaUserFriends,
      description: "Group of friends",
    },
    {
      value: "6",
      label: "Family with Kids",
      icon: FaBaby,
      description: "Kid-friendly trip",
    },
    {
      value: "7",
      label: "Students",
      icon: FaGraduationCap,
      description: "Educational tour",
    },
    {
      value: "8",
      label: "Business Group",
      icon: FaBusinessTime,
      description: "Corporate travel",
    },
  ];

  const handleLocationChange = async (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, location: value }));

    if (value.length >= 2) {
      try {
        const res = await fetch(
          `/api/places?input=${encodeURIComponent(value)}`
        );
        const data = await res.json();

        if (data.predictions) {
          setLocationSuggestions(
            data.predictions.map((item) => ({
              description: item.description,
              place_id: item.place_id,
            }))
          );
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    } else {
      setLocationSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleLocationSelect = (location) => {
    setFormData((prev) => ({ ...prev, location: location.description }));
    setLocationSuggestions([]);
    setShowSuggestions(false);
  };

  const handleDaysChange = (increment) => {
    setFormData((prev) => ({
      ...prev,
      days: increment
        ? Math.min(prev.days + 1, 30)
        : Math.max(prev.days - 1, 1),
    }));
  };

  const handleInterestToggle = (interestId) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter((id) => id !== interestId)
        : [...prev.interests, interestId],
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.location ||
      formData.interests.length === 0 ||
      !formData.budget
    ) {
      alert(
        "Please fill in all required fields and select at least one interest"
      );
      return;
    }

    onSubmit(formData);
  };

  return (
    <>
      <TripNavbar />

      <div className={styles.container}>
        <div className={styles.formWrapper}>
          <div className={styles.header}>
            <h2 className={styles.title}>
              <FaStar className={styles.titleIcon} />
              Plan Your Perfect Adventure
              <FaStar className={styles.titleIcon} />
            </h2>
            <p className={styles.subtitle}>
              Tell us about your dream destination and let AI create the perfect
              itinerary just for you
            </p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Location Field */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                <span className={styles.labelText}>
                  <FaMapMarkerAlt className={styles.labelIcon} />
                  Destination
                </span>
                <span className={styles.required}>*</span>
              </label>
              <div className={styles.locationWrapper}>
                <input
                  type="text"
                  value={formData.location}
                  onChange={handleLocationChange}
                  placeholder="Where do you want to go?"
                  className={styles.input}
                  autoComplete="off"
                />
                {showSuggestions && locationSuggestions.length > 0 && (
                  <div className={styles.suggestions}>
                    {locationSuggestions.map((suggestion) => (
                      <div
                        key={suggestion.place_id}
                        className={styles.suggestionItem}
                        onClick={() => handleLocationSelect(suggestion)}
                      >
                        <FaMapMarkerAlt className={styles.suggestionIcon} />
                        {suggestion.description}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Duration Field with Counter */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                <span className={styles.labelText}>
                  <FaCalendarAlt className={styles.labelIcon} />
                  Duration
                </span>
              </label>
              <div className={styles.daysCounter}>
                <button
                  type="button"
                  className={styles.counterButton}
                  onClick={() => handleDaysChange(false)}
                  disabled={formData.days <= 1}
                >
                  <FaMinus />
                </button>
                <div className={styles.counterValue}>
                  <span className={styles.daysNumber}>{formData.days}</span>
                  <span className={styles.daysLabel}>
                    {formData.days === 1 ? "Day" : "Days"}
                  </span>
                </div>
                <button
                  type="button"
                  className={styles.counterButton}
                  onClick={() => handleDaysChange(true)}
                  disabled={formData.days >= 30}
                >
                  <FaPlus />
                </button>
              </div>
            </div>

            {/* Interests Field */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                <span className={styles.labelText}>
                  <FaHeart className={styles.labelIcon} />
                  What interests you?
                </span>
                <span className={styles.required}>*</span>
              </label>
              <p className={styles.fieldHint}>
                Select all that spark your interest
              </p>
              <div className={styles.interestGrid}>
                {interestOptions.map((interest) => {
                  const IconComponent = interest.icon;
                  return (
                    <div
                      key={interest.id}
                      className={`${styles.interestCard} ${
                        formData.interests.includes(interest.id)
                          ? styles.selected
                          : ""
                      }`}
                      onClick={() => handleInterestToggle(interest.id)}
                      style={{
                        "--card-color": interest.color,
                      }}
                    >
                      <IconComponent className={styles.interestIcon} />
                      <span className={styles.interestLabel}>
                        {interest.label}
                      </span>
                      <div className={styles.checkbox}>
                        {formData.interests.includes(interest.id) && (
                          <span className={styles.checkmark}>✓</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Travel Group Field */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                <span className={styles.labelText}>
                  <FaUsers className={styles.labelIcon} />
                  Who's traveling?
                </span>
              </label>
              <div className={styles.travelGroupGrid}>
                {travelGroupOptions.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <div
                      key={option.value}
                      className={`${styles.travelGroupCard} ${
                        formData.travelgroup === option.value
                          ? styles.selected
                          : ""
                      }`}
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          travelgroup: option.value,
                        }))
                      }
                    >
                      <IconComponent className={styles.travelGroupIcon} />
                      <span className={styles.travelGroupLabel}>
                        {option.label}
                      </span>
                      <span className={styles.travelGroupDescription}>
                        {option.description}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Budget Field */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                <span className={styles.labelText}>
                  <FaDollarSign className={styles.labelIcon} />
                  Budget
                </span>
                <span className={styles.required}>*</span>
              </label>
              <p className={styles.fieldHint}>
                Total budget for the entire trip
              </p>
              <div className={styles.budgetWrapper}>
                <span className={styles.currencySymbol}>$</span>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  placeholder="Enter your total budget"
                  className={styles.budgetInput}
                  min="1"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" className={styles.submitButton}>
              <FaStar className={styles.buttonIcon} />
              Create My Perfect Itinerary
              <span className={styles.buttonArrow}>→</span>
            </button>
          </form>

          {/* Additional Info Section */}
          <div className={styles.additionalInfo}>
            <div className={styles.infoCard}>
              <FaStar className={styles.infoIcon} />
              <h3>AI-Powered Planning</h3>
              <p>
                Our advanced AI creates personalized itineraries based on your
                preferences
              </p>
            </div>
            <div className={styles.infoCard}>
              <FaMapMarkerAlt className={styles.infoIcon} />
              <h3>Local Insights</h3>
              <p>
                Get insider tips and hidden gems that only locals know about
              </p>
            </div>
            <div className={styles.infoCard}>
              <FaHeart className={styles.infoIcon} />
              <h3>Tailored Just for You</h3>
              <p>
                Every suggestion is customized to match your interests and
                travel style
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TripForm;
