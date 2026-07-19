import { useCallback, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient.js'

export function useMemos() {
  const [memos, setMemos] = useState([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured) { setLoading(false); return }
    setLoading(true)
    const { data } = await supabase.from('memos').select('*').order('created_at')
    setMemos(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { refresh() }, [refresh])

  const createMemo = useCallback(async (color) => {
    if (!isSupabaseConfigured) return null
    const x = 10 + Math.random() * 50
    const y = 10 + Math.random() * 40
    const { data } = await supabase.from('memos').insert({ content: '', color, x, y }).select().single()
    setMemos((prev) => [...prev, data])
    return data
  }, [])

  const updatePosition = useCallback((id, x, y) => {
    setMemos((prev) => prev.map((m) => (m.id === id ? { ...m, x, y } : m)))
    if (isSupabaseConfigured) supabase.from('memos').update({ x, y }).eq('id', id).then(() => {})
  }, [])

  const updateContent = useCallback(async (id, content) => {
    setMemos((prev) => prev.map((m) => (m.id === id ? { ...m, content } : m)))
    if (isSupabaseConfigured) await supabase.from('memos').update({ content }).eq('id', id)
  }, [])

  const deleteMemo = useCallback(async (id) => {
    setMemos((prev) => prev.filter((m) => m.id !== id))
    if (isSupabaseConfigured) await supabase.from('memos').delete().eq('id', id)
  }, [])

  return { memos, loading, createMemo, updatePosition, updateContent, deleteMemo }
}
