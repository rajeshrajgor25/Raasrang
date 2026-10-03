import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkSchema() {
  const { data, error } = await supabase.from("tickets").select("*").limit(1);
  console.log("Error:", error);
  console.log("Data keys:", data && data.length > 0 ? Object.keys(data[0]) : "No data");
}

checkSchema();
