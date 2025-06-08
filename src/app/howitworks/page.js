"use client";
import {
  FaUserTie,
  FaHeart,
  FaRoute,
  FaRocket,
  FaCheck,
  FaCog,
  FaBrain,
  FaMapMarkedAlt,
} from "react-icons/fa";
import { HiLightBulb, HiSparkles, HiGlobeAlt } from "react-icons/hi";
import { BiSupport } from "react-icons/bi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../../styles/components/HowItWorks.css";

export default function HowItWorks() {
  return (
    <div className="howitworks-page">
      <Navbar />

      {/* Hero Section */}
      <section className="howitworks-hero">
        <div className="howitworks-hero-content">
          <h1 className="howitworks-hero-title">
            How Our AI Travel Assistant Works
          </h1>
          <p className="howitworks-hero-subtitle">
            Discover how cutting-edge AI transforms your travel dreams into
            perfectly crafted itineraries in just 3 simple steps.
          </p>
        </div>
      </section>

      {/* Process Steps */}
      <section className="process-steps">
        <div className="process-container">
          <h2 className="section-title">Your Journey to Perfect Travel</h2>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">01</div>
              <div className="step-icon">
                <FaUserTie />
              </div>
              <h3>Discover Your Travel Persona</h3>
              <p>
                Our AI analyzes your preferences, travel style, and interests to
                create a unique travel profile that guides every recommendation.
              </p>
              <div className="step-features">
                <div className="feature-item">
                  <FaCheck className="check-icon" />
                  <span>Personality Assessment</span>
                </div>
                <div className="feature-item">
                  <FaCheck className="check-icon" />
                  <span>Travel Style Analysis</span>
                </div>
                <div className="feature-item">
                  <FaCheck className="check-icon" />
                  <span>Preference Mapping</span>
                </div>
              </div>
            </div>

            <div className="step-card">
              <div className="step-number">02</div>
              <div className="step-icon">
                <FaHeart />
              </div>
              <h3>Match Your Current Mood</h3>
              <p>
                Tell us how you're feeling today, and our AI will suggest
                destinations and experiences that perfectly align with your
                current mindset.
              </p>
              <div className="step-features">
                <div className="feature-item">
                  <FaCheck className="check-icon" />
                  <span>Mood Recognition</span>
                </div>
                <div className="feature-item">
                  <FaCheck className="check-icon" />
                  <span>Emotion-Based Suggestions</span>
                </div>
                <div className="feature-item">
                  <FaCheck className="check-icon" />
                  <span>Personalized Recommendations</span>
                </div>
              </div>
            </div>

            <div className="step-card">
              <div className="step-number">03</div>
              <div className="step-icon">
                <FaRoute />
              </div>
              <h3>Get Your Smart Itinerary</h3>
              <p>
                Watch as our AI crafts a detailed, day-by-day itinerary
                optimized for your time, budget, and interests with real-time
                adjustments.
              </p>
              <div className="step-features">
                <div className="feature-item">
                  <FaCheck className="check-icon" />
                  <span>Smart Scheduling</span>
                </div>
                <div className="feature-item">
                  <FaCheck className="check-icon" />
                  <span>Budget Optimization</span>
                </div>
                <div className="feature-item">
                  <FaCheck className="check-icon" />
                  <span>Real-time Updates</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Behind */}
      <section className="technology-section">
        <div className="technology-container">
          <div className="technology-content">
            <div className="technology-text">
              <h2>The AI Technology Behind Your Perfect Trip</h2>
              <p>
                Our advanced artificial intelligence combines multiple data
                sources and machine learning algorithms to understand your
                unique travel needs and preferences.
              </p>

              <div className="tech-features">
                <div className="tech-feature">
                  <FaBrain className="tech-icon" />
                  <div>
                    <h4>Neural Network Analysis</h4>
                    <p>
                      Deep learning algorithms analyze millions of travel
                      patterns to predict your perfect destinations.
                    </p>
                  </div>
                </div>

                <div className="tech-feature">
                  <HiLightBulb className="tech-icon" />
                  <div>
                    <h4>Intelligent Recommendations</h4>
                    <p>
                      Machine learning continuously improves suggestions based
                      on user feedback and travel outcomes.
                    </p>
                  </div>
                </div>

                <div className="tech-feature">
                  <FaCog className="tech-icon" />
                  <div>
                    <h4>Real-time Optimization</h4>
                    <p>
                      Dynamic algorithms adjust your itinerary based on weather,
                      availability, and local events.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="technology-stats">
              <div className="stat-item">
                <HiSparkles className="stat-icon" />
                <div className="stat-number">98%</div>
                <div className="stat-label">Accuracy Rate</div>
              </div>

              <div className="stat-item">
                <FaMapMarkedAlt className="stat-icon" />
                <div className="stat-number">500K+</div>
                <div className="stat-label">Destinations Analyzed</div>
              </div>

              <div className="stat-item">
                <HiGlobeAlt className="stat-icon" />
                <div className="stat-number">50+</div>
                <div className="stat-label">Countries Covered</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="benefits-container">
          <h2 className="section-title">
            Why Choose AI-Powered Travel Planning?
          </h2>

          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">
                <FaRocket />
              </div>
              <h3>Lightning Fast</h3>
              <p>
                Get a complete travel itinerary in minutes, not hours of manual
                research and planning.
              </p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">
                <HiSparkles />
              </div>
              <h3>Highly Personalized</h3>
              <p>
                Every recommendation is tailored specifically to your
                preferences, style, and current mood.
              </p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">
                <FaCog />
              </div>
              <h3>Continuously Learning</h3>
              <p>
                Our AI gets smarter with every trip, improving recommendations
                for future travels.
              </p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">
                <BiSupport />
              </div>
              <h3>24/7 Support</h3>
              <p>
                AI assistance available round the clock to modify and optimize
                your travel plans.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="howitworks-cta">
        <div className="cta-content">
          <h2>Ready to Experience AI-Powered Travel?</h2>
          <p>
            Join thousands of travelers who have discovered their perfect trips
            with our intelligent travel assistant.
          </p>
          <div className="cta-buttons">
            <a href="/" className="howitworks-btn-primary">
              <FaRocket className="btn-icon" />
              Start Your Journey
            </a>
            <a href="/about" className="howitworks-btn-secondary">
              <HiLightBulb className="btn-icon" />
              Learn More
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
