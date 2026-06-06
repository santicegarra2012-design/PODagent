import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { verified: false, error: "Billing is not configured for this project." },
    { status: 503 }
  );
}
