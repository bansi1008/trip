"use client";

import { useState, useEffect } from "react";
import { FiZap, FiTarget, FiSun, FiMapPin, FiClock } from "react-icons/fi";
import { FaBrain } from "react-icons/fa";
import {
  GiNoodles,
  GiGreekTemple,
  GiLantern,
  GiVillage,
  GiSpring,
  GiCookingPot,
} from "react-icons/gi";
import { PiCherriesFill } from "react-icons/pi";
import { PiMountains } from "react-icons/pi";
import { IoMdTrain } from "react-icons/io";

export default function SmartItinerary() {
  const [visibleDay, setVisibleDay] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleDay((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const itineraryData = [
    {
      day: 1,
      activities: [
        {
          icon: PiMountains,
          time: "06:00",
          activity: "Sunrise Hike - Mt. Furano",
        },
        {
          icon: GiNoodles,
          time: "12:00",
          activity: "Authentic Ramen Experience",
        },
        {
          icon: GiGreekTemple,
          time: "15:00",
          activity: "Historic Temple Visit",
        },
      ],
    },
    {
      day: 2,
      activities: [
        { icon: IoMdTrain, time: "09:00", activity: "Scenic Train Journey" },
        {
          icon: PiCherriesFill,
          time: "13:00",
          activity: "Cherry Blossom Garden",
        },
        { icon: GiLantern, time: "18:00", activity: "Night Market Adventure" },
      ],
    },
    {
      day: 3,
      activities: [
        {
          icon: GiVillage,
          time: "10:00",
          activity: "Mountain Village Exploration",
        },
        {
          icon: GiSpring,
          time: "14:00",
          activity: "Traditional Hot Springs",
        },
        {
          icon: GiCookingPot,
          time: "17:00",
          activity: "Cooking Class Experience",
        },
      ],
    },
  ];

  const features = [
    {
      icon: FaBrain,
      title: "AI-optimized timing and routes",
      description: "Smart scheduling based on travel patterns",
    },
    {
      icon: FiZap,
      title: "No overlapping activities",
      description: "Intelligent conflict detection and resolution",
    },
    {
      icon: FiTarget,
      title: "Personalized recommendations",
      description: "Tailored to your preferences and interests",
    },
  ];

  return (
    <section className="smart-itinerary">
      <div className="container">
        <div className="section-header">
          <h2>AI-Powered Smart Itineraries</h2>
          <p>
            Get optimized, multi-day travel plans with perfect timing and no
            overlap
          </p>
        </div>

        <div className="itinerary-showcase">
          <div className="itinerary-visual">
            <div className="timeline-connector"></div>

            {itineraryData.map((dayData, index) => (
              <div
                key={dayData.day}
                className={`day-card ${
                  visibleDay === index ? "day-card-active" : ""
                }`}
              >
                <div className="day-header">
                  <FiSun className="day-icon" />
                  <span>Day {dayData.day}</span>
                </div>

                <div className="activities-list">
                  {dayData.activities.map((activity, actIndex) => {
                    const ActivityIcon = activity.icon;
                    return (
                      <div key={actIndex} className="activity">
                        <div className="activity-time">
                          <FiClock className="clock-icon" />
                          <span>{activity.time}</span>
                        </div>
                        <div className="activity-content">
                          <ActivityIcon className="activity-icon" />
                          <span>{activity.activity}</span>
                        </div>
                        <div className="activity-glow"></div>
                      </div>
                    );
                  })}
                </div>

                <div className="day-number">{dayData.day}</div>
                <div className="card-particles">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className={`card-particle particle-${i}`}
                    ></div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="itinerary-features">
            <div className="features-header">
              <h3>Smart Planning Features</h3>
            </div>

            {features.map((feature, index) => {
              const FeatureIcon = feature.icon;
              return (
                <div key={index} className="feature-point">
                  <div className="feature-icon-wrapper">
                    <FeatureIcon className="feature-icon" />
                    <div className="icon-pulse"></div>
                  </div>
                  <div className="feature-content">
                    <h4>{feature.title}</h4>
                    <p>{feature.description}</p>
                  </div>
                </div>
              );
            })}

            <div className="ai-indicator">
              <div className="ai-pulse">
                <FaBrain className="ai-brain" />
              </div>
              <span>AI Processing...</span>
            </div>
          </div>
        </div>
      </div>

      <div className="neural-network">
        {[...Array(15)].map((_, i) => (
          <div key={i} className={`neural-node node-${i}`}></div>
        ))}
        {[...Array(25)].map((_, i) => (
          <div key={i} className={`neural-connection connection-${i}`}></div>
        ))}
      </div>
    </section>
  );
}
