function loadImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}

async function drawResized(img, maxSize, quality) {
  const scale = Math.min(1, maxSize / Math.max(img.width, img.height))
  const width = Math.round(img.width * scale)
  const height = Math.round(img.height * scale)
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0, width, height)
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality))
  return blob
}

// 업로드한 사진을 큰 화면용(1280px)과 썸네일(320px)로 리사이즈해서 용량을 줄입니다.
export async function resizePhoto(file) {
  const img = await loadImage(file)
  const [full, thumb] = await Promise.all([
    drawResized(img, 1280, 0.82),
    drawResized(img, 320, 0.75),
  ])
  URL.revokeObjectURL(img.src)
  return { full, thumb }
}
