// 사진을 '도감 그림체'처럼 보이게 만드는 캔버스 필터
// - 색상을 단순화(포스터라이즈)하고 채도를 올려서 선명한 삽화 느낌을 냄
// - 경계선을 찾아서 검은 윤곽선을 그려 넣어 만화/도감 삽화처럼 보이게 함
export const ART_WIDTH = 320
export const ART_HEIGHT = 240

function clamp(v) {
  return v < 0 ? 0 : v > 255 ? 255 : v
}

function drawImageContain(ctx, img, width, height, bg = '#fffdf8') {
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, width, height)
  const scale = Math.min(width / img.width, height / img.height)
  const w = img.width * scale
  const h = img.height * scale
  ctx.drawImage(img, (width - w) / 2, (height - h) / 2, w, h)
}

// 사진의 자잘한 노이즈/질감을 뭉개서 매끈한 삽화 영역으로 만듦 (box blur, 2회 반복)
function boxBlur(data, width, height, radius = 2, passes = 2) {
  for (let pass = 0; pass < passes; pass++) {
    const src = new Uint8ClampedArray(data)
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let r = 0, g = 0, b = 0, count = 0
        for (let dy = -radius; dy <= radius; dy++) {
          const ny = y + dy
          if (ny < 0 || ny >= height) continue
          for (let dx = -radius; dx <= radius; dx++) {
            const nx = x + dx
            if (nx < 0 || nx >= width) continue
            const si = (ny * width + nx) * 4
            r += src[si]; g += src[si + 1]; b += src[si + 2]
            count++
          }
        }
        const i = (y * width + x) * 4
        data[i] = r / count
        data[i + 1] = g / count
        data[i + 2] = b / count
      }
    }
  }
}

function posterizeAndSaturate(data, levels = 5, satBoost = 1.6) {
  const step = 255 / (levels - 1)
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2]
    const avg = (r + g + b) / 3
    let r2 = clamp(avg + (r - avg) * satBoost)
    let g2 = clamp(avg + (g - avg) * satBoost)
    let b2 = clamp(avg + (b - avg) * satBoost)
    data[i] = clamp(Math.round(Math.round(r2 / step) * step))
    data[i + 1] = clamp(Math.round(Math.round(g2 / step) * step))
    data[i + 2] = clamp(Math.round(Math.round(b2 / step) * step))
  }
}

function overlayEdges(data, width, height, threshold = 70) {
  const gray = new Float32Array(width * height)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4
      gray[y * width + x] = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114
    }
  }
  const edge = new Float32Array(width * height)
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const i = y * width + x
      const gx =
        gray[i - width - 1] + 2 * gray[i - 1] + gray[i + width - 1] -
        (gray[i - width + 1] + 2 * gray[i + 1] + gray[i + width + 1])
      const gy =
        gray[i - width - 1] + 2 * gray[i - width] + gray[i - width + 1] -
        (gray[i + width - 1] + 2 * gray[i + width] + gray[i + width + 1])
      edge[i] = Math.sqrt(gx * gx + gy * gy)
    }
  }
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const mag = edge[y * width + x]
      if (mag > threshold) {
        const i = (y * width + x) * 4
        const darken = Math.min(1, (mag - threshold) / 180) * 0.85
        data[i] = clamp(data[i] * (1 - darken))
        data[i + 1] = clamp(data[i + 1] * (1 - darken))
        data[i + 2] = clamp(data[i + 2] * (1 - darken))
      }
    }
  }
}

// 실제 사진(어두운 배경, 손떨림, JPEG 압축 노이즈 등)은 원본 해상도에서 바로 윤곽선을
// 따면 잡티가 다 선으로 잡혀서 지저분해짐. 먼저 작은 해상도로 축소해서(=다운스케일 자체가
// 노이즈를 평균내서 없애줌) 필터를 적용한 뒤, 다시 확대해서 부드러운 포스터 느낌을 냄.
const WORK_SCALE = 0.4

export function renderEncyclopediaArt(canvas, img) {
  const workWidth = Math.round(ART_WIDTH * WORK_SCALE)
  const workHeight = Math.round(ART_HEIGHT * WORK_SCALE)

  const workCanvas = document.createElement('canvas')
  workCanvas.width = workWidth
  workCanvas.height = workHeight
  const workCtx = workCanvas.getContext('2d')
  drawImageContain(workCtx, img, workWidth, workHeight)

  const imageData = workCtx.getImageData(0, 0, workWidth, workHeight)
  boxBlur(imageData.data, workWidth, workHeight, 1, 1)
  posterizeAndSaturate(imageData.data, 5, 1.6)
  overlayEdges(imageData.data, workWidth, workHeight, 55)
  workCtx.putImageData(imageData, 0, 0)

  canvas.width = ART_WIDTH
  canvas.height = ART_HEIGHT
  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(workCanvas, 0, 0, workWidth, workHeight, 0, 0, ART_WIDTH, ART_HEIGHT)
}

export function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}
