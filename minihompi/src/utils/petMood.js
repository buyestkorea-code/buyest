export function moodFromGauges(state) {
  const avg = (state.hunger + state.cleanliness + state.happiness) / 3
  if (avg >= 85) return 'sparkle'
  if (avg >= 55) return 'happy'
  if (avg >= 30) return 'neutral'
  return 'sad'
}
