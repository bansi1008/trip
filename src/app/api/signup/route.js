import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import Redis from "ioredis";
import nodemailer from "nodemailer";

const redis = new Redis(
  "rediss://default:ATu4AAIjcDFjY2I2NTJmMDViYTk0ZjJhOGI3ZjJhYmM4MjYzZTg1YXAxMA@busy-grubworm-15288.upstash.io:6379"
); // Adjust config if needed

// Setup nodemailer (use your SMTP/email provider details)
const transporter = nodemailer.createTransport({
  service: "Gmail", // or other service
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

    if (verifyOtp) {
      // This branch is for OTP verification step
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

      // OTP is valid, delete it from Redis and create user
      await redis.del(`otp:${email}`);

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        confirmPassword: hashedPassword,
      });

      await newUser.save();

      return Response.json(
        { message: "User created successfully" },
        { status: 201 }
      );
    } else {
      // This branch is for initial signup request - send OTP
      if (password !== confirmPassword) {
        return Response.json(
          { message: "Passwords do not match." },
          { status: 400 }
        );
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return Response.json(
          { message: "Email already registered." },
          { status: 400 }
        );
      }

      // Generate OTP and save in Redis for 5 minutes
      const generatedOtp = Math.floor(
        100000 + Math.random() * 900000
      ).toString();
      await redis.set(`otp:${email}`, generatedOtp, "EX", 300); // 300s = 5min

      // Send OTP via email
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP code is: ${generatedOtp}. It expires in 5 minutes.`,
      });

      return Response.json(
        { message: "OTP sent to your email." },
        { status: 200 }
      );
    }
  } catch (error) {
    return Response.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
