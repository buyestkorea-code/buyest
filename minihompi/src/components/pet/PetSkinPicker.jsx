import Mascot from '../common/Mascot.jsx'
import BlobPet from './BlobPet.jsx'

const SKINS = [
  { key: 'mascot', label: '병아리 친구', Comp: Mascot },
  { key: 'blob', label: '핑크 젤리 친구', Comp: BlobPet },
]

export default function PetSkinPicker({ skin, onSelect }) {
  return (
    <div className="card">
      <h3 style={{ fontSize: 14, marginBottom: 8 }}>🎭 캐릭터 모습 바꾸기</h3>
      <div className="row-wrap">
        {SKINS.map(({ key, label, Comp }) => (
          <button
            key={key}
            className="btn"
            style={{
              flexDirection: 'column', gap: 4, background: skin === key ? 'var(--color-pink)' : '#f8f4ea',
              minHeight: 84,
            }}
            onClick={() => onSelect(key)}
          >
            <Comp size={40} mood="happy" />
            <span style={{ fontSize: 11 }}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
