import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import Redis from "ioredis";
const redis = new Redis(process.env.REDIS_HOST);

export async function POST(req) {
  try {
    const savedOtp = await redis.get(`otp:${email}`);
    if (!savedOtp) {
      return Response.json(
        { message: "OTP expired or invalid" },
        { status: 400 }
      );
    }
    if (otp !== savedOtp) {
      return Response.json({ message: "Invalid OTP" }, { status: 400 });
    }
    await redis.del(`otp:${email}`);
  } catch (error) {
    return Response.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
