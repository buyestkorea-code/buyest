import Mascot from '../common/Mascot.jsx'
import BlobPet from '../pet/BlobPet.jsx'

export default function GameReactionCard({ reaction }) {
  if (!reaction) return null
  const CharComp = reaction.skin === 'blob' ? BlobPet : Mascot

  return (
    <div className="row" style={{ alignItems: 'center', gap: 10, background: '#fff7ea', borderRadius: 14, padding: 10 }}>
      <CharComp size={52} mood={reaction.mood} />
      <div>
        <div style={{ fontWeight: 700, fontSize: 13 }}>{reaction.message}</div>
        <div style={{ fontSize: 12, opacity: 0.6 }}>캐릭터 행복도 +{reaction.delta}</div>
      </div>
    </div>
  )
}
