import { useCallback, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient.js'

export function useAlbums() {
  const [albums, setAlbums] = useState([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured) { setLoading(false); return }
    setLoading(true)
    const { data } = await supabase.from('albums').select('*').order('created_at', { ascending: false })
    setAlbums(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { refresh() }, [refresh])

  const createAlbum = useCallback(async (name) => {
    if (!isSupabaseConfigured) return null
    const { data } = await supabase.from('albums').insert({ name }).select().single()
    await refresh()
    return data
  }, [refresh])

  const deleteAlbum = useCallback(async (id) => {
    if (!isSupabaseConfigured) return
    await supabase.from('albums').delete().eq('id', id)
    await refresh()
  }, [refresh])

  return { albums, loading, createAlbum, deleteAlbum, refresh }
}
