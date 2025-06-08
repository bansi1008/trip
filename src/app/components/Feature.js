"use client";

import { useState } from "react";
import {
  FiZap,
  FiTarget,
  FiGlobe,
  FiSmartphone,
  FiTrendingUp,
} from "react-icons/fi";

import { FaBrain } from "react-icons/fa";

export default function Feature() {
  const [hoveredFeature, setHoveredFeature] = useState(null);

  const features = [
    {
      id: 1,
      icon: FaBrain,
      title: "AI-Powered Intelligence",
      description:
        "Our advanced AI algorithms learn from your preferences to create perfectly tailored travel experiences.",
      color: "from-blue-500 to-purple-600",
      delay: "0ms",
    },
    {
      id: 2,
      icon: FiZap,
      title: "Instant Planning",
      description:
        "Get complete itineraries in seconds, not hours. Our AI works 24/7 to plan your perfect trip.",
      color: "from-yellow-500 to-orange-600",
      delay: "100ms",
    },
    {
      id: 3,
      icon: FiTarget,
      title: "Personalized Experiences",
      description:
        "Every recommendation is tailored to your unique travel style, budget, and personal preferences.",
      color: "from-pink-500 to-red-600",
      delay: "200ms",
    },
    {
      id: 4,
      icon: FiGlobe,
      title: "Global Coverage",
      description:
        "From hidden gems to popular destinations, access recommendations for over 200 countries worldwide.",
      color: "from-green-500 to-teal-600",
      delay: "300ms",
    },
    {
      id: 5,
      icon: FiSmartphone,
      title: "Smart Mobile App",
      description:
        "Take your itinerary anywhere with offline access, real-time updates, and location-based suggestions.",
      color: "from-indigo-500 to-blue-600",
      delay: "400ms",
    },
    {
      id: 6,
      icon: FiTrendingUp,
      title: "Continuous Learning",
      description:
        "Our AI gets smarter with every trip, continuously improving recommendations based on your feedback.",
      color: "from-purple-500 to-pink-600",
      delay: "500ms",
    },
  ];

  return (
    <section className="features" id="features">
      <div className="container">
        <div className="features-header">
          <h2>Why Choose AI Travel?</h2>
          <p>
            Experience the future of travel planning with our intelligent
            platform
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature) => {
            const IconComponent = feature.icon;

            return (
              <div
                key={feature.id}
                className={`feature-card ${
                  hoveredFeature === feature.id ? "feature-card-hovered" : ""
                }`}
                onMouseEnter={() => setHoveredFeature(feature.id)}
                onMouseLeave={() => setHoveredFeature(null)}
                style={{ animationDelay: feature.delay }}
              >
                <div className="feature-icon-container">
                  <div
                    className={`feature-icon bg-gradient-to-br ${feature.color}`}
                  >
                    <IconComponent className="icon-main" />
                  </div>

                  <div className="icon-orbit">
                    <div className="orbit-ring ring-1"></div>
                    <div className="orbit-ring ring-2"></div>
                    <div className="orbit-particle particle-1"></div>
                    <div className="orbit-particle particle-2"></div>
                    <div className="orbit-particle particle-3"></div>
                  </div>
                </div>

                <div className="feature-content">
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>

                <div className="feature-background-effect">
                  <div className="bg-particle bg-particle-1"></div>
                  <div className="bg-particle bg-particle-2"></div>
                  <div className="bg-particle bg-particle-3"></div>
                </div>

                <div className="card-magnetic-field"></div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="features-background-animation">
        <div className="floating-grid">
          {[...Array(12)].map((_, i) => (
            <div key={i} className={`grid-dot dot-${i}`}></div>
          ))}
        </div>

        <div className="energy-waves">
          <div className="wave wave-1"></div>
          <div className="wave wave-2"></div>
          <div className="wave wave-3"></div>
        </div>
      </div>
    </section>
  );
}
