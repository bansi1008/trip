"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  FaHome,
  FaBookmark,
  FaSignOutAlt,
  FaUser,
  FaBars,
  FaTimes,
  FaRoute,
  FaMapMarkerAlt,
} from "react-icons/fa";
import styles from "./TripNavbar.module.css";

export default function TripNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Mock user data - replace with actual user data from your auth system
    const mockUser = {
      name: "Bansi Dobariya",
      email: "bansidobariya@example.com",
      avatar:
        "https://gravatar.com/avatar/70ee318f5b3659179826868bfb45b2b2?s=400&d=robohash&r=x", // You can add avatar URL here
    };
    setUser(mockUser);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavigation = (path) => {
    router.push(path);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    console.log("Logout clicked");
    // For now, just redirect to home
    router.push("/");
    setIsMenuOpen(false);
  };

  const navItems = [
    {
      label: "Home",
      icon: FaHome,
      path: "/home",
      isActive: pathname === "/home",
    },
    {
      label: "Saved Trips",
      icon: FaBookmark,
      path: "/saved-trips",
      isActive: pathname === "/saved-trips",
    },
  ];

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        {/* Logo/Brand */}
        <div className={styles.brand} onClick={() => handleNavigation("/home")}>
          <FaRoute className={styles.brandIcon} />
          <span className={styles.brandText}>TripAI</span>
        </div>

        {/* Desktop Navigation */}
        <div className={styles.navItems}>
          {navItems.map((item) => (
            <button
              key={item.path}
              className={`${styles.navItem} ${
                item.isActive ? styles.active : ""
              }`}
              onClick={() => handleNavigation(item.path)}
            >
              <item.icon className={styles.navIcon} />
              <span className={styles.navLabel}>{item.label}</span>
            </button>
          ))}
        </div>

        {/* User Profile & Actions */}
        <div className={styles.userSection}>
          {user && (
            <>
              {/* User Profile */}
              <div className={styles.userProfile}>
                <div className={styles.avatar}>
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className={styles.avatarImage}
                    />
                  ) : (
                    <span className={styles.avatarInitials}>
                      {getInitials(user.name)}
                    </span>
                  )}
                </div>
                <div className={styles.userInfo}>
                  <span className={styles.userName}>{user.name}</span>
                  <span className={styles.userEmail}>{user.email}</span>
                </div>
              </div>

              {/* Logout Button */}
              <button className={styles.logoutButton} onClick={handleLogout}>
                <FaSignOutAlt className={styles.logoutIcon} />
                <span className={styles.logoutText}>Logout</span>
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className={styles.mobileMenuButton} onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className={styles.mobileMenu}>
          <div className={styles.mobileMenuContent}>
            {/* Mobile User Profile */}
            {user && (
              <div className={styles.mobileUserProfile}>
                <div className={styles.avatar}>
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className={styles.avatarImage}
                    />
                  ) : (
                    <span className={styles.avatarInitials}>
                      {getInitials(user.name)}
                    </span>
                  )}
                </div>
                <div className={styles.userInfo}>
                  <span className={styles.userName}>{user.name}</span>
                  <span className={styles.userEmail}>{user.email}</span>
                </div>
              </div>
            )}

            {/* Mobile Navigation Items */}
            <div className={styles.mobileNavItems}>
              {navItems.map((item) => (
                <button
                  key={item.path}
                  className={`${styles.mobileNavItem} ${
                    item.isActive ? styles.active : ""
                  }`}
                  onClick={() => handleNavigation(item.path)}
                >
                  <item.icon className={styles.navIcon} />
                  <span className={styles.navLabel}>{item.label}</span>
                </button>
              ))}
            </div>

            {/* Mobile Logout */}
            <button
              className={styles.mobileLogoutButton}
              onClick={handleLogout}
            >
              <FaSignOutAlt className={styles.logoutIcon} />
              <span className={styles.logoutText}>Logout</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
