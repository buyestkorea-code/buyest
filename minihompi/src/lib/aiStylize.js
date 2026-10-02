import { supabase, isSupabaseConfigured } from './supabaseClient.js'

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      resolve(typeof result === 'string' ? result.split(',')[1] : '')
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// AI(Gemini)로 사진을 도감 삽화 스타일로 다시 그려줌. Edge Function 또는 키가 없으면 에러를 던짐
export async function aiStylizeEncyclopediaPhoto(file, name) {
  if (!isSupabaseConfigured) throw new Error('supabase not configured')
  const base64 = await fileToBase64(file)
  const { data, error } = await supabase.functions.invoke('stylize-photo', {
    body: { image: base64, mimeType: file.type || 'image/png', name },
  })
  if (error) throw error
  if (!data?.image) throw new Error(data?.error || 'AI 변환 실패')
  return `data:${data.mimeType || 'image/png'};base64,${data.image}`
}
