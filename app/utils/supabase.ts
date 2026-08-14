import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// ponytail: client brut plutôt que @nuxtjs/supabase — on n'utilise que la table
// et le magic link, pas les middlewares de redirection du module.
let client: SupabaseClient | null = null

/** `null` tant que le `.env` n'est pas rempli : l'app tourne alors sur le jeu d'essai. */
export function supabase(): SupabaseClient | null {
  const { supabaseUrl, supabaseKey } = useRuntimeConfig().public
  if (!supabaseUrl || !supabaseKey) return null
  client ??= createClient(supabaseUrl, supabaseKey)
  return client
}

/** Vrai tant que le `.env` n'est pas rempli : les écrans affichent alors le jeu d'essai. */
export const usingMocks = () => !supabase()
