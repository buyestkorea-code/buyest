import { useCallback, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient.js'
import { todayKey, toDateKey } from '../utils/dateFormat.js'

export function useMissionLog() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured) { setLoading(false); return }
    setLoading(true)
    const { data } = await supabase.from('missions_log').select('*').order('mission_date', { ascending: false })
    setLogs(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { refresh() }, [refresh])

  const today = todayKey()
  const todayLog = logs.find((l) => l.mission_date === today)

  const completeToday = useCallback(async () => {
    if (!isSupabaseConfigured || todayLog) return null
    const yesterday = toDateKey(new Date(Date.now() - 86400000))
    const yesterdayLog = logs.find((l) => l.mission_date === yesterday)
    const nextStreak = yesterdayLog ? yesterdayLog.streak_count + 1 : 1
    const { data } = await supabase.from('missions_log').insert({
      mission_date: today, streak_count: nextStreak,
    }).select().single()
    await refresh()
    return data
  }, [logs, today, todayLog, refresh])

  return { logs, loading, todayLog, completeToday, streak: todayLog?.streak_count || 0 }
}
