export async function GET() {
  try {
    return new Response(
      JSON.stringify({ message: "Logged out successfully" }),
      {
        status: 200,
        headers: {
          "Set-Cookie":
            "token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Strict",
        },
      }
    );
  } catch (error) {
    console.error("Logout error:", error);
    return new Response(JSON.stringify({ error: "Failed to log out" }), {
      status: 500,
    });
  }
}
