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
  if (error) {
    // supabase-js는 함수가 에러 상태코드를 반환하면 본문을 error.context(Response)에 담아줌
    const body = await error.context?.json?.().catch(() => null)
    throw new Error(body?.error || error.message || 'AI 변환 실패')
  }
  if (!data?.image) throw new Error(data?.error || 'AI 변환 실패')
  return `data:${data.mimeType || 'image/png'};base64,${data.image}`
}
