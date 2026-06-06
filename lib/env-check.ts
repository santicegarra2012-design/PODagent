type EnvVar = {
  name: AllowedEnvName;
  required: boolean;
  description: string;
};

type AllowedEnvName =
  | "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"
  | "CLERK_SECRET_KEY"
  | "NEXT_PUBLIC_SUPABASE_URL"
  | "NEXT_PUBLIC_SUPABASE_ANON_KEY"
  | "SUPABASE_SERVICE_ROLE_KEY"
  | "OPENAI_API_KEY"
  | "NEXT_PUBLIC_CLERK_SIGN_IN_URL"
  | "NEXT_PUBLIC_CLERK_SIGN_UP_URL"
  | "NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL"
  | "NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL";

const CRITICAL_ENV_VARS: EnvVar[] = [
  { name: "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", required: true, description: "Clerk publishable key" },
  { name: "CLERK_SECRET_KEY", required: true, description: "Clerk secret key for server authentication" },
  { name: "NEXT_PUBLIC_SUPABASE_URL", required: true, description: "Supabase project URL" },
  { name: "NEXT_PUBLIC_SUPABASE_ANON_KEY", required: true, description: "Supabase anonymous key" },
  { name: "SUPABASE_SERVICE_ROLE_KEY", required: true, description: "Supabase service role key for admin operations" },
  { name: "OPENAI_API_KEY", required: true, description: "OpenAI API key for AI features" },
  { name: "NEXT_PUBLIC_CLERK_SIGN_IN_URL", required: true, description: "Clerk sign-in URL" },
  { name: "NEXT_PUBLIC_CLERK_SIGN_UP_URL", required: true, description: "Clerk sign-up URL" },
  { name: "NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL", required: true, description: "Clerk sign-in redirect URL" },
  { name: "NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL", required: true, description: "Clerk sign-up redirect URL" },
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
    console.error("MISSING REQUIRED ENVIRONMENT VARIABLES:");
    result.missing.forEach((name) => {
      console.error(`   - ${name}: ${CRITICAL_ENV_VARS.find((envVar) => envVar.name === name)?.description || ""}`);
    });
  }

  if (result.warnings.length > 0) {
    console.warn("OPTIONAL ENVIRONMENT VARIABLES NOT SET:");
    result.warnings.forEach((name) => {
      console.warn(`   - ${name}: ${CRITICAL_ENV_VARS.find((envVar) => envVar.name === name)?.description || ""}`);
    });
  }

  if (result.allPassed && result.warnings.length === 0) {
    console.log("All environment variables are configured.");
  }
}

export function getRequiredEnv(name: AllowedEnvName): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. ` +
      "Check your .env.local or Vercel environment variables."
    );
  }
  return value;
}
