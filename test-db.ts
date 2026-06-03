import { supabase } from "./src/integrations/supabase/client";

async function testFetch() {
  console.log("Starting test fetch...");
  try {
    const [catsRes, symsRes] = await Promise.all([
      supabase
        .from("cms_symbol_categories")
        .select("*")
        .order("order_index", { ascending: true }),
      supabase
        .from("cms_symbols")
        .select("*")
        .order("order_index", { ascending: true }),
    ]);

    console.log("Categories response:", { 
      error: catsRes.error, 
      count: catsRes.data?.length 
    });
    console.log("Symbols response:", { 
      error: symsRes.error, 
      count: symsRes.data?.length 
    });
  } catch (err) {
    console.error("Fetch caught error:", err);
  }
}

testFetch();
