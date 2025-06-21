import { useState, useEffect } from "react";
import { FaSearch, FaMapMarkerAlt } from "react-icons/fa";
import styles from "./CitySearch.module.css";

const CitySearch = ({ onLocationSelect, selectedLocation }) => {
  const [query, setQuery] = useState(selectedLocation || "");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/places?input=${encodeURIComponent(query)}`
        );
        const data = await res.json();

        const cities =
          data.predictions?.map((item) => ({
            description: item.description,
            place_id: item.place_id,
          })) || [];

        setSuggestions(cities);
        setShowSuggestions(cities.length > 0);
      } catch (error) {
        console.error("Error fetching city suggestions:", error);
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 400);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleLocationSelect = (location) => {
    setQuery(location);
    setShowSuggestions(false);
    onLocationSelect?.(location);
  };

  return (
    <div className={styles.citySearch}>
      <div className={styles.searchInputContainer}>
        <FaSearch className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Where do you want to go?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={styles.searchInput}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
        />
        {isLoading && (
          <div className={styles.loadingSpinner}>
            <div className={styles.spinner}></div>
          </div>
        )}
      </div>

      {showSuggestions && (
        <div className={styles.suggestionsDropdown}>
          {suggestions.map((place) => (
            <div
              key={place.place_id}
              className={styles.suggestionItem}
              onClick={() => handleLocationSelect(place.description)}
            >
              <FaMapMarkerAlt className={styles.locationIcon} />
              <span>{place.description}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CitySearch;
