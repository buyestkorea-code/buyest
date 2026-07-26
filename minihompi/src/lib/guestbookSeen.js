import { supabase, isSupabaseConfigured } from './supabaseClient.js'

export async function markGuestbookSeen() {
  if (!isSupabaseConfigured) return
  await supabase.from('profile').update({ guestbook_seen_at: new Date().toISOString() }).eq('id', 1)
}
