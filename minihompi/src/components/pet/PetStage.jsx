import Mascot from '../common/Mascot.jsx'
import BlobPet from './BlobPet.jsx'
import OutfitOverlay from './OutfitOverlay.jsx'
import { moodFromGauges } from '../../utils/petMood.js'
import { nextEvolutionHint } from '../../utils/petEvolution.js'

function statusMessage(state) {
  const lowest = Math.min(state.hunger, state.cleanliness, state.happiness)
  if (lowest === state.hunger && state.hunger < 35) return '배고파요... 밥 주세요!'
  if (lowest === state.cleanliness && state.cleanliness < 35) return '몸이 더러워요, 씻겨주세요!'
  if (lowest === state.happiness && state.happiness < 35) return '심심해요, 놀아주세요!'
  if (state.stage === 'sparkle') return '기분 최고예요! 반짝반짝 ✨'
  return '오늘도 좋은 하루예요!'
}

const STAGE_LABEL = {
  egg: '아직 알이에요!',
  hatchling: '갓 태어난 친구',
  grown: '멋지게 자란 친구',
  sparkle: '반짝반짝 진화한 친구 ✨',
}

export default function PetStage({ state, outfitName }) {
  if (state.stage === 'egg') {
    return (
      <div className="card stack" style={{ alignItems: 'center' }}>
        <span style={{ fontSize: 80, display: 'inline-block', animation: 'egg-wiggle 2.4s ease-in-out infinite' }}>🥚</span>
        <p style={{ fontWeight: 700 }}>아직 알이에요! 시간이 지나거나 잘 돌봐주면 곧 태어날 거예요.</p>
        <style>{`
          @keyframes egg-wiggle {
            0%, 100% { transform: rotate(-4deg); }
            50% { transform: rotate(4deg); }
          }
        `}</style>
      </div>
    )
  }

  const mood = moodFromGauges(state)
  const CharacterComponent = state.skin === 'blob' ? BlobPet : Mascot
  const isSparkleStage = state.stage === 'sparkle'

  return (
    <div className="card stack" style={{ alignItems: 'center', position: 'relative' }}>
      <div className="pill" style={{ position: 'relative' }}>
        {statusMessage(state)}
      </div>
      <div style={{ position: 'relative', width: 140, height: 140, animation: 'pet-float 3s ease-in-out infinite' }}>
        <CharacterComponent size={140} mood={mood} />
        <OutfitOverlay outfitName={outfitName} />
        {isSparkleStage && (
          <span style={{ position: 'absolute', top: -10, right: -10, fontSize: 28 }}>✨</span>
        )}
      </div>
      <p style={{ fontWeight: 700 }}>
        {STAGE_LABEL[state.stage]}
        {outfitName ? ` · ${outfitName} 착용중` : ''}
      </p>
      {!isSparkleStage && (
        <p style={{ fontSize: 12, opacity: 0.6, textAlign: 'center' }}>{nextEvolutionHint(state)}</p>
      )}
      <style>{`
        @keyframes pet-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  )
}
