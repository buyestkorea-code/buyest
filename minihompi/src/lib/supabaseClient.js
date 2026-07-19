import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(url && anonKey)

if (!isSupabaseConfigured) {
  console.warn(
    '[supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY 가 설정되지 않았습니다. ' +
    'minihompi/.env.example 을 minihompi/.env 로 복사하고 값을 채워주세요.'
  )
}

export const supabase = isSupabaseConfigured ? createClient(url, anonKey) : null
