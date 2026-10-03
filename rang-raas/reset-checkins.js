const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function resetCheckins() {
  console.log("DELETING ALL CHECKINS...");
  // Neq id 0 is a hack to delete all rows. Assuming id is int or uuid, let's use a known invalid uuid or just 'is not null'.
  const { data, error } = await supabase.from('checkins').delete().not('ticket_id', 'is', null);
  
  if (error) {
    console.error("Error deleting checkins:", error);
  } else {
    console.log("Successfully deleted all checkins.");
  }
}

resetCheckins();
