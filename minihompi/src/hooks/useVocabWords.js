import { useCallback, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient.js'

export function useVocabWords() {
  const [words, setWords] = useState([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured) { setLoading(false); return }
    setLoading(true)
    const { data } = await supabase.from('vocab_words').select('*').order('created_at', { ascending: false })
    setWords(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { refresh() }, [refresh])

  const saveWord = useCallback(async (wordEn, wordKo, source = 'text') => {
    if (!isSupabaseConfigured) return { isNew: false }
    const normalized = wordEn.trim().toLowerCase()
    if (!normalized) return { isNew: false }
    const alreadyExists = words.some((w) => w.word_en.toLowerCase() === normalized)
    if (alreadyExists) return { isNew: false }
    const { error } = await supabase.from('vocab_words').upsert(
      { word_en: normalized, word_ko: wordKo, source },
      { onConflict: 'word_en', ignoreDuplicates: true }
    )
    await refresh()
    return { isNew: !error }
  }, [words, refresh])

  return { words, loading, saveWord }
}
