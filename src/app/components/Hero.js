"use client";

import {
  FiPlay,
  FiArrowDown,
  FiUsers,
  FiMapPin,
  FiTrendingUp,
} from "react-icons/fi";
import { HiRocketLaunch, HiSparkles } from "react-icons/hi2";

export default function Hero() {
  const handleScrollDown = () => {
    const nextSection = document.querySelector(".travel-persona");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="hero">
      <div className="hero-background">
        <img src="/header.jpg" alt="Travel Background" className="hero-img" />
        <div className="hero-overlay"></div>
      </div>

      <div className="hero-content">
        <div className="hero-badge">
          <HiSparkles className="badge-icon" />
          New: AI-Powered Travel Planning
        </div>

        <h1 className="hero-title">
          Create Your Perfect Trip with{" "}
          <span className="highlight">
            <HiRocketLaunch className="highlight-icon" />
            AI-Powered
          </span>{" "}
          Intelligence
        </h1>

        <p className="hero-subtitle">
          Discover personalized travel experiences tailored to your unique
          style. Our AI analyzes your preferences to create unforgettable
          journeys that match your mood and personality.
        </p>

        <div className="hero-cta">
          <a href="/signin" className="btn-hero-primary">
            <HiRocketLaunch className="btn-icon" />
            Start Planning Now
          </a>
          <a href="#demo" className="btn-hero-secondary">
            <FiPlay className="play-icon" />
            Watch Demo
          </a>
        </div>

        <div className="hero-stats">
          <div className="stat">
            <div className="stat-icon">
              <FiUsers />
            </div>
            <div className="stat-number">50K+</div>
            <div className="stat-label">Happy Travelers</div>
          </div>
          <div className="stat">
            <div className="stat-icon">
              <FiMapPin />
            </div>
            <div className="stat-number">200+</div>
            <div className="stat-label">Destinations</div>
          </div>
          <div className="stat">
            <div className="stat-icon">
              <FiTrendingUp />
            </div>
            <div className="stat-number">95%</div>
            <div className="stat-label">Satisfaction</div>
          </div>
        </div>
      </div>

      <div className="hero-scroll-indicator" onClick={handleScrollDown}>
        <span>Discover More</span>
        <div className="scroll-arrow">
          <FiArrowDown />
        </div>
      </div>
    </section>
  );
}
