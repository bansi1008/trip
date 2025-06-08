"use client";
import { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaRocket,
  FaTimes,
  FaCheck,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../../styles/components/Signup.css";
import { useRouter } from "next/navigation";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState(null);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otpValue, setOtpValue] = useState("");

  // Notification functions
  const showNotification = (message, type = "error") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000); // Auto hide after 5 seconds
  };

  const hideNotification = () => {
    setNotification(null);
  };

  const handleotp = async () => {
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        console.log("otp send", data);
        showNotification("OTP sent successfully to your email!", "success");
        setShowOTPModal(true);
      } else {
        console.log("error:", data.message);
        showNotification(
          data.message || "An error occurred while sending OTP",
          "error"
        );
      }
    } catch (error) {
      console.error("Network or server error:", error.message);
      showNotification(
        "Network error. Please check your connection and try again.",
        "error"
      );
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      handleotp();
    } else {
      setErrors(newErrors);
    }
  };

  // OTP Modal functions
  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Only allow digits
    if (value.length <= 6) {
      setOtpValue(value);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      if (otpValue.length !== 6) {
        showNotification("Please enter a 6-digit OTP code", "error");
        return;
      }
      const res = await fetch("api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          otp: otpValue,
          verifyOtp: true,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        console.log("otp verifes", data.message);
        showNotification(
          "you sign up successfully you'll be soon redirect to login page ",
          "success"
        );
        router.push("/signin");
      } else {
        console.log("error:", data.message);
      }
    } catch (error) {
      console.error("Network or server error:", error.message);
      showNotification(
        "Network error. Please check your connection and try again.",
        "error"
      );
    }
  };

  const closeOtpModal = () => {
    setShowOTPModal(false);
    setOtpValue("");
  };

  return (
    <div className="signup-page">
      <Navbar />

      <div className="signup-container">
        <div className="signup-content">
          {/* Left Side - Form */}
          <div className="signup-form-section">
            <div className="signup-header">
              <h1>Create Your Account</h1>
              <p>
                Join thousands of travelers who have discovered their perfect
                trips with AI
              </p>
            </div>

            <form className="signup-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <div className="input-wrapper">
                  <FaUser className="input-icon" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className={errors.name ? "error" : ""}
                  />
                </div>
                {errors.name && (
                  <span className="error-message">{errors.name}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-wrapper">
                  <FaEnvelope className="input-icon" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    className={errors.email ? "error" : ""}
                  />
                </div>
                {errors.email && (
                  <span className="error-message">{errors.email}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <FaLock className="input-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    className={errors.password ? "error" : ""}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && (
                  <span className="error-message">{errors.password}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="input-wrapper">
                  <FaLock className="input-icon" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    className={errors.confirmPassword ? "error" : ""}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <span className="error-message">
                    {errors.confirmPassword}
                  </span>
                )}
              </div>

              <button type="submit" className="signup-btn">
                <FaRocket className="btn-icon" />
                Create Account
              </button>
            </form>

            <div className="signup-footer">
              <p>
                Already have an account?
                <a href="/signin" className="signin-link">
                  Sign In
                </a>
              </p>
            </div>
          </div>

          {/* Right Side - Benefits */}
          <div className="signup-benefits">
            <div className="benefits-content">
              <h2>Why Join Our AI Travel Community?</h2>

              <div className="benefit-list">
                <div className="benefit-item">
                  <HiSparkles className="benefit-icon" />
                  <div>
                    <h4>Personalized Travel Experiences</h4>
                    <p>
                      Get AI-powered recommendations tailored to your unique
                      preferences and travel style.
                    </p>
                  </div>
                </div>

                <div className="benefit-item">
                  <FaRocket className="benefit-icon" />
                  <div>
                    <h4>Lightning-Fast Planning</h4>
                    <p>
                      Generate complete itineraries in minutes, not hours of
                      manual research.
                    </p>
                  </div>
                </div>

                <div className="benefit-item">
                  <FaUser className="benefit-icon" />
                  <div>
                    <h4>Smart Travel Persona</h4>
                    <p>
                      Discover your unique travel personality and get matched
                      with perfect destinations.
                    </p>
                  </div>
                </div>
              </div>

              <div className="success-stats">
                <div className="stat">
                  <span className="stat-number">50K+</span>
                  <span className="stat-label">Happy Travelers</span>
                </div>
                <div className="stat">
                  <span className="stat-number">200+</span>
                  <span className="stat-label">Destinations</span>
                </div>
                <div className="stat">
                  <span className="stat-number">98%</span>
                  <span className="stat-label">Satisfaction Rate</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          <div className="notification-content">
            <span className="notification-message">{notification.message}</span>
            <button className="notification-close" onClick={hideNotification}>
              <FaTimes />
            </button>
          </div>
        </div>
      )}

      {/* OTP Verification Modal */}
      {showOTPModal && (
        <div className="otp-modal-overlay">
          <div className="otp-modal">
            <div className="otp-modal-header">
              <h2>Verify Your Email</h2>
              <button className="modal-close" onClick={closeOtpModal}>
                <FaTimes />
              </button>
            </div>

            <div className="otp-modal-content">
              <p>
                We've sent a 6-digit verification code to your email address.
              </p>
              <p className="otp-email">{formData.email}</p>

              <div className="otp-input-section">
                <label htmlFor="otp">Enter Verification Code</label>
                <input
                  type="text"
                  id="otp"
                  value={otpValue}
                  onChange={handleOtpChange}
                  placeholder="000000"
                  className="otp-input"
                  maxLength="6"
                />
                <div className="otp-progress">{otpValue.length}/6</div>
              </div>

              <div className="otp-modal-actions">
                <button
                  className="otp-verify-btn"
                  onClick={handleVerifyOtp}
                  disabled={otpValue.length !== 6}
                >
                  <FaCheck className="btn-icon" />
                  Verify Code
                </button>

                <button className="otp-resend-btn" onClick={handleotp}>
                  Resend Code
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
