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
  FaPlaneDeparture,
  FaPlaneArrival,
  FaArrowRight,
} from "react-icons/fa";

const TripForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    location: "",
    origin: "",
    days: 3,
    startDate: "",
    returnDate: "",
    interests: [],
    travelgroup: "1",
    numberOfAdults: 1,
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
    const newDays = increment
      ? Math.min(formData.days + 1, 30)
      : Math.max(formData.days - 1, 1);

    setFormData((prev) => {
      const updated = { ...prev, days: newDays };

      // Recalculate return date if start date exists
      if (updated.startDate) {
        const returnDate = new Date(updated.startDate);
        returnDate.setDate(returnDate.getDate() + newDays);
        updated.returnDate = returnDate.toISOString().split("T")[0];
      }

      return updated;
    });
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

  // Handle origin location changes with suggestions
  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);

  const handleOriginChange = async (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, origin: value }));

    if (value.length >= 2) {
      try {
        const res = await fetch(
          `/api/places?input=${encodeURIComponent(value)}`
        );
        const data = await res.json();

        if (data.predictions) {
          setOriginSuggestions(
            data.predictions.map((item) => ({
              description: item.description,
              place_id: item.place_id,
            }))
          );
          setShowOriginSuggestions(true);
        }
      } catch (error) {
        console.error("Error fetching origin suggestions:", error);
      }
    } else {
      setOriginSuggestions([]);
      setShowOriginSuggestions(false);
    }
  };

  const handleOriginSelect = (location) => {
    setFormData((prev) => ({ ...prev, origin: location.description }));
    setOriginSuggestions([]);
    setShowOriginSuggestions(false);
  };

  // Handle start date changes
  const handleStartDateChange = (e) => {
    const startDate = e.target.value;
    setFormData((prev) => {
      const updated = { ...prev, startDate };

      // Calculate return date automatically
      if (startDate) {
        const returnDate = new Date(startDate);
        returnDate.setDate(returnDate.getDate() + prev.days);
        updated.returnDate = returnDate.toISOString().split("T")[0];
      } else {
        updated.returnDate = "";
      }

      return updated;
    });
  };

  // Handle travel group changes with adult count logic
  const handleTravelGroupChange = (value) => {
    setFormData((prev) => {
      const updated = { ...prev, travelgroup: value };

      // Set number of adults based on travel group
      if (value === "1") {
        updated.numberOfAdults = 1; // Solo
      } else if (value === "2") {
        updated.numberOfAdults = 2; // Couple
      } else {
        // For other groups, keep existing value or set to 3 as default
        if (prev.numberOfAdults <= 2) {
          updated.numberOfAdults = 3;
        }
      }

      return updated;
    });
  };

  // Handle manual adult count changes
  const handleAdultCountChange = (e) => {
    const count = parseInt(e.target.value) || 1;
    setFormData((prev) => ({ ...prev, numberOfAdults: Math.max(1, count) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.location ||
      !formData.origin ||
      !formData.startDate ||
      formData.interests.length === 0 ||
      !formData.budget
    ) {
      alert(
        "Please fill in all required fields including origin, travel date, and select at least one interest"
      );
      return;
    }

    // Store flight data in session storage for other components
    const flightData = {
      origin: formData.origin,
      destination: formData.location,
      startDate: formData.startDate,
      returnDate: formData.returnDate,
      numberOfAdults: formData.numberOfAdults,
      travelDays: formData.days,
      budget: formData.budget,
    };

    sessionStorage.setItem("flightData", JSON.stringify(flightData));
    console.log("Flight data stored:", flightData);

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

            {/* Origin Field */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                <span className={styles.labelText}>
                  <FaPlaneDeparture className={styles.labelIcon} />
                  Origin (Departure from)
                </span>
                <span className={styles.required}>*</span>
              </label>
              <div className={styles.locationWrapper}>
                <input
                  type="text"
                  value={formData.origin}
                  onChange={handleOriginChange}
                  placeholder="Where are you departing from?"
                  className={styles.input}
                  autoComplete="off"
                />
                {showOriginSuggestions && originSuggestions.length > 0 && (
                  <div className={styles.suggestions}>
                    {originSuggestions.map((suggestion) => (
                      <div
                        key={suggestion.place_id}
                        className={styles.suggestionItem}
                        onClick={() => handleOriginSelect(suggestion)}
                      >
                        <FaPlaneDeparture className={styles.suggestionIcon} />
                        {suggestion.description}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Travel Dates */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                <span className={styles.labelText}>
                  <FaCalendarAlt className={styles.labelIcon} />
                  Travel Dates
                </span>
                <span className={styles.required}>*</span>
              </label>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto 1fr",
                  gap: "1rem",
                  alignItems: "center",
                }}
              >
                <div>
                  <label
                    style={{
                      fontSize: "0.9rem",
                      color: "#666",
                      marginBottom: "0.5rem",
                      display: "block",
                    }}
                  >
                    Departure Date
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={handleStartDateChange}
                    className={styles.input}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <FaArrowRight
                  style={{
                    color: "#666",
                    fontSize: "1.2rem",
                    marginTop: "1.5rem",
                  }}
                />
                <div>
                  <label
                    style={{
                      fontSize: "0.9rem",
                      color: "#666",
                      marginBottom: "0.5rem",
                      display: "block",
                    }}
                  >
                    Return Date
                  </label>
                  <input
                    type="date"
                    value={formData.returnDate}
                    readOnly
                    className={styles.input}
                    style={{
                      backgroundColor: "#f8f9fa",
                      cursor: "not-allowed",
                    }}
                    placeholder="Auto-calculated"
                  />
                </div>
              </div>
              <p className={styles.fieldHint}>
                Return date is automatically calculated based on your trip
                duration
              </p>
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
                      onClick={() => handleTravelGroupChange(option.value)}
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

            {/* Number of Adults Field */}
            {formData.travelgroup !== "1" && formData.travelgroup !== "2" && (
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <span className={styles.labelText}>
                    <FaUsers className={styles.labelIcon} />
                    Number of Adults
                  </span>
                  <span className={styles.required}>*</span>
                </label>
                <p className={styles.fieldHint}>
                  How many adults will be traveling?
                </p>
                <div className={styles.daysCounter}>
                  <button
                    type="button"
                    className={styles.counterButton}
                    onClick={() =>
                      handleAdultCountChange({
                        target: { value: formData.numberOfAdults - 1 },
                      })
                    }
                    disabled={formData.numberOfAdults <= 1}
                  >
                    <FaMinus />
                  </button>
                  <div className={styles.counterValue}>
                    <span className={styles.daysNumber}>
                      {formData.numberOfAdults}
                    </span>
                    <span className={styles.daysLabel}>
                      {formData.numberOfAdults === 1 ? "Adult" : "Adults"}
                    </span>
                  </div>
                  <button
                    type="button"
                    className={styles.counterButton}
                    onClick={() =>
                      handleAdultCountChange({
                        target: { value: formData.numberOfAdults + 1 },
                      })
                    }
                    disabled={formData.numberOfAdults >= 10}
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>
            )}

            {/* Adult Count Display for Solo/Couple */}
            {(formData.travelgroup === "1" || formData.travelgroup === "2") && (
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <span className={styles.labelText}>
                    <FaUsers className={styles.labelIcon} />
                    Number of Adults
                  </span>
                </label>
                <div
                  style={{
                    padding: "1rem",
                    background: "#f8f9fa",
                    borderRadius: "8px",
                    color: "#666",
                    textAlign: "center",
                  }}
                >
                  <strong>
                    {formData.numberOfAdults} Adult
                    {formData.numberOfAdults !== 1 ? "s" : ""}
                  </strong>
                  <br />
                  <small>Automatically set based on travel group</small>
                </div>
              </div>
            )}

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
