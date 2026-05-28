import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { generatePricingRecommendation } from "@/lib/pricing/engine";
import type { PricingProductInput } from "@/lib/pricing/types";

export const runtime = "nodejs";

function isPricingInput(value: unknown): value is PricingProductInput {
  if (!value || typeof value !== "object") return false;
  const input = value as Partial<PricingProductInput>;

  return (
    typeof input.marketplace === "string" &&
    typeof input.productType === "string" &&
    typeof input.niche === "string" &&
    typeof input.currentPrice === "number" &&
    typeof input.productionCost === "number" &&
    typeof input.shippingCost === "number" &&
    typeof input.reviewCount === "number" &&
    typeof input.rating === "number" &&
    Array.isArray(input.historicalSales) &&
    Array.isArray(input.competitorPrices) &&
    Array.isArray(input.trendSignals)
  );
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    if (!isPricingInput(body)) {
      return NextResponse.json({ error: "Invalid pricing payload" }, { status: 400 });
    }

    return NextResponse.json(generatePricingRecommendation(body));
  } catch (error) {
    console.error("[pricing-recommendation] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
