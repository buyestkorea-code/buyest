import { useCallback, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient.js'
import { moodFromGauges } from '../utils/petMood.js'

function clamp(n) {
  return Math.max(0, Math.min(100, Math.round(n)))
}

function messageForRatio(ratio) {
  if (ratio >= 0.75) return '우와! 정말 잘했어요! 승목이 최고!'
  if (ratio >= 0.4) return '잘했어요! 캐릭터가 신났어요'
  return '괜찮아요, 다음엔 더 잘할 수 있어요!'
}

export function useGameReaction() {
  const [reaction, setReaction] = useState(null)

  const react = useCallback(async (ratio) => {
    if (!isSupabaseConfigured) return
    const clampedRatio = Math.max(0, Math.min(1, ratio))
    const delta = Math.max(2, Math.round(clampedRatio * 12))
    const { data: pet } = await supabase.from('pet_state').select('skin, hunger, cleanliness, happiness').eq('id', 1).maybeSingle()
    if (!pet) return
    const nextHappiness = clamp(pet.happiness + delta)
    await supabase.from('pet_state').update({ happiness: nextHappiness }).eq('id', 1)
    setReaction({
      skin: pet.skin,
      mood: moodFromGauges({ ...pet, happiness: nextHappiness }),
      delta,
      message: messageForRatio(clampedRatio),
    })
  }, [])

  return { reaction, react }
}
