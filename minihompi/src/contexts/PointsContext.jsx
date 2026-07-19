import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient.js'

const PointsContext = createContext(null)

const POINTS_PER_LEVEL = 100

export function levelFromTotal(total) {
  return Math.floor(total / POINTS_PER_LEVEL) + 1
}

const DEFAULT_STATS = { id: 1, level: 1, total_points: 0, current_points: 0 }

export function PointsProvider({ children }) {
  const [stats, setStats] = useState(DEFAULT_STATS)
  const [loading, setLoading] = useState(true)
  const [levelUpFlash, setLevelUpFlash] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      if (!isSupabaseConfigured) {
        setLoading(false)
        return
      }
      const { data, error } = await supabase.from('user_stats').select('*').eq('id', 1).maybeSingle()
      if (cancelled) return
      if (!error && data) {
        setStats(data)
      } else {
        const { data: created } = await supabase.from('user_stats').upsert(DEFAULT_STATS).select().single()
        if (!cancelled && created) setStats(created)
      }
      setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [])

  const award = useCallback(async (amount, reason, source) => {
    if (amount === 0) return
    setStats((prev) => {
      const nextTotal = amount > 0 ? prev.total_points + amount : prev.total_points
      const nextCurrent = Math.max(0, prev.current_points + amount)
      const nextLevel = levelFromTotal(nextTotal)
      if (nextLevel > prev.level) {
        setLevelUpFlash(nextLevel)
      }
      const next = { ...prev, total_points: nextTotal, current_points: nextCurrent, level: nextLevel }
      if (isSupabaseConfigured) {
        supabase.from('user_stats').update({
          total_points: next.total_points,
          current_points: next.current_points,
          level: next.level,
        }).eq('id', 1).then(() => {})
        supabase.from('points_ledger').insert({ delta: amount, reason, source }).then(() => {})
      }
      return next
    })
  }, [])

  const spend = useCallback(async (amount, reason, source) => {
    if (stats.current_points < amount) return false
    await award(-amount, reason, source)
    return true
  }, [award, stats.current_points])

  const clearLevelUpFlash = useCallback(() => setLevelUpFlash(null), [])

  const nextLevelAt = useMemo(() => levelFromTotal(stats.total_points) * POINTS_PER_LEVEL, [stats.total_points])
  const progressInLevel = useMemo(() => stats.total_points % POINTS_PER_LEVEL, [stats.total_points])

  const value = useMemo(() => ({
    stats, loading, award, spend, levelUpFlash, clearLevelUpFlash, nextLevelAt, progressInLevel, POINTS_PER_LEVEL,
  }), [stats, loading, award, spend, levelUpFlash, clearLevelUpFlash, nextLevelAt, progressInLevel])

  return <PointsContext.Provider value={value}>{children}</PointsContext.Provider>
}

export function usePoints() {
  const ctx = useContext(PointsContext)
  if (!ctx) throw new Error('usePoints must be used within PointsProvider')
  return ctx
}
