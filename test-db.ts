import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function test() {
  const tables = ["profiles", "memories", "tasks", "opportunities", "conversations", "designs"];
  
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select("*").limit(1);
    if (error) {
      console.log(`[ERROR] Table ${table}:`, error.message);
    } else {
      console.log(`[OK] Table ${table}: ${data.length} rows found.`);
    }
  }
}

test();
