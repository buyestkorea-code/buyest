import { useCallback, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient.js'

const DEFAULT_THEME = { id: 1, wallpaper: 'peach', floor: 'wood' }

export function useMiniRoomTheme() {
  const [theme, setTheme] = useState(DEFAULT_THEME)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      if (!isSupabaseConfigured) { setLoading(false); return }
      const { data } = await supabase.from('miniroom_settings').select('*').eq('id', 1).maybeSingle()
      if (!cancelled && data) setTheme(data)
      if (!cancelled) setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [])

  const updateTheme = useCallback(async (patch) => {
    setTheme((prev) => ({ ...prev, ...patch }))
    if (isSupabaseConfigured) {
      await supabase.from('miniroom_settings').update(patch).eq('id', 1)
    }
  }, [])

  return { theme, loading, updateTheme }
}
