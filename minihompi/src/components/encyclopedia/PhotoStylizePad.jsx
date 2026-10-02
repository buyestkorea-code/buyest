import { forwardRef, useImperativeHandle, useRef, useState } from 'react'

const CANVAS_WIDTH = 320
const CANVAS_HEIGHT = 240

function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}

function drawContain(canvas, img, bg = '#fffdf8') {
  canvas.width = CANVAS_WIDTH
  canvas.height = CANVAS_HEIGHT
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  const scale = Math.min(CANVAS_WIDTH / img.width, CANVAS_HEIGHT / img.height)
  const w = img.width * scale
  const h = img.height * scale
  ctx.drawImage(img, (CANVAS_WIDTH - w) / 2, (CANVAS_HEIGHT - h) / 2, w, h)
}

const PhotoStylizePad = forwardRef(function PhotoStylizePad(_props, ref) {
  const canvasRef = useRef(null)
  const cameraInputRef = useRef(null)
  const libraryInputRef = useRef(null)
  const [status, setStatus] = useState('idle') // idle | working | done
  const [error, setError] = useState(null)

  useImperativeHandle(ref, () => ({
    toBlob: () => new Promise((resolve) => canvasRef.current.toBlob(resolve, 'image/png')),
    clear: () => {
      setStatus('idle')
      setError(null)
      const canvas = canvasRef.current
      canvas.width = CANVAS_WIDTH
      canvas.height = CANVAS_HEIGHT
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
      drawContain(canvasRef.current, img)
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
      {status === 'working' && <p className="pill">사진 불러오는 중...</p>}
      {error && <p style={{ color: '#e64545', fontSize: 13 }}>{error}</p>}
    </div>
  )
})

export default PhotoStylizePad
