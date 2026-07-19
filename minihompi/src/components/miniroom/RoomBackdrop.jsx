// 싸이월드 미니홈피 감성의 방 배경 (벽지 + 창문 + 액자 + 나무 바닥)
export default function RoomBackdrop() {
  return (
    <svg viewBox="0 0 400 500" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <defs>
        <pattern id="wallpaper" width="40" height="40" patternUnits="userSpaceOnUse">
          <rect width="40" height="40" fill="#fff3e0" />
          <circle cx="10" cy="10" r="3" fill="#ffe0c2" />
          <circle cx="30" cy="30" r="3" fill="#ffe0c2" />
        </pattern>
        <pattern id="floor" width="50" height="16" patternUnits="userSpaceOnUse">
          <rect width="50" height="16" fill="#e8c9a0" />
          <rect width="50" height="16" fill="none" stroke="#d9b382" strokeWidth="1.5" />
          <line x1="25" y1="0" x2="25" y2="16" stroke="#d9b382" strokeWidth="1" />
        </pattern>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#cdeeff" />
          <stop offset="100%" stopColor="#eaf8ff" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="400" height="330" fill="url(#wallpaper)" />
      <rect x="0" y="330" width="400" height="170" fill="url(#floor)" />
      <rect x="0" y="325" width="400" height="10" fill="#c9a877" />

      <g>
        <rect x="24" y="40" width="110" height="90" rx="6" fill="#a8763f" />
        <rect x="32" y="48" width="94" height="74" fill="url(#sky)" />
        <line x1="79" y1="48" x2="79" y2="122" stroke="#a8763f" strokeWidth="4" />
        <line x1="32" y1="85" x2="126" y2="85" stroke="#a8763f" strokeWidth="4" />
        <circle cx="105" cy="65" r="9" fill="#fff6d8" opacity="0.9" />
      </g>

      <g>
        <rect x="290" y="55" width="80" height="60" rx="4" fill="#d9a441" />
        <rect x="297" y="62" width="66" height="46" fill="#fff8ec" />
        <path d="M303 100 L320 78 L333 92 L345 70 L357 100 Z" fill="#bfe3c8" />
        <circle cx="349" cy="76" r="6" fill="#ffd88a" />
      </g>
    </svg>
  )
}
