import { useCallback, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient.js'

export function useMiniRoom() {
  const [catalog, setCatalog] = useState([])
  const [inventory, setInventory] = useState([])
  const [layout, setLayout] = useState([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured) { setLoading(false); return }
    setLoading(true)
    const [{ data: cat }, { data: inv }, { data: lay }] = await Promise.all([
      supabase.from('miniroom_catalog').select('*').order('price'),
      supabase.from('miniroom_inventory').select('*, item:miniroom_catalog(*)').order('acquired_at'),
      supabase.from('miniroom_layout').select('*'),
    ])
    setCatalog(cat || [])
    setInventory(inv || [])
    setLayout(lay || [])
    setLoading(false)
  }, [])

  useEffect(() => { refresh() }, [refresh])

  const buyItem = useCallback(async (itemId) => {
    if (!isSupabaseConfigured) return null
    const { data } = await supabase.from('miniroom_inventory').insert({ item_id: itemId }).select('*, item:miniroom_catalog(*)').single()
    await refresh()
    return data
  }, [refresh])

  const placeItem = useCallback(async (inventoryId, x = 50, y = 50) => {
    if (!isSupabaseConfigured) return
    await supabase.from('miniroom_layout').upsert({ inventory_id: inventoryId, x, y }, { onConflict: 'inventory_id' })
    await refresh()
  }, [refresh])

  const updatePosition = useCallback(async (inventoryId, x, y) => {
    if (!isSupabaseConfigured) return
    setLayout((prev) => prev.map((l) => (l.inventory_id === inventoryId ? { ...l, x, y } : l)))
    await supabase.from('miniroom_layout').update({ x, y }).eq('inventory_id', inventoryId)
  }, [])

  const rotateItem = useCallback(async (inventoryId) => {
    if (!isSupabaseConfigured) return
    const current = layout.find((l) => l.inventory_id === inventoryId)
    const nextRotation = ((current?.rotation || 0) + 45) % 360
    setLayout((prev) => prev.map((l) => (l.inventory_id === inventoryId ? { ...l, rotation: nextRotation } : l)))
    await supabase.from('miniroom_layout').update({ rotation: nextRotation }).eq('inventory_id', inventoryId)
  }, [layout])

  const bringToFront = useCallback(async (inventoryId) => {
    if (!isSupabaseConfigured) return
    const maxZ = Math.max(0, ...layout.map((l) => l.z_index || 0))
    const nextZ = maxZ + 1
    setLayout((prev) => prev.map((l) => (l.inventory_id === inventoryId ? { ...l, z_index: nextZ } : l)))
    await supabase.from('miniroom_layout').update({ z_index: nextZ }).eq('inventory_id', inventoryId)
  }, [layout])

  const sendToBack = useCallback(async (inventoryId) => {
    if (!isSupabaseConfigured) return
    const minZ = Math.min(0, ...layout.map((l) => l.z_index || 0))
    const nextZ = minZ - 1
    setLayout((prev) => prev.map((l) => (l.inventory_id === inventoryId ? { ...l, z_index: nextZ } : l)))
    await supabase.from('miniroom_layout').update({ z_index: nextZ }).eq('inventory_id', inventoryId)
  }, [layout])

  const removeFromRoom = useCallback(async (inventoryId) => {
    if (!isSupabaseConfigured) return
    await supabase.from('miniroom_layout').delete().eq('inventory_id', inventoryId)
    await refresh()
  }, [refresh])

  const placedIds = new Set(layout.map((l) => l.inventory_id))
  const storageItems = inventory.filter((inv) => !placedIds.has(inv.id))
  const placedItems = layout.map((l) => ({ ...l, inventory: inventory.find((inv) => inv.id === l.inventory_id) })).filter((l) => l.inventory)

  return { catalog, inventory, layout, loading, buyItem, placeItem, updatePosition, rotateItem, bringToFront, sendToBack, removeFromRoom, storageItems, placedItems }
}
