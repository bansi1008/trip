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

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return new Response(JSON.stringify({ message: "wrong password" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    const token = generateToken(user);
    const cookieOptions = [
      `token=${token}`,
      `HttpOnly`,
      `Path=/`,
      `Max-Age=${60 * 60 * 24 * 7}`, // 7 days
      `SameSite=Lax`,
      process.env.NODE_ENV === "production" ? `Secure` : "",
    ]
      .filter(Boolean)
      .join("; ");
    return new Response(JSON.stringify({ message: "login successfull" }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": cookieOptions,
      },
    });
  } catch (error) {
    return Response.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
