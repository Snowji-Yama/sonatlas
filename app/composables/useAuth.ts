import type { Session } from '@supabase/supabase-js'

// ponytail: un seul abonnement pour toute la vie de la SPA, d'où le drapeau
// au niveau du module plutôt qu'un plugin dédié.
let subscribed = false

export function useAuth() {
  const session = useState<Session | null>('auth:session', () => null)
  // Sans ce drapeau, l'écran d'ajout affiche la connexion pendant le temps
  // que met getSession() à répondre, même quand on est déjà identifié.
  const ready = useState('auth:ready', () => false)
  const client = supabase()

  if (!client) {
    ready.value = true
  } else if (!subscribed) {
    subscribed = true
    client.auth.getSession().then(({ data }) => {
      session.value = data.session
      ready.value = true
    })
    client.auth.onAuthStateChange((_event, s) => { session.value = s })
  }

  /**
   * `shouldCreateUser: false` est la ligne qui protège tout : sans elle, ce
   * formulaire suffirait à n'importe qui pour se créer un compte et donc
   * obtenir le droit d'écrire.
   */
  async function sendLink(email: string) {
    if (!client) throw new Error('Supabase non configuré')
    const { error } = await client.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
        emailRedirectTo: `${window.location.origin}/new`,
      },
    })
    if (error) throw new Error(error.message)
  }

  async function signOut() {
    await client?.auth.signOut()
  }

  return { session, ready, sendLink, signOut, enabled: !!client }
}
