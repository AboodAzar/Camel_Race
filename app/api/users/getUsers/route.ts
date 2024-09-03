import { db } from "@/lib/db"; 
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const users = await db.user.findMany({
      where: {
        role: "USER",
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Error fetching users" }, { status: 500 });
  }
}
