import { useCallback, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient.js'

export function usePlanner() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured) { setLoading(false); return }
    setLoading(true)
    const { data } = await supabase.from('planner_items').select('*').order('item_date').order('created_at')
    setItems(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { refresh() }, [refresh])

  const addItem = useCallback(async (title, itemDate, category) => {
    if (!isSupabaseConfigured) return null
    const { data } = await supabase.from('planner_items').insert({ title, item_date: itemDate, category }).select().single()
    setItems((prev) => [...prev, data].sort((a, b) => a.item_date.localeCompare(b.item_date)))
    return data
  }, [])

  const toggleDone = useCallback(async (id, done) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, done } : it)))
    if (isSupabaseConfigured) await supabase.from('planner_items').update({ done }).eq('id', id)
  }, [])

  const deleteItem = useCallback(async (id) => {
    setItems((prev) => prev.filter((it) => it.id !== id))
    if (isSupabaseConfigured) await supabase.from('planner_items').delete().eq('id', id)
  }, [])

  return { items, loading, addItem, toggleDone, deleteItem }
}
