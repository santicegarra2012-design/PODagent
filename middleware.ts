import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Routes that require authentication
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/api/stripe/checkout(.*)",
  "/api/stripe/portal(.*)",
  "/api/stripe/verify-session(.*)",
  "/api/generate-seo(.*)",
  "/api/generate-image(.*)",
  "/api/optimize-listing(.*)",
  "/api/research-trends(.*)",
  "/api/trademark-check(.*)",
  "/api/save-project(.*)",
  "/api/save-trend(.*)",
  "/api/user/subscription(.*)",
  "/api/dashboard/summary(.*)",
  "/api/projects(.*)",
]);

// Routes that are public
const isPublicRoute = createRouteMatcher([
  "/",
  "/pricing(.*)",
  "/features(.*)",
  "/docs(.*)",
  "/roadmap(.*)",
  "/support(.*)",
  "/changelog(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/stripe/webhook(.*)", // Webhook uses signature verification, not Clerk
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // Redirect unauthenticated users trying to access protected routes
  if (!userId && isProtectedRoute(req)) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("redirect_url", req.url);
    return NextResponse.redirect(signInUrl);
  }

  // Redirect authenticated users away from auth pages
  if (userId && isPublicRoute(req) && req.nextUrl.pathname.startsWith("/sign-")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
