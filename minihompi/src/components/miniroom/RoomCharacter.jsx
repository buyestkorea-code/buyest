import Mascot from '../common/Mascot.jsx'
import BlobPet from '../pet/BlobPet.jsx'
import OutfitOverlay from '../pet/OutfitOverlay.jsx'

export default function RoomCharacter({ skin, mood = 'happy', outfitName }) {
  const CharacterComponent = skin === 'blob' ? BlobPet : Mascot

  return (
    <div
      style={{
        position: 'absolute', left: '50%', bottom: '6%', transform: 'translateX(-50%)',
        width: 76, height: 76, animation: 'room-char-float 2.8s ease-in-out infinite',
      }}
    >
      <CharacterComponent size={76} mood={mood} />
      <OutfitOverlay outfitName={outfitName} />
      <style>{`
        @keyframes room-char-float {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-6px); }
        }
      `}</style>
    </div>
  )
}
