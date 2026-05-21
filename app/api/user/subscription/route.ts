import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getSubscription } from "@/lib/subscription";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const subscription = await getSubscription();

    return NextResponse.json(subscription || { plan: "free", status: "inactive" });
  } catch (error) {
    console.error("[user-subscription] Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
