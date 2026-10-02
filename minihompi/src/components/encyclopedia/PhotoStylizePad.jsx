import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { renderEncyclopediaArt, loadImageFromFile } from '../../lib/encyclopediaArt.js'

const PhotoStylizePad = forwardRef(function PhotoStylizePad(_props, ref) {
  const canvasRef = useRef(null)
  const fileInputRef = useRef(null)
  const [status, setStatus] = useState('idle') // idle | working | done
  const [error, setError] = useState(null)

  useImperativeHandle(ref, () => ({
    toBlob: () => new Promise((resolve) => canvasRef.current.toBlob(resolve, 'image/png')),
    clear: () => {
      setStatus('idle')
      setError(null)
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = '#fffdf8'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    },
  }))

  async function handleFile(file) {
    if (!file) return
    setError(null)
    setStatus('working')
    try {
      const img = await loadImageFromFile(file)
      renderEncyclopediaArt(canvasRef.current, img)
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
        <button className="btn" onClick={() => fileInputRef.current?.click()}>
          {status === 'done' ? '🔄 다른 사진 선택' : '📷 사진 선택하고 도감 그림으로 바꾸기'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          hidden
          onChange={(e) => handleFile(e.target.files[0])}
        />
      </div>
      {status === 'working' && <p className="pill">🎨 도감 그림으로 바꾸는 중...</p>}
      {error && <p style={{ color: '#e64545', fontSize: 13 }}>{error}</p>}
    </div>
  )
})

export default PhotoStylizePad
