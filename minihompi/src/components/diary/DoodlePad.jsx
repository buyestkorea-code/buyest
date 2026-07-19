import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'

const COLORS = ['#4a3b2a', '#ff6b9d', '#ffb84d', '#4dd0e1', '#7cd992', '#a78bfa']

function getPos(canvas, e) {
  const rect = canvas.getBoundingClientRect()
  const point = e.touches ? e.touches[0] : e
  return {
    x: ((point.clientX - rect.left) / rect.width) * canvas.width,
    y: ((point.clientY - rect.top) / rect.height) * canvas.height,
  }
}

const DoodlePad = forwardRef(function DoodlePad({ initialImageUrl }, ref) {
  const canvasRef = useRef(null)
  const drawingRef = useRef(false)
  const colorRef = useRef(COLORS[0])
  const [color, setColor] = useState(COLORS[0])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#fffdf8'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    if (initialImageUrl) {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      img.src = initialImageUrl
    }
  }, [initialImageUrl])

  useImperativeHandle(ref, () => ({
    toBlob: () => new Promise((resolve) => canvasRef.current.toBlob(resolve, 'image/png')),
    clear: () => {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = '#fffdf8'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    },
  }))

  function start(e) {
    e.preventDefault()
    drawingRef.current = true
    draw(e)
  }
  function stop() {
    drawingRef.current = false
  }
  function draw(e) {
    if (!drawingRef.current) return
    e.preventDefault()
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const { x, y } = getPos(canvas, e)
    ctx.fillStyle = colorRef.current
    ctx.beginPath()
    ctx.arc(x, y, 5, 0, Math.PI * 2)
    ctx.fill()
  }

  return (
    <div className="stack">
      <canvas
        ref={canvasRef}
        width={320}
        height={240}
        style={{ width: '100%', borderRadius: 12, border: '2px solid var(--color-pink)', touchAction: 'none', background: '#fffdf8' }}
        onMouseDown={start}
        onMouseMove={draw}
        onMouseUp={stop}
        onMouseLeave={stop}
        onTouchStart={start}
        onTouchMove={draw}
        onTouchEnd={stop}
      />
      <div className="row-wrap">
        {COLORS.map((c) => (
          <button
            key={c}
            onClick={() => { setColor(c); colorRef.current = c }}
            style={{
              width: 32, height: 32, borderRadius: '50%', background: c, border: color === c ? '3px solid #333' : '3px solid #fff',
              boxShadow: '0 0 0 1px #ddd',
            }}
            aria-label={`색상 ${c}`}
          />
        ))}
        <button className="btn btn-ghost" onClick={() => ref.current?.clear()}>🧹 지우기</button>
      </div>
    </div>
  )
})

export default DoodlePad
