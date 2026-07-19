import { useCallback, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient.js'

export function useDiaryEntries() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }
    setLoading(true)
    const { data } = await supabase.from('diary_entries').select('*').order('entry_date', { ascending: false })
    setEntries(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { refresh() }, [refresh])

  const upsertEntry = useCallback(async (entryDate, fields) => {
    if (!isSupabaseConfigured) return null
    const { data, error } = await supabase
      .from('diary_entries')
      .upsert({ entry_date: entryDate, ...fields, updated_at: new Date().toISOString() }, { onConflict: 'entry_date' })
      .select()
      .single()
    if (!error) await refresh()
    return data
  }, [refresh])

  const deleteEntry = useCallback(async (id) => {
    if (!isSupabaseConfigured) return
    await supabase.from('diary_entries').delete().eq('id', id)
    await refresh()
  }, [refresh])

  return { entries, loading, refresh, upsertEntry, deleteEntry }
}
