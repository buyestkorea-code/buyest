import { supabase } from './supabaseClient.js'

export async function uploadToBucket(bucket, path, blobOrFile, contentType = 'image/jpeg') {
  const { error } = await supabase.storage.from(bucket).upload(path, blobOrFile, {
    contentType,
    upsert: true,
  })
  if (error) throw error
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

export function publicUrl(bucket, path) {
  if (!path) return null
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}
