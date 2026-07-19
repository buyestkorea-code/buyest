// 승목이 마스코트 캐릭터. mood 에 따라 표정이 바뀝니다.
const MOUTHS = {
  happy: 'M206 342 Q256 384 306 342',
  neutral: 'M206 350 L306 350',
  sad: 'M206 356 Q256 326 306 356',
  sparkle: 'M196 340 Q256 372 316 340',
}

const EYES_CLOSED = 'M186 266 Q196 250 206 266'

export default function Mascot({ size = 96, mood = 'happy', style, className }) {
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
      aria-label={`승목이 마스코트 (${mood})`}
    >
      <defs>
        <radialGradient id="mascotFaceGrad" cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#fff3d6" />
          <stop offset="100%" stopColor="#ffd88a" />
        </radialGradient>
      </defs>
      <circle cx="256" cy="256" r="240" fill="#ffe3ef" />
      <circle cx="256" cy="268" r="188" fill="url(#mascotFaceGrad)" />
      <path d="M110 190 Q140 140 190 158" stroke="#e8b866" strokeWidth="14" fill="none" strokeLinecap="round" />
      <path d="M402 190 Q372 140 322 158" stroke="#e8b866" strokeWidth="14" fill="none" strokeLinecap="round" />
      <circle cx="150" cy="320" r="34" fill="#ffb7c9" opacity="0.75" />
      <circle cx="362" cy="320" r="34" fill="#ffb7c9" opacity="0.75" />
      {eyesClosed ? (
        <g stroke="#4a3b2a" strokeWidth="10" strokeLinecap="round" fill="none">
          <path d="M176 266 Q196 250 216 266" />
          <path d="M296 266 Q316 250 336 266" />
        </g>
      ) : (
        <g>
          <ellipse cx="196" cy="266" rx="26" ry="32" fill="#4a3b2a" />
          <ellipse cx="316" cy="266" rx="26" ry="32" fill="#4a3b2a" />
          <circle cx="206" cy="254" r="8" fill="#fff" />
          <circle cx="326" cy="254" r="8" fill="#fff" />
        </g>
      )}
      <path d={mouthPath} stroke="#a86b4a" strokeWidth="14" fill="none" strokeLinecap="round" />
      <circle cx="256" cy="70" r="20" fill="#ffd88a" stroke="#e8b866" strokeWidth="8" />
    </svg>
  )
}
