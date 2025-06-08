"use client";

import { useState } from "react";
import { FiHeart, FiBookOpen, FiStar } from "react-icons/fi";
import {
  GiMountainClimbing,
  GiMeditation,
  GiGreekTemple,
  GiDiamondRing,
} from "react-icons/gi";

import { FaMountain } from "react-icons/fa";

export default function TravelPersona() {
  const [hoveredCard, setHoveredCard] = useState(null);

  const personas = [
    {
      id: 1,
      icon: GiMountainClimbing,
      secondaryIcon: FaMountain,
      title: "Adventurous Explorer",
      description:
        "Thrill-seeking adventures, extreme sports, and off-the-beaten-path destinations.",
    },
    {
      id: 2,
      icon: GiMeditation,
      secondaryIcon: FiHeart,
      title: "Peaceful Wanderer",
      description:
        "Serene locations, wellness retreats, and mindful travel experiences.",
    },
    {
      id: 3,
      icon: GiGreekTemple,
      secondaryIcon: FiBookOpen,
      title: "Cultural Enthusiast",
      description:
        "Rich history, museums, local traditions, and authentic cultural immersion.",
    },
    {
      id: 4,
      icon: GiDiamondRing,
      secondaryIcon: FiStar,
      title: "Luxury Traveler",
      description:
        "Premium experiences, five-star accommodations, and exclusive destinations.",
    },
  ];

  return (
    <section className="travel-persona">
      <div className="container">
        <div className="section-header">
          <h2>Discover Your Travel Persona</h2>
          <p>
            Our AI analyzes your preferences to understand your unique travel
            style and personality, creating personalized recommendations just
            for you.
          </p>
        </div>

        <div className="persona-grid">
          {personas.map((persona) => (
            <div
              key={persona.id}
              className={`persona-card ${
                hoveredCard === persona.id ? "persona-card-hovered" : ""
              }`}
              onMouseEnter={() => setHoveredCard(persona.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="persona-icon-container">
                <div className="persona-icon">
                  <persona.icon className="main-icon" />
                  <persona.secondaryIcon className="secondary-icon" />
                </div>
              </div>
              <h3>{persona.title}</h3>
              <p>{persona.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
