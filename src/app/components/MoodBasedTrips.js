"use client";

import { useState } from "react";
import { FiSun, FiZap, FiMusic } from "react-icons/fi";
import { TfiPalette } from "react-icons/tfi";
import { GiParachute, GiPaintBrush, GiPartyFlags } from "react-icons/gi";
import { PiMountains } from "react-icons/pi";

export default function MoodBasedTrips() {
  const [activeCard, setActiveCard] = useState(null);

  const moods = [
    {
      id: 1,
      mainIcon: FiSun,
      decorIcon: PiMountains,
      title: "Need to Escape",
      description: "Remote beaches, mountain retreats, and peaceful hideaways",
      gradient: "from-amber-400 via-orange-500 to-red-500",
      bgColor: "bg-gradient-to-br from-orange-50 to-amber-50",
    },
    {
      id: 2,
      mainIcon: FiZap,
      decorIcon: GiParachute,
      title: "Adventure Mode",
      description:
        "Extreme sports, hiking trails, and adrenaline-pumping activities",
      gradient: "from-blue-400 via-cyan-500 to-teal-500",
      bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50",
    },
    {
      id: 3,
      mainIcon: TfiPalette,
      decorIcon: GiPaintBrush,
      title: "Creative Inspiration",
      description:
        "Art galleries, creative workshops, and culturally rich cities",
      gradient: "from-purple-400 via-pink-500 to-red-500",
      bgColor: "bg-gradient-to-br from-purple-50 to-pink-50",
    },
    {
      id: 4,
      mainIcon: FiMusic,
      decorIcon: GiPartyFlags,
      title: "Celebration Time",
      description: "Vibrant nightlife, festivals, and joyful experiences",
      gradient: "from-green-400 via-emerald-500 to-teal-500",
      bgColor: "bg-gradient-to-br from-green-50 to-emerald-50",
    },
  ];

  return (
    <section className="mood-based-trips">
      <div className="container">
        <div className="section-header">
          <h2>Travel Based on Your Mood</h2>
          <p>
            Tell us how you're feeling, and we'll suggest the perfect
            destination
          </p>
        </div>

        <div className="mood-grid">
          {moods.map((mood) => {
            const MainIcon = mood.mainIcon;
            const DecorIcon = mood.decorIcon;

            return (
              <div
                key={mood.id}
                className={`mood-card ${
                  activeCard === mood.id ? "mood-card-active" : ""
                }`}
                onMouseEnter={() => setActiveCard(mood.id)}
                onMouseLeave={() => setActiveCard(null)}
              >
                <div className="mood-icon-wrapper">
                  <div
                    className={`mood-icon bg-gradient-to-br ${mood.gradient}`}
                  >
                    <MainIcon className="main-mood-icon" />
                    <DecorIcon className="decor-mood-icon" />
                  </div>

                  <div className="icon-ripple">
                    <div className="ripple-circle ripple-1"></div>
                    <div className="ripple-circle ripple-2"></div>
                    <div className="ripple-circle ripple-3"></div>
                  </div>
                </div>

                <div className="mood-content">
                  <h3>{mood.title}</h3>
                  <p>{mood.description}</p>
                </div>

                <div className="mood-particles">
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className={`mood-particle mood-particle-${i}`}
                    ></div>
                  ))}
                </div>

                <div className="mood-glow"></div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="background-morphism">
        <div className="morph-blob morph-1"></div>
        <div className="morph-blob morph-2"></div>
        <div className="morph-blob morph-3"></div>
      </div>
    </section>
  );
}
