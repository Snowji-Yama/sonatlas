import type { Session } from '@supabase/supabase-js'

// ponytail: a single subscription for the whole life of the SPA, hence the
// module-level flag rather than a dedicated plugin.
let subscribed = false

export function useAuth() {
  const session = useState<Session | null>('auth:session', () => null)
  // Without this flag, the add screen shows the sign-in form for as long as
  // getSession() takes to answer, even when we are already signed in.
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
   * `shouldCreateUser: false` is the line that protects everything: without it,
   * this form would be enough for anyone to create an account and therefore get
   * write access.
   */
  async function sendLink(email: string) {
    if (!client) throw new Error('Supabase not configured')
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
