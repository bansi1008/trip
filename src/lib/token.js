import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET; // Store securely in .env

export function generateToken(user) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}
