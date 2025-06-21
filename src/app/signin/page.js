"use client";
import { useState } from "react";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaSignInAlt,
  FaTimes,
} from "react-icons/fa";
import { HiSparkles, HiLightBulb } from "react-icons/hi";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../../styles/components/Signin.css";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
//import { cookies } from "next/headers";
//import { jwtVerify } from "jose";
//import { redirect } from "next/navigation";

export default function Signin() {
  // const token = cookies().get("token")?.value;

  // if (token) {
  //   try {
  //     const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  //     await jwtVerify(token, secret);
  //     redirect("/home");
  //   } catch (e) {
  //     toast.error("Invalid token, please log in again.");
  //   }
  // }

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  // Notification functions
  const showNotification = (message, type = "error") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const hideNotification = () => {
    setNotification(null);
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

    return newErrors;
  };

  const handleSignin = async () => {
    try {
      const res = await fetch("api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Login successful, cheers, enjoy the harmony!");
        router.push("/home");
      } else {
        toast.error(data.message || "Something went wrong.");
      }

      setIsLoading(false);
    } catch (error) {
      toast.error(error.message || "it's not you it's us, try again later :)");

      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      handleSignin();
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="signin-page">
      <Navbar />

      <div className="signin-container">
        <div className="signin-content">
          {/* Left Side - Form */}
          <div className="signin-form-section">
            <div className="signin-header">
              <h1>Welcome Back</h1>
              <p>Sign in to continue your AI-powered travel journey</p>
            </div>

            <form className="signin-form" onSubmit={handleSubmit}>
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
                    placeholder="Enter your password"
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

              <div className="form-options">
                <div className="remember-me">
                  <input type="checkbox" id="remember" />
                  <label htmlFor="remember">Remember me</label>
                </div>
                <a href="#" className="forgot-password">
                  Forgot password?
                </a>
              </div>

              <button type="submit" className="signin-btn" disabled={isLoading}>
                <FaSignInAlt className="btn-icon" />
                {isLoading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="signin-footer">
              <p>
                Don't have an account?
                <a href="/signup" className="signup-link">
                  Sign Up
                </a>
              </p>
            </div>

            <div className="divider">
              <span>or</span>
            </div>

            <div className="social-signin">
              <button className="google-btn">
                <svg className="google-icon" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </button>
            </div>
          </div>

          {/* Right Side - Benefits */}
          <div className="signin-benefits">
            <div className="benefits-content">
              <h2>Continue Your Journey</h2>

              <div className="benefit-list">
                <div className="benefit-item">
                  <HiSparkles className="benefit-icon" />
                  <div>
                    <h4>Your Saved Preferences</h4>
                    <p>
                      Access your personalized travel profile and continue where
                      you left off.
                    </p>
                  </div>
                </div>

                <div className="benefit-item">
                  <FaSignInAlt className="benefit-icon" />
                  <div>
                    <h4>Quick Trip Planning</h4>
                    <p>
                      Jump straight into planning with your saved travel persona
                      and preferences.
                    </p>
                  </div>
                </div>

                <div className="benefit-item">
                  <HiLightBulb className="benefit-icon" />
                  <div>
                    <h4>Smart Recommendations</h4>
                    <p>
                      Get even better AI suggestions based on your travel
                      history and feedback.
                    </p>
                  </div>
                </div>
              </div>

              <div className="feature-highlight">
                <h3>New Features Available</h3>
                <ul>
                  <li>Enhanced mood-based recommendations</li>
                  <li>Real-time itinerary updates</li>
                  <li>Improved travel persona detection</li>
                </ul>
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

      <Footer />
    </div>
  );
}
