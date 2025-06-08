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
      return new Response(
        JSON.stringify({ message: "you don't have account with us" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const storedHash =
      "$2b$08$Ev7GQDgvvfwp0f85V1eYweLjY4GKCM56HkrgR./Kb10AE7bArpdaC";
    const testPassword = "fakePassword123";

    bcrypt.compare(testPassword, storedHash).then((isMatch) => {
      console.log("Password matches?", isMatch);
    });
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return new Response(JSON.stringify({ message: "wrong password" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    const token = generateToken(user);
    return new Response(JSON.stringify({ message: "login success full" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return Response.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
