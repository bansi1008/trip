// pages/api/testConnection.js

import { connectToDatabase } from "../../../lib/mongodb";

export async function GET() {
  try {
    await connectToDatabase();
    return new Response(
      JSON.stringify({ message: "Connected to MongoDB successfully" }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to connect to MongoDB" }),
      { status: 500 }
    );
  }
}
