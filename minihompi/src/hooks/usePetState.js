import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient.js'

const DECAY_PER_HOUR = { hunger: 8, cleanliness: 6, happiness: 5 }
const STAGE_THRESHOLDS = { hatchling: 5, grown: 20 }

function clamp(n) {
  return Math.max(0, Math.min(100, Math.round(n)))
}

function stageForCareCount(count) {
  if (count >= STAGE_THRESHOLDS.grown) return 'grown'
  if (count >= STAGE_THRESHOLDS.hatchling) return 'hatchling'
  return 'egg'
}

function applyDecay(state) {
  const elapsedHours = (Date.now() - new Date(state.last_tick_at).getTime()) / 3_600_000
  return {
    ...state,
    hunger: clamp(state.hunger - DECAY_PER_HOUR.hunger * elapsedHours),
    cleanliness: clamp(state.cleanliness - DECAY_PER_HOUR.cleanliness * elapsedHours),
    happiness: clamp(state.happiness - DECAY_PER_HOUR.happiness * elapsedHours),
  }
}

const DEFAULT_STATE = { id: 1, stage: 'egg', hunger: 80, cleanliness: 80, happiness: 80, care_count: 0, equipped_outfit_id: null, last_tick_at: new Date().toISOString() }

export function usePetState() {
  const [rawState, setRawState] = useState(DEFAULT_STATE)
  const [catalog, setCatalog] = useState([])
  const [inventory, setInventory] = useState([])
  const [loading, setLoading] = useState(true)
  const [, forceTick] = useState(0)

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured) { setLoading(false); return }
    setLoading(true)
    const [{ data: pet }, { data: cat }, { data: inv }] = await Promise.all([
      supabase.from('pet_state').select('*').eq('id', 1).maybeSingle(),
      supabase.from('pet_catalog').select('*').order('price'),
      supabase.from('pet_inventory').select('*, item:pet_catalog(*)').order('acquired_at'),
    ])
    if (pet) setRawState(pet)
    setCatalog(cat || [])
    setInventory(inv || [])
    setLoading(false)
  }, [])

  useEffect(() => { refresh() }, [refresh])

  useEffect(() => {
    const t = setInterval(() => forceTick((n) => n + 1), 15000)
    return () => clearInterval(t)
  }, [])

  const liveState = useMemo(() => applyDecay(rawState), [rawState])

  const persist = useCallback(async (patch) => {
    const next = { ...liveState, ...patch, last_tick_at: new Date().toISOString() }
    setRawState(next)
    if (isSupabaseConfigured) {
      await supabase.from('pet_state').update({
        stage: next.stage, hunger: next.hunger, cleanliness: next.cleanliness,
        happiness: next.happiness, care_count: next.care_count, equipped_outfit_id: next.equipped_outfit_id,
        last_tick_at: next.last_tick_at,
      }).eq('id', 1)
    }
  }, [liveState])

  const buyItem = useCallback(async (item) => {
    if (!isSupabaseConfigured) return
    const { data } = await supabase.from('pet_inventory').insert({ item_id: item.id, quantity: item.type === 'outfit' ? 1 : 1 }).select('*, item:pet_catalog(*)').single()
    setInventory((prev) => [...prev, data])
  }, [])

  const useItem = useCallback(async (invItem) => {
    const effect = invItem.item?.effect || {}
    const nextCareCount = liveState.care_count + 1
    await persist({
      hunger: clamp(liveState.hunger + (effect.hunger || 0)),
      cleanliness: clamp(liveState.cleanliness + (effect.cleanliness || 0)),
      happiness: clamp(liveState.happiness + (effect.happiness || 0)),
      care_count: nextCareCount,
      stage: stageForCareCount(nextCareCount),
    })
    if (invItem.item?.type !== 'outfit' && isSupabaseConfigured) {
      if (invItem.quantity <= 1) {
        await supabase.from('pet_inventory').delete().eq('id', invItem.id)
        setInventory((prev) => prev.filter((i) => i.id !== invItem.id))
      } else {
        await supabase.from('pet_inventory').update({ quantity: invItem.quantity - 1 }).eq('id', invItem.id)
        setInventory((prev) => prev.map((i) => (i.id === invItem.id ? { ...i, quantity: i.quantity - 1 } : i)))
      }
    }
  }, [liveState, persist])

  const equipOutfit = useCallback(async (invItem) => {
    await persist({ equipped_outfit_id: invItem ? invItem.item_id : null })
  }, [persist])

  return { state: liveState, loading, catalog, inventory, buyItem, useItem, equipOutfit }
}
