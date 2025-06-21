import { jwtVerify } from "jose";

export async function authenticateRequest(req) {
  const cookie = req.headers.get("cookie"); // in Next.js edge/api routes use req.headers.get()
  if (!cookie) return null;

  // Parse token from cookie string (e.g., "token=abc123; othercookie=xyz")
  const tokenMatch = cookie.match(/token=([^;]+)/);
  if (!tokenMatch) return null;

  const token = tokenMatch[1];

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    console.error("JWT verification failed:", error.message);
    return null;
  }
}
