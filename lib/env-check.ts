/**
 * Environment variable validation helper.
 * Call at startup to verify critical env vars are configured.
 */

type EnvVar = {
  name: string;
  required: boolean;
  description: string;
};

const CRITICAL_ENV_VARS: EnvVar[] = [
  { name: "STRIPE_SECRET_KEY", required: true, description: "Stripe secret key for API operations" },
  { name: "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", required: true, description: "Stripe publishable key for frontend" },
  { name: "STRIPE_WEBHOOK_SECRET", required: true, description: "Stripe webhook signing secret" },
  { name: "NEXT_PUBLIC_APP_URL", required: true, description: "App URL for redirects and webhooks" },
  { name: "NEXT_PUBLIC_SUPABASE_URL", required: true, description: "Supabase project URL" },
  { name: "NEXT_PUBLIC_SUPABASE_ANON_KEY", required: true, description: "Supabase anonymous key" },
  { name: "SUPABASE_SERVICE_ROLE_KEY", required: true, description: "Supabase service role key for admin operations" },
  { name: "NEXT_PUBLIC_STRIPE_PRO_PRICE_ID", required: false, description: "Stripe price ID for Pro plan" },
  { name: "NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID", required: false, description: "Stripe price ID for Premium plan" },
  { name: "CLERK_SECRET_KEY", required: true, description: "Clerk secret key for API operations" },
  { name: "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", required: true, description: "Clerk publishable key" },
  { name: "GROQ_API_KEY", required: false, description: "Groq API key for AI features" },
  { name: "FAL_KEY", required: false, description: "FAL AI key for image generation" },
];

type EnvCheckResult = {
  allPassed: boolean;
  missing: string[];
  warnings: string[];
  details: { name: string; status: "ok" | "missing" | "warning" }[];
};

export function checkEnvVars(): EnvCheckResult {
  const missing: string[] = [];
  const warnings: string[] = [];
  const details: { name: string; status: "ok" | "missing" | "warning" }[] = [];

  for (const envVar of CRITICAL_ENV_VARS) {
    const value = process.env[envVar.name];
    if (!value) {
      if (envVar.required) {
        missing.push(envVar.name);
        details.push({ name: envVar.name, status: "missing" });
      } else {
        warnings.push(envVar.name);
        details.push({ name: envVar.name, status: "warning" });
      }
    } else {
      details.push({ name: envVar.name, status: "ok" });
    }
  }

  return {
    allPassed: missing.length === 0,
    missing,
    warnings,
    details,
  };
}

export function logEnvStatus(): void {
  const result = checkEnvVars();

  if (!result.allPassed) {
    console.error("❌ MISSING REQUIRED ENVIRONMENT VARIABLES:");
    result.missing.forEach((name) => {
      console.error(`   - ${name}: ${CRITICAL_ENV_VARS.find((v) => v.name === name)?.description || ""}`);
    });
  }

  if (result.warnings.length > 0) {
    console.warn("⚠️  OPTIONAL ENVIRONMENT VARIABLES NOT SET:");
    result.warnings.forEach((name) => {
      console.warn(`   - ${name}: ${CRITICAL_ENV_VARS.find((v) => v.name === name)?.description || ""}`);
    });
  }

  if (result.allPassed && result.warnings.length === 0) {
    console.log("✅ All environment variables are configured.");
  }
}

/**
 * Get a required environment variable or throw a descriptive error.
 */
export function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. ` +
      `Check your .env.local or Vercel environment variables.`
    );
  }
  return value;
}
