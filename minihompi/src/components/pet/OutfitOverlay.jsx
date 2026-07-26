// 착용한 옷/액세서리를 캐릭터 위에 겹쳐서 실제로 보이게 해주는 오버레이.
const OUTFIT_STYLE = {
  '노란 리본': { emoji: '🎀', top: '2%', left: '74%', scale: 0.32 },
  '별무늬 모자': { emoji: '⭐', top: '-8%', left: '50%', scale: 0.36 },
  '마법사 모자': { emoji: '🎩', top: '-14%', left: '50%', scale: 0.42 },
  '왕관': { emoji: '👑', top: '-16%', left: '50%', scale: 0.4 },
  '안경': { emoji: '👓', top: '46%', left: '50%', scale: 0.46 },
  '나비 날개': { emoji: '🦋', top: '30%', left: '50%', scale: 0.9, mirrored: true },
  '분홍 원피스': { emoji: '👗', top: '68%', left: '50%', scale: 0.5, behind: true },
  '멜빵바지': { emoji: '👖', top: '68%', left: '50%', scale: 0.5, behind: true },
  '스카프': { emoji: '🧣', top: '58%', left: '50%', scale: 0.4 },
  '✨ 다이아몬드 왕관': { emoji: '👑', top: '-18%', left: '50%', scale: 0.46 },
  '✨ 용 날개 옷': { emoji: '🐉', top: '30%', left: '50%', scale: 0.95, mirrored: true },
  '✨ 황금 옷': { emoji: '🥇', top: '55%', left: '50%', scale: 0.42 },
  '✨ 유니콘 뿔': { emoji: '🦄', top: '-20%', left: '50%', scale: 0.36 },
  '✨ 마법사 로브': { emoji: '🧙', top: '68%', left: '50%', scale: 0.55, behind: true },
  '✨ 슈퍼히어로 망토': { emoji: '🦸', top: '70%', left: '50%', scale: 0.55, behind: true },
}

export default function OutfitOverlay({ outfitName }) {
  const style = OUTFIT_STYLE[outfitName]
  if (!style) return null

  return (
    <span
      style={{
        position: 'absolute',
        top: style.top,
        left: style.left,
        transform: `translate(-50%, -50%) scale(${style.scale})`,
        fontSize: 80,
        lineHeight: 1,
        pointerEvents: 'none',
        zIndex: style.behind ? 0 : 2,
      }}
    >
      {style.emoji}
    </span>
  )
}
