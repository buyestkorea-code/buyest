import { useCallback, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient.js'

export function useGameProgress(gameKey) {
  const [level, setLevel] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      if (!isSupabaseConfigured) { setLoading(false); return }
      const { data } = await supabase.from('game_progress').select('*').eq('game_key', gameKey).maybeSingle()
      if (!cancelled && data) setLevel(data.level)
      if (!cancelled) setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [gameKey])

  const advanceLevel = useCallback(async () => {
    const next = level + 1
    setLevel(next)
    if (isSupabaseConfigured) {
      await supabase.from('game_progress').upsert({ game_key: gameKey, level: next }, { onConflict: 'game_key' })
    }
  }, [gameKey, level])

  return { level, loading, advanceLevel }
}
