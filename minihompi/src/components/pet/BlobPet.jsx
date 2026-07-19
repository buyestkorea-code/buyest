// 승목이가 좋아하는 몬스터(핑크 젤리 블롭) 느낌을 살린 오리지널 캐릭터 스킨.
// 실제 캐릭터 이미지를 그대로 쓰지 않고, 동글동글한 젤리 몸+점 눈 컨셉만 새로 그렸습니다.
const MOUTHS = {
  happy: 'M226 330 Q256 356 286 330',
  neutral: 'M230 336 L282 336',
  sad: 'M226 344 Q256 322 286 344',
  sparkle: 'M220 328 Q256 360 292 328',
}

export default function BlobPet({ size = 96, mood = 'happy', style, className }) {
  const mouthPath = MOUTHS[mood] || MOUTHS.happy
  const eyesClosed = mood === 'sad'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      className={className}
      style={style}
      role="img"
      aria-label={`블롭 캐릭터 (${mood})`}
    >
      <defs>
        <linearGradient id="blobGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f6c9ea" />
          <stop offset="55%" stopColor="#e7a9e0" />
          <stop offset="100%" stopColor="#c893e8" />
        </linearGradient>
      </defs>
      <path
        d="M256 90
           C 340 90 400 140 420 220
           C 436 286 410 356 340 392
           C 300 412 212 412 172 392
           C 102 356 76 286 92 220
           C 112 140 172 90 256 90 Z"
        fill="url(#blobGrad)"
      />
      <ellipse cx="180" cy="230" rx="18" ry="10" fill="#fff" opacity="0.5" />
      {eyesClosed ? (
        <g stroke="#4a2f55" strokeWidth="10" strokeLinecap="round" fill="none">
          <path d="M196 288 Q214 274 232 288" />
          <path d="M280 288 Q298 274 316 288" />
        </g>
      ) : (
        <g fill="#3d2646">
          <ellipse cx="214" cy="286" rx="16" ry="20" />
          <ellipse cx="298" cy="286" rx="16" ry="20" />
          <circle cx="220" cy="278" r="5" fill="#fff" />
          <circle cx="304" cy="278" r="5" fill="#fff" />
        </g>
      )}
      <path d={mouthPath} stroke="#8a4f8f" strokeWidth="10" fill="none" strokeLinecap="round" />
      <circle cx="180" cy="320" r="16" fill="#ffb7dd" opacity="0.6" />
      <circle cx="332" cy="320" r="16" fill="#ffb7dd" opacity="0.6" />
      <path d="M256 90 L246 58 L266 58 Z" fill="#e7a9e0" />
      <path d="M244 60 L256 30 L268 60 Z" fill="#f6c9ea" stroke="#c893e8" strokeWidth="4" />
    </svg>
  )
}
