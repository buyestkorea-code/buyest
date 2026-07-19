import { useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient.js'
import { todayKey } from '../utils/dateFormat.js'

export function useVisitorCounter() {
  const [today, setToday] = useState(0)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    let cancelled = false
    async function run() {
      if (!isSupabaseConfigured) return

      const dateKey = todayKey()
      const { data: existing } = await supabase.from('visitor_log').select('*').eq('visit_date', dateKey).maybeSingle()

      let todayCount
      if (existing) {
        todayCount = existing.count + 1
        await supabase.from('visitor_log').update({ count: todayCount }).eq('visit_date', dateKey)
      } else {
        todayCount = 1
        await supabase.from('visitor_log').insert({ visit_date: dateKey, count: 1 })
      }

      const { data: allRows } = await supabase.from('visitor_log').select('count')
      const totalCount = (allRows || []).reduce((sum, r) => sum + r.count, 0)

      if (!cancelled) {
        setToday(todayCount)
        setTotal(totalCount)
      }
    }
    run()
    return () => { cancelled = true }
  }, [])

  return { today, total }
}
