import Mascot from '../common/Mascot.jsx'

function moodFromGauges(state) {
  const avg = (state.hunger + state.cleanliness + state.happiness) / 3
  if (avg >= 60) return 'happy'
  if (avg >= 30) return 'neutral'
  return 'sad'
}

export default function PetStage({ state, outfitName }) {
  if (state.stage === 'egg') {
    return (
      <div className="card stack" style={{ alignItems: 'center' }}>
        <span style={{ fontSize: 80 }}>🥚</span>
        <p style={{ fontWeight: 700 }}>아직 알이에요! 잘 돌봐주면 곧 태어날 거예요.</p>
      </div>
    )
  }

  const mood = moodFromGauges(state)

  return (
    <div className="card stack" style={{ alignItems: 'center' }}>
      <Mascot size={140} mood={mood} />
      <p style={{ fontWeight: 700 }}>
        {state.stage === 'grown' ? '멋지게 자란 승목이 친구' : '갓 태어난 승목이 친구'}
        {outfitName ? ` · ${outfitName} 착용중` : ''}
      </p>
    </div>
  )
}
