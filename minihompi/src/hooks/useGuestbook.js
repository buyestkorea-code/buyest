import { useCallback, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient.js'

export function useGuestbook() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured) { setLoading(false); return }
    setLoading(true)
    const { data } = await supabase.from('guestbook').select('*').order('created_at', { ascending: false })
    setEntries(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { refresh() }, [refresh])

  const addEntry = useCallback(async (authorName, message) => {
    if (!isSupabaseConfigured) return
    await supabase.from('guestbook').insert({ author_name: authorName, message })
    await refresh()
  }, [refresh])

  const deleteEntry = useCallback(async (id) => {
    if (!isSupabaseConfigured) return
    await supabase.from('guestbook').delete().eq('id', id)
    await refresh()
  }, [refresh])

  return { entries, loading, addEntry, deleteEntry }
}
