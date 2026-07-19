export function toDateKey(date = new Date()) {
  const d = new Date(date)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export function todayKey() {
  return toDateKey(new Date())
}

export function formatKoreanDate(dateKey) {
  const [y, m, d] = dateKey.split('-')
  return `${y}년 ${Number(m)}월 ${Number(d)}일`
}

export function daysBetween(aKey, bKey) {
  const a = new Date(aKey)
  const b = new Date(bKey)
  return Math.round((b - a) / (1000 * 60 * 60 * 24))
}
