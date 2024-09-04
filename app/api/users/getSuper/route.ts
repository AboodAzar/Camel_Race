import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supervisors = await db.user.findMany({
      where: {
        role: "SUPERVISOR",
      },
    });

    return NextResponse.json(supervisors);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Error fetching users" },
      { status: 500 }
    );
  }
}