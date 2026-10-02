import { useCallback, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient.js'

export function useEncyclopedia() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured) { setLoading(false); return }
    setLoading(true)
    const { data } = await supabase.from('encyclopedia_entries').select('*').order('category').order('entry_no')
    setEntries(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { refresh() }, [refresh])

  const addEntry = useCallback(async (category, name, details, doodlePath) => {
    if (!isSupabaseConfigured) return null
    const sameCategory = entries.filter((e) => e.category === category)
    const nextNo = sameCategory.length > 0 ? Math.max(...sameCategory.map((e) => e.entry_no)) + 1 : 1
    const { data } = await supabase
      .from('encyclopedia_entries')
      .insert({ category, entry_no: nextNo, name, details, doodle_path: doodlePath })
      .select()
      .single()
    setEntries((prev) => [...prev, data])
    return data
  }, [entries])

  const deleteEntry = useCallback(async (id) => {
    setEntries((prev) => prev.filter((e) => e.id !== id))
    if (isSupabaseConfigured) await supabase.from('encyclopedia_entries').delete().eq('id', id)
  }, [])

  return { entries, loading, addEntry, deleteEntry }
}
