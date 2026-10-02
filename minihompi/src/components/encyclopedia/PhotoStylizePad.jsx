import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { renderEncyclopediaArt, loadImageFromFile, ART_WIDTH, ART_HEIGHT } from '../../lib/encyclopediaArt.js'
import { aiStylizeEncyclopediaPhoto } from '../../lib/aiStylize.js'
import { isSupabaseConfigured } from '../../lib/supabaseClient.js'

function loadImageFromDataUrl(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = dataUrl
  })
}

function drawContain(canvas, img, bg = '#fffdf8') {
  canvas.width = ART_WIDTH
  canvas.height = ART_HEIGHT
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, ART_WIDTH, ART_HEIGHT)
  const scale = Math.min(ART_WIDTH / img.width, ART_HEIGHT / img.height)
  const w = img.width * scale
  const h = img.height * scale
  ctx.drawImage(img, (ART_WIDTH - w) / 2, (ART_HEIGHT - h) / 2, w, h)
}

const PhotoStylizePad = forwardRef(function PhotoStylizePad({ name }, ref) {
  const canvasRef = useRef(null)
  const cameraInputRef = useRef(null)
  const libraryInputRef = useRef(null)
  const [status, setStatus] = useState('idle') // idle | ai-working | filter-working | done
  const [engine, setEngine] = useState(null) // 'ai' | 'filter'
  const [error, setError] = useState(null)

  useImperativeHandle(ref, () => ({
    toBlob: () => new Promise((resolve) => canvasRef.current.toBlob(resolve, 'image/png')),
    clear: () => {
      setStatus('idle')
      setEngine(null)
      setError(null)
      const canvas = canvasRef.current
      canvas.width = ART_WIDTH
      canvas.height = ART_HEIGHT
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = '#fffdf8'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    },
  }))

  async function handleFile(file) {
    if (!file) return
    setError(null)

    if (isSupabaseConfigured) {
      setStatus('ai-working')
      try {
        const dataUrl = await aiStylizeEncyclopediaPhoto(file, name)
        const img = await loadImageFromDataUrl(dataUrl)
        drawContain(canvasRef.current, img)
        setEngine('ai')
        setStatus('done')
        return
      } catch {
        // AI 변환에 실패하면 아래에서 무료 필터로 자동 전환
      }
    }

    setStatus('filter-working')
    try {
      const img = await loadImageFromFile(file)
      renderEncyclopediaArt(canvasRef.current, img)
      setEngine('filter')
      setStatus('done')
    } catch {
      setError('사진을 불러오지 못했어요. 다시 시도해보세요.')
      setStatus('idle')
    }
  }

  return (
    <div className="stack">
      <canvas
        ref={canvasRef}
        width={320}
        height={240}
        style={{ width: '100%', borderRadius: 12, border: '2px solid var(--color-pink)', background: '#fffdf8' }}
      />
      <div className="row-wrap">
        <button className="btn" onClick={() => cameraInputRef.current?.click()}>
          📷 사진 찍기
        </button>
        <button className="btn" onClick={() => libraryInputRef.current?.click()}>
          🖼️ 앨범에서 선택
        </button>
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          hidden
          onChange={(e) => handleFile(e.target.files[0])}
        />
        <input
          ref={libraryInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => handleFile(e.target.files[0])}
        />
      </div>
      {status === 'ai-working' && <p className="pill">🤖 AI가 도감 그림으로 그려주는 중... (몇 초 걸려요)</p>}
      {status === 'filter-working' && <p className="pill">🎨 도감 그림으로 바꾸는 중...</p>}
      {status === 'done' && (
        <p style={{ fontSize: 11, opacity: 0.5, margin: 0 }}>
          {engine === 'ai' ? '✨ AI가 새로 그려줬어요' : '🎨 색/윤곽선 필터로 바꿨어요'}
        </p>
      )}
      {error && <p style={{ color: '#e64545', fontSize: 13 }}>{error}</p>}
    </div>
  )
})

export default PhotoStylizePad
