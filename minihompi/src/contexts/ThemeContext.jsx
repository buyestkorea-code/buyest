import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient.js'

const ThemeContext = createContext(null)

export const SKINS = {
  pink: { label: '핑크 딸기', bg: '#fff3d6', accent: '#ffd6e8', accent2: '#b9e8ff' },
  mint: { label: '민트 소다', bg: '#f2fff8', accent: '#c8f4e0', accent2: '#ffe3ef' },
  sky: { label: '하늘 구름', bg: '#f2fbff', accent: '#cfeeff', accent2: '#ffe9b0' },
  lavender: { label: '라벤더 별', bg: '#f8f5ff', accent: '#e6dcff', accent2: '#ffd6e8' },
  peach: { label: '복숭아', bg: '#fff6f0', accent: '#ffdcc2', accent2: '#c8f4e0' },
}

function applySkin(skinKey) {
  const skin = SKINS[skinKey] || SKINS.pink
  const root = document.documentElement.style
  root.setProperty('--skin-bg', skin.bg)
  root.setProperty('--skin-accent', skin.accent)
  root.setProperty('--skin-accent-2', skin.accent2)
}

export function ThemeProvider({ children }) {
  const [skin, setSkinState] = useState('pink')

  useEffect(() => {
    let cancelled = false
    async function load() {
      if (!isSupabaseConfigured) return
      const { data } = await supabase.from('profile').select('theme_skin').eq('id', 1).maybeSingle()
      if (!cancelled && data?.theme_skin) {
        setSkinState(data.theme_skin)
        applySkin(data.theme_skin)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  useEffect(() => { applySkin(skin) }, [skin])

  const setSkin = async (nextSkin) => {
    setSkinState(nextSkin)
    if (isSupabaseConfigured) {
      await supabase.from('profile').update({ theme_skin: nextSkin }).eq('id', 1)
    }
  }

  const value = useMemo(() => ({ skin, setSkin, skins: SKINS }), [skin])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
