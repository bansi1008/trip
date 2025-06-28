// lib/amadeusToken.js
let tokenCache = {
  access_token: null,
  expires_at: null,
};

export async function getAmadeusToken() {
  const now = Math.floor(Date.now() / 1000);

  if (tokenCache.access_token && tokenCache.expires_at > now) {
    return tokenCache.access_token;
  }

  const res = await fetch(
    "https://test.api.amadeus.com/v1/security/oauth2/token",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.AMADEUS_CLIENT_ID,
        client_secret: process.env.AMADEUS_CLIENT_SECRET,
      }),
    }
  );

  const data = await res.json();
  tokenCache.access_token = data.access_token;
  tokenCache.expires_at = now + data.expires_in - 60;
  return data.access_token;
}
