"use client";

import {
  FiTarget,
  FiUsers,
  FiGlobe,
  FiZap,
  FiHeart,
  FiAward,
  FiTrendingUp,
  FiShield,
  FiCode,
  FiCompass,
} from "react-icons/fi";
import { FaBrain } from "react-icons/fa";
import { HiRocketLaunch, HiSparkles } from "react-icons/hi2";
import Navbar from "../components/Navbar";

export default function AboutPage() {
  const values = [
    {
      icon: FaBrain,
      title: "AI-First Innovation",
      description:
        "We leverage cutting-edge artificial intelligence to create personalized travel experiences that understand your unique preferences.",
    },
    {
      icon: FiHeart,
      title: "Traveler-Centric",
      description:
        "Every feature we build puts travelers first, ensuring seamless, enjoyable, and memorable journey planning experiences.",
    },
    {
      icon: FiGlobe,
      title: "Global Accessibility",
      description:
        "Making travel planning accessible to everyone, everywhere, with support for diverse cultures, languages, and travel styles.",
    },
    {
      icon: FiShield,
      title: "Trust & Security",
      description:
        "Your data and privacy are paramount. We maintain the highest standards of security and transparency in everything we do.",
    },
  ];

  const stats = [
    { icon: FiUsers, number: "50K+", label: "Happy Travelers" },
    { icon: FiGlobe, number: "200+", label: "Destinations" },
    { icon: FiTrendingUp, number: "95%", label: "Satisfaction Rate" },
    { icon: FiAward, number: "50+", label: "AI Models" },
  ];

  const team = [
    {
      name: "Sarah Chen",
      role: "CEO & Co-founder",
      description:
        "Former Google AI researcher with 10+ years in machine learning and travel tech.",
      icon: FiTarget,
    },
    {
      name: "Marcus Rodriguez",
      role: "CTO & Co-founder",
      description:
        "Ex-Airbnb engineer specializing in scalable AI systems and recommendation engines.",
      icon: FiCode,
    },
    {
      name: "Elena Kowalski",
      role: "Head of AI",
      description:
        "PhD in Computer Science, leading our persona detection and mood analysis algorithms.",
      icon: FaBrain,
    },
    {
      name: "David Park",
      role: "Head of Product",
      description:
        "Former product lead at Booking.com, passionate about intuitive travel experiences.",
      icon: FiCompass,
    },
  ];

  return (
    <>
      <Navbar />
      <div className="about-page">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="container">
            <div className="about-hero-content">
              <div className="hero-badge">
                <HiSparkles className="badge-icon" />
                About AiBasedTrip
              </div>

              <h1 className="about-hero-title">
                Revolutionizing Travel with{" "}
                <span className="highlight">
                  <HiRocketLaunch className="highlight-icon" />
                  AI Intelligence
                </span>
              </h1>

              <p className="about-hero-subtitle">
                We're on a mission to make travel planning effortless,
                personalized, and magical. Our AI understands you better than
                any travel agent, creating perfect journeys that match your
                unique style and preferences.
              </p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="about-story">
          <div className="container">
            <div className="story-content">
              <div className="story-text">
                <h2>Our Story</h2>
                <p>
                  AiBasedTrip was born from a simple frustration: planning the
                  perfect trip shouldn't take weeks of research. As frequent
                  travelers and technologists, we experienced firsthand how
                  overwhelming it can be to sort through endless options,
                  reviews, and recommendations.
                </p>
                <p>
                  In 2023, we set out to solve this problem using the latest
                  advances in artificial intelligence. Our breakthrough came
                  when we developed our proprietary Travel Persona Detection
                  system, which analyzes not just what you like, but how you
                  feel and what kind of experience you're seeking.
                </p>
                <p>
                  Today, we're proud to serve over 50,000 travelers worldwide,
                  helping them discover destinations and experiences they never
                  knew they wanted.
                </p>
              </div>
              <div className="story-stats">
                {stats.map((stat, index) => (
                  <div key={index} className="stat-card">
                    <div className="stat-icon">
                      <stat.icon />
                    </div>
                    <div className="stat-number">{stat.number}</div>
                    <div className="stat-label">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="about-values">
          <div className="container">
            <div className="section-header">
              <h2>Our Values</h2>
              <p>
                These core principles guide everything we do, from product
                development to customer support.
              </p>
            </div>

            <div className="values-grid">
              {values.map((value, index) => (
                <div key={index} className="value-card">
                  <div className="value-icon">
                    <value.icon />
                  </div>
                  <h3>{value.title}</h3>
                  <p>{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="about-team">
          <div className="container">
            <div className="section-header">
              <h2>Meet Our Team</h2>
              <p>
                The passionate minds behind AiBasedTrip, bringing together
                expertise in AI, travel, and user experience.
              </p>
            </div>

            <div className="team-grid">
              {team.map((member, index) => (
                <div key={index} className="team-card">
                  <div className="team-icon">
                    <member.icon />
                  </div>
                  <h3>{member.name}</h3>
                  <h4>{member.role}</h4>
                  <p>{member.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="about-cta">
          <div className="container">
            <div className="cta-content">
              <h2>Ready to Experience AI-Powered Travel?</h2>
              <p>
                Join thousands of travelers who've discovered their perfect
                trips with our AI technology.
              </p>
              <div className="cta-buttons">
                <a href="/" className="about-btn-primary">
                  <HiRocketLaunch className="btn-icon" />
                  Start Planning
                </a>
                <a href="#contact" className="about-btn-secondary">
                  <FiUsers className="btn-icon" />
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
