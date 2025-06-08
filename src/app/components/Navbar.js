"use client";

import { useState, useEffect } from "react";
import {
  FiMenu,
  FiX,
  FiUser,
  FiUserPlus,
  FiHome,
  FiZap,
  FiInfo,
  FiSettings,
} from "react-icons/fi";
import { HiSparkles } from "react-icons/hi";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={`navbar ${isScrolled ? "navbar-scrolled" : ""}`}>
      <div className="nav-container">
        <Link href="/" className="nav-logo">
          <img src="/logo2.jpg" alt="AiBasedTrip" className="logo-img" />
          <span className="logo-text">
            AiBasedTrip <HiSparkles className="logo-sparkle" />
          </span>
        </Link>

        <div className={`nav-menu ${isMenuOpen ? "nav-menu-active" : ""}`}>
          <Link href="/" className="nav-link">
            <FiHome className="nav-icon" />
            Home
          </Link>
          <Link href="#features" className="nav-link">
            <FiZap className="nav-icon" />
            Features
          </Link>
          <Link href="about" className="nav-link">
            <FiInfo className="nav-icon" />
            About Us
          </Link>
          <Link href="howitworks" className="nav-link">
            <FiSettings className="nav-icon" />
            How It Works
          </Link>
        </div>

        <div className="nav-auth">
          <button
            className="btn-secondary"
            onClick={() => router.push("/signin")}
          >
            <FiUser className="btn-icon" />
            Sign In
          </button>
          <button
            className="btn-primary"
            onClick={() => router.push("/signup")}
          >
            <FiUserPlus className="btn-icon" />
            Sign Up
          </button>
        </div>

        <button className="hamburger" onClick={toggleMenu}>
          {isMenuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>
    </nav>
  );
}
