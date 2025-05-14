import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  const { name, email, password, confirmPassword } = await req.json();

  try {
    await connectToDatabase();

    // Check if passwords match in the route
    if (password !== confirmPassword) {
      return Response.json(
        { message: "Password and confirm password do not match." },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json(
        { message: "Email already exists" },
        { status: 400 }
      );
    }

    const newUser = new User({
      name,
      email,
      password,
      confirmPassword,
    });

    await newUser.save();

    return Response.json(
      { message: "User created", userId: newUser._id },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
