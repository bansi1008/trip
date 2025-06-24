import "../styles/main.css";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/next";

export const metadata = {
  title: "AI Travel - Your Perfect Trip, AI-Powered",
  description:
    "Discover personalized travel experiences tailored to your mood, style, and preferences. Let our intelligent AI create unforgettable journeys just for you.",
  keywords:
    "AI travel, personalized trips, travel planning, smart itinerary, mood-based travel",
  author: "AI Travel Team",
  //viewport: "width=device-width, initial-scale=1",
};
export const viewport = "width=device-width, initial-scale=1";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Analytics />
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}
