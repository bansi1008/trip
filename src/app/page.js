"use client"; // Required for components using React hooks like useState and event handlers

import React from "react";
import Hero from "./components/Hero";
import Feature from "./components/Feature";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import TravelPersona from "./components/TravelPersona";
import MoodBasedTrips from "./components/MoodBasedTrips";
import SmartItinerary from "./components/SmartItinerary";

export default function Page() {
  return (
    <div className="app">
      <Navbar />
      <Hero />
      <TravelPersona />
      <MoodBasedTrips />
      <SmartItinerary />
      <Feature />
      <Footer />
    </div>
  );
}
