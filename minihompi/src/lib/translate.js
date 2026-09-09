// 번역 우선순위:
// 1) Lingva(구글 번역 품질의 무료 오픈소스 API, 여러 공개 인스턴스로 동시에 시도) — 정확도가 가장 좋음
// 2) 위가 전부 실패하면 MyMemory 무료 API로 대체 (짧은 단어에서 가끔 다른 언어로 잘못 매칭되는
//    문제가 있어, 실제 요청한 언어쌍과 정확히 일치하는 결과만 신뢰하고, 무료 사용량 초과 경고
//    문구가 번역 결과인 것처럼 오는 경우도 걸러낸다)
const LINGVA_INSTANCES = [
  'https://lingva.thedaviddelta.com',
  'https://lingva.ml',
  'https://lingva.garudalinux.org',
  'https://translate.plausibility.cloud',
]

async function fetchWithTimeout(url, timeoutMs = 5000) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, { signal: controller.signal })
  } finally {
    clearTimeout(timer)
  }
}

async function translateWithLingva(text, sourcelang, targetLang) {
  const attempts = LINGVA_INSTANCES.map(async (base) => {
    const url = `${base}/api/v1/${sourcelang}/${targetLang}/${encodeURIComponent(text)}`
    const res = await fetchWithTimeout(url)
    if (!res.ok) throw new Error('lingva request failed')
    const data = await res.json()
    const translated = data?.translation
    if (!translated || !translated.trim()) throw new Error('lingva empty result')
    return translated.trim()
  })
  try {
    return await Promise.any(attempts)
  } catch {
    return null
  }
}

function looksLikeQuotaWarning(text) {
  if (!text) return true
  const upper = text.toUpperCase()
  return upper.includes('MYMEMORY WARNING') || upper.includes('AVAILABLE FREE TRANSLATIONS') || upper.includes('PLEASE SELECT')
}

function pickReliableMemoryMatch(data, sourcelang, targetLang) {
  const matches = Array.isArray(data?.matches) ? data.matches : []
  const sameLangPair = matches.filter((m) => {
    const src = (m.source || '').toLowerCase()
    const tgt = (m.target || '').toLowerCase()
    return src.startsWith(sourcelang.toLowerCase()) && tgt.startsWith(targetLang.toLowerCase())
  })
  if (sameLangPair.length === 0) return null
  sameLangPair.sort((a, b) => Number(b.quality || 0) - Number(a.quality || 0) || Number(b.match || 0) - Number(a.match || 0))
  return sameLangPair[0].translation
}

async function translateWithMyMemory(text, sourcelang, targetLang) {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourcelang}|${targetLang}&de=buyestkorea@gmail.com`
  const res = await fetchWithTimeout(url, 8000)
  if (!res.ok) return null
  const data = await res.json()
  const rawTranslated = data?.responseData?.translatedText
  if (looksLikeQuotaWarning(rawTranslated)) return null
  const translated = pickReliableMemoryMatch(data, sourcelang, targetLang) || rawTranslated
  if (!translated || looksLikeQuotaWarning(translated)) return null
  return translated
}

export async function translateText(text, sourcelang, targetLang) {
  const trimmed = text.trim()
  if (!trimmed) return null

  const fromLingva = await translateWithLingva(trimmed, sourcelang, targetLang)
  if (fromLingva) return fromLingva

  const fromMyMemory = await translateWithMyMemory(trimmed, sourcelang, targetLang)
  if (fromMyMemory) return fromMyMemory

  throw new Error('번역 결과를 받지 못했어요. 잠시 후 다시 시도해주세요.')
}
