import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateToken } from "@/lib/token";

export async function POST(req) {
  const { email, password } = await req.json();

  try {
    await connectToDatabase();

    const user = await User.findOne({ email });
    if (!user) {
      return Response.json(
        {
          message: "you don't have any account with us feel free to create one",
        },
        { status: 400 }
      );
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return Response.json({ message: "Invalid credentials" }, { status: 400 });
    }
    const token = generateToken(user);
    return Response.json(
      {
        message: "Login successful",
        token,
        userId: user._id,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
