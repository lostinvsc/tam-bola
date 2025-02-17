import { NextResponse } from "next/server";


export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    const adminU = process.env.ADMIN_U;
    const adminP = process.env.ADMIN_P;
    const secretKey = process.env.SECRET_KEY || "default-secret-key";

    // Check username & password
    if (adminU === username && adminP === password) {
      // Generate JWT Token
      const token = "tambolawithme"

      return NextResponse.json({ message: "Valid credentials",token }, { status: 200 });
    }

    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: `Internal server error `, }, { status: 500 });
  }
}
