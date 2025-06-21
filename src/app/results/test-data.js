// Test data based on your API response example
export const sampleTripData = {
  itinerary: {
    day1: {
      morning: [
        {
          activityName: "Shikara Ride on Dal Lake",
          activitydescription:
            "Enjoy a romantic Shikara ride on the serene Dal Lake, gliding past floating gardens and charming houseboats. 🚣‍♀️",
          price: "$20",
          notes: "Bargain for a better price! Aim for a 2-hour ride.",
        },
      ],
      afternoon: [
        {
          activityName: "Mughal Gardens Visit (Shalimar Bagh)",
          activitydescription:
            "Explore Shalimar Bagh, a beautiful Mughal garden with terraced lawns, fountains, and vibrant flowers. Take beautiful photos here.",
          price: "$5",
          notes: "Entry fee per person. Wear comfortable shoes for walking.",
        },
      ],
      evening: [
        {
          activityName: "Shopping at Lal Chowk",
          activitydescription:
            "Experience the hustle and bustle of Lal Chowk, Srinagar's main commercial hub. Shop for Pashmina shawls, Kashmiri carpets, and local handicrafts. 🛍️",
          price: "$100",
          notes: "Bargaining is essential! Allocate a budget for souvenirs.",
        },
      ],
      night: [
        {
          activityName: "Dinner at Ahdoos Restaurant",
          activitydescription:
            "Indulge in a traditional Kashmiri Wazwan feast at Ahdoos Restaurant. Try the Rogan Josh and Yakhni. 😋",
          price: "$30",
          notes:
            "Make a reservation in advance, especially during peak season.",
        },
      ],
    },
  },
  hotel: [
    {
      hotelName: "Hotel Grand Mahal",
      distanceFromCenterInKm: 3.5,
      pricePerNight: "₹14000",
      rating: 4.2,
      address: "Boulevard Road, Srinagar, Kashmir",
    },
    {
      hotelName: "The Heritage by Heevan",
      distanceFromCenterInKm: 4,
      pricePerNight: "₹13500",
      rating: 4,
      address: "Gupkar Road, Srinagar, Kashmir",
    },
    {
      hotelName: "WelcomHeritage Gurkha Houseboats",
      distanceFromCenterInKm: 5,
      pricePerNight: "₹12800",
      rating: 4.5,
      address: "Nigeen Lake, Srinagar, Kashmir",
    },
  ],
};

// Function to set test data in sessionStorage
export const setTestData = () => {
  sessionStorage.setItem("tripData", JSON.stringify(sampleTripData));
  console.log("Test data set in sessionStorage");
};

// Function to clear test data
export const clearTestData = () => {
  sessionStorage.removeItem("tripData");
  console.log("Test data cleared from sessionStorage");
};
