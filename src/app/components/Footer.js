"use client";

import { useState } from "react";
import {
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiLinkedin,
  FiMail,
  FiSend,
  FiZap,
  FiTarget,
  FiSmartphone,
  FiHome,
  FiInfo,
  FiUsers,
  FiFileText,
  FiHelpCircle,
  FiPhone,
  FiShield,
} from "react-icons/fi";
import { FaBrain } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    console.log("Newsletter subscription:", email);
    setEmail("");
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-grid">
          {/* Company Section */}
          <div className="footer-section footer-company">
            <div className="footer-logo">
              <img
                src="/logo2.jpg"
                alt="AiBasedTrip"
                className="footer-logo-img"
              />
              <span className="footer-logo-text">AiBasedTrip</span>
            </div>

            <p>
              Revolutionizing travel planning with AI-powered personalization.
              Your perfect journey awaits with intelligent recommendations.
            </p>

            <div className="footer-social">
              <a href="#" className="social-link">
                <FiFacebook className="social-icon" />
              </a>
              <a href="#" className="social-link">
                <FiInstagram className="social-icon" />
              </a>
              <a href="#" className="social-link">
                <FiTwitter className="social-icon" />
              </a>
              <a href="#" className="social-link">
                <FiLinkedin className="social-icon" />
              </a>
            </div>
          </div>

          {/* Features Section */}
          <div className="footer-section">
            <h3>Features</h3>
            <ul className="footer-links">
              <li>
                <a href="#" className="footer-link">
                  <FaBrain className="footer-link-icon" />
                  Travel Persona Detection
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  <FiZap className="footer-link-icon" />
                  Mood-Based Suggestions
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  <FiTarget className="footer-link-icon" />
                  Smart Itineraries
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  <FiSmartphone className="footer-link-icon" />
                  Mobile App
                </a>
              </li>
            </ul>
          </div>

          {/* Company Section */}
          <div className="footer-section">
            <h3>Company</h3>
            <ul className="footer-links">
              <li>
                <a href="#" className="footer-link">
                  <FiInfo className="footer-link-icon" />
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  <FiHome className="footer-link-icon" />
                  How It Works
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  <FiUsers className="footer-link-icon" />
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  <FiFileText className="footer-link-icon" />
                  Press
                </a>
              </li>
            </ul>
          </div>

          {/* Support Section */}
          <div className="footer-section">
            <h3>Support</h3>
            <ul className="footer-links">
              <li>
                <a href="#" className="footer-link">
                  <FiHelpCircle className="footer-link-icon" />
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  <FiPhone className="footer-link-icon" />
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  <FiShield className="footer-link-icon" />
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  <FiFileText className="footer-link-icon" />
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Section */}
          <div className="footer-section">
            <h3>Stay Updated</h3>
            <p>
              Get travel inspiration and exclusive updates delivered to your
              inbox.
            </p>

            <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
              <input
                type="email"
                placeholder="Enter your email"
                className="newsletter-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="newsletter-submit">
                <FiSend className="submit-icon" />
              </button>
            </form>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>&copy; 2024 AiBasedTrip. All rights reserved.</p>
            <p>Developed By Bansi Dobariya</p>
          </div>
          <div className="footer-legal">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
