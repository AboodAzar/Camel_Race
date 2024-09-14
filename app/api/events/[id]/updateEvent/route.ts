import { updateEvent } from '@/Actions/updateEvent';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/');
  const idString = pathParts[pathParts.length - 2];

  console.log('Extracted ID:', idString);

  if (!idString) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const body = await request.json();

    console.log('Request Body:', body); // Log the body

    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json({ error: "Empty payload" }, { status: 400 });
    }

    await updateEvent(idString, body);

    return NextResponse.json({ message: "Event updated successfully" });
  } catch (error) {
    console.error("Error updating event:", error);

    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}