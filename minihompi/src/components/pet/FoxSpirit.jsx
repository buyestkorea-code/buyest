// 중학생 눈높이에 맞춘 쿨한 느낌의 오리지널 여우 캐릭터 스킨.
const MOUTHS = {
  happy: 'M206 336 Q256 366 306 336',
  neutral: 'M210 344 L302 344',
  sad: 'M206 352 Q256 324 306 352',
  sparkle: 'M198 332 Q256 372 314 332',
}

export default function FoxSpirit({ size = 96, mood = 'happy', style, className }) {
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
      aria-label={`여우 캐릭터 (${mood})`}
    >
      <defs>
        <linearGradient id="foxBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b93ff" />
          <stop offset="55%" stopColor="#6f6fe0" />
          <stop offset="100%" stopColor="#4a4ab8" />
        </linearGradient>
        <linearGradient id="foxFaceGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f4f1ff" />
          <stop offset="100%" stopColor="#e2ddff" />
        </linearGradient>
      </defs>

      {/* 귀 */}
      <path d="M150 168 L108 56 L214 140 Z" fill="url(#foxBodyGrad)" />
      <path d="M362 168 L404 56 L298 140 Z" fill="url(#foxBodyGrad)" />
      <path d="M156 158 L128 82 L200 138 Z" fill="#2f2a63" opacity="0.55" />
      <path d="M356 158 L384 82 L312 138 Z" fill="#2f2a63" opacity="0.55" />

      {/* 얼굴 */}
      <circle cx="256" cy="270" r="180" fill="url(#foxBodyGrad)" />
      <path d="M256 200 C 320 200 356 250 350 320 C 344 380 302 402 256 402 C 210 402 168 380 162 320 C 156 250 192 200 256 200 Z" fill="url(#foxFaceGrad)" />

      {eyesClosed ? (
        <g stroke="#2f2a63" strokeWidth="10" strokeLinecap="round" fill="none">
          <path d="M186 268 Q206 252 226 268" />
          <path d="M286 268 Q306 252 326 268" />
        </g>
      ) : (
        <g>
          <ellipse cx="206" cy="270" rx="18" ry="24" fill="#2f2a63" />
          <ellipse cx="306" cy="270" rx="18" ry="24" fill="#2f2a63" />
          <circle cx="213" cy="260" r="6" fill="#fff" />
          <circle cx="313" cy="260" r="6" fill="#fff" />
        </g>
      )}

      <path d="M256 300 L238 322 L274 322 Z" fill="#4a4ab8" />
      <path d={mouthPath} stroke="#4a4ab8" strokeWidth="10" fill="none" strokeLinecap="round" />

      <circle cx="150" cy="330" r="20" fill="#b7a8ff" opacity="0.5" />
      <circle cx="362" cy="330" r="20" fill="#b7a8ff" opacity="0.5" />

      {mood === 'sparkle' && (
        <g fill="#ffe27a">
          <circle cx="120" cy="180" r="8" />
          <circle cx="400" cy="200" r="6" />
          <circle cx="380" cy="120" r="5" />
        </g>
      )}
    </svg>
  )
}
