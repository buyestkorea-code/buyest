import { useCallback, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient.js'
import { uploadToBucket } from '../lib/storage.js'
import { resizePhoto } from '../utils/imageResize.js'

export function usePhotos(albumId) {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured || !albumId) { setLoading(false); return }
    setLoading(true)
    const { data } = await supabase.from('photos').select('*').eq('album_id', albumId).order('created_at', { ascending: false })
    setPhotos(data || [])
    setLoading(false)
  }, [albumId])

  useEffect(() => { refresh() }, [refresh])

  const uploadPhoto = useCallback(async (file) => {
    if (!isSupabaseConfigured || !albumId) return null
    const { full, thumb } = await resizePhoto(file)
    const stamp = Date.now()
    const fullPath = `${albumId}/${stamp}-full.jpg`
    const thumbPath = `${albumId}/${stamp}-thumb.jpg`
    await uploadToBucket('photos', fullPath, full)
    await uploadToBucket('photos', thumbPath, thumb)
    const { data } = await supabase.from('photos').insert({
      album_id: albumId, storage_path: fullPath, thumb_path: thumbPath, caption: '',
    }).select().single()
    await refresh()
    return data
  }, [albumId, refresh])

  const updateCaption = useCallback(async (photoId, caption) => {
    if (!isSupabaseConfigured) return
    await supabase.from('photos').update({ caption }).eq('id', photoId)
    await refresh()
  }, [refresh])

  const deletePhoto = useCallback(async (photoId) => {
    if (!isSupabaseConfigured) return
    await supabase.from('photos').delete().eq('id', photoId)
    await refresh()
  }, [refresh])

  return { photos, loading, uploadPhoto, updateCaption, deletePhoto }
}
