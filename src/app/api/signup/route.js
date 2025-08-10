import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

import nodemailer from "nodemailer";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(req) {
  const { name, email, password, confirmPassword, otp, verifyOtp } =
    await req.json();

  try {
    await connectToDatabase();
    const numericOtp = parseInt(otp, 10);
    if (verifyOtp) {
      const savedOtp = await redis.get(`otp:${email}`);

      if (numericOtp !== savedOtp) {
        console.log("saved otp:", savedOtp);
        console.log("received otp:", numericOtp);
        console.error("OTP does not match");
        return Response.json({ message: "Invalid OTP" }, { status: 404 });
      }

      await redis.del(`otp:${email}`);

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        confirmPassword,
      });

      await newUser.save().catch((error) => {
        console.error("Error saving user:", error);
        return new Response(
          JSON.stringify({ message: "Error creating user" }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      });

      return Response.json(
        { message: "User created successfully" },
        { status: 201 }
      );
    } else {
      // This branch is for initial signup request - send OTP
      if (password !== confirmPassword) {
        return new Response(
          JSON.stringify({ message: "Passwords do not match." }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return new Response(
          JSON.stringify({ message: "Email already registered." }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      const generatedOtp = Math.floor(
        100000 + Math.random() * 900000
      ).toString();
      await redis.set(`otp:${email}`, generatedOtp, { ex: 300 });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your OTP Code",
        text: `Unlock Your Wandermind Journey! Your OTP is ${generatedOtp}. Hurry, it expires in 5 minutes!`,
      });

      return new Response(
        JSON.stringify({ message: "OTP sent to your email." }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    return Response.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
