import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

/** `null` until `.env` is filled in: the app then runs on the sample data. */
export function supabase(): SupabaseClient | null {
  const { supabaseUrl, supabaseKey } = useRuntimeConfig().public;
  if (!supabaseUrl || !supabaseKey) return null;
  client ??= createClient(supabaseUrl, supabaseKey);
  return client;
}

export const usingMocks = () => !supabase();
