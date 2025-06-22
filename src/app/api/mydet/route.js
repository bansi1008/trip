import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { authenticateRequest } from "../../../lib/authMiddleware";

import { NextResponse } from "next/server";

export async function GET(req) {
  const user = await authenticateRequest(req);
  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }
  try {
    await connectToDatabase();

    const users = await User.findById(user.id, {
      password: 0,
      confirmPassword: 0,
    });

    return new Response(JSON.stringify(users), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
