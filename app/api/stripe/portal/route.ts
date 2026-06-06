import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Billing unavailable", message: "Billing is not configured for this project." },
    { status: 503 }
  );
}
