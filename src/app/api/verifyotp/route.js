import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

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
