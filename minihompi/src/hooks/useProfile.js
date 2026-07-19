import { useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient.js'

const DEFAULT_PROFILE = {
  id: 1,
  nickname: '승목이',
  school: '',
  grade: '',
  class_no: '',
  student_no: '',
  favorites: ['', '', ''],
  avatar_url: null,
  cover_url: null,
  title_text: '승목이의 비밀기지',
  mood_emoji: '😊',
  theme_skin: 'pink',
}

export function useProfile() {
  const [profile, setProfile] = useState(DEFAULT_PROFILE)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      if (!isSupabaseConfigured) {
        setLoading(false)
        return
      }
      const { data, error } = await supabase.from('profile').select('*').eq('id', 1).maybeSingle()
      if (!cancelled && !error && data) setProfile(data)
      if (!cancelled) setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [])

  return { profile, setProfile, loading }
}
