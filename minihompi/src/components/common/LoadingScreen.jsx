import Mascot from './Mascot.jsx'

export default function LoadingScreen({ label = '불러오는 중...' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 12 }}>
      <Mascot size={96} mood="neutral" style={{ animation: 'mascot-bounce 1s ease-in-out infinite' }} />
      <p style={{ fontWeight: 700, opacity: 0.7 }}>{label}</p>
      <style>{`
        @keyframes mascot-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  )
}
