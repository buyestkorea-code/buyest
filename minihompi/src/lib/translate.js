// 번역 우선순위:
// 1) Lingva(구글 번역 품질의 무료 오픈소스 API, 여러 공개 인스턴스로 동시에 시도) — 정확도가 가장 좋음
// 2) 위가 전부 실패하면 MyMemory 무료 API로 대체 (짧은 단어에서 가끔 다른 언어로 잘못 매칭되거나,
//    관련도 낮은 여러 문장 조각을 이어붙인 엉터리 결과를 주는 경우가 있어, 실제 요청한 언어쌍과
//    정확히 일치하는 결과만 신뢰하고, 무료 사용량 초과 경고 문구나 비정상적으로 긴 결과도 걸러낸다)
// 두 엔진 모두 결과를 그대로 믿지 않고
//  - 목표 언어와 전혀 다른 글자(예: 영어를 요청했는데 한글/키릴/한자 등이 섞여 나오는 경우)
//  - 짧은 단어를 입력했는데 결과가 비정상적으로 긴 경우(여러 문장 조각이 이어붙은 걸로 의심)
// 가 나오면 "번역 실패"로 간주하고 다음 방법으로 넘어간다.
const LINGVA_INSTANCES = [
  'https://lingva.thedaviddelta.com',
  'https://lingva.ml',
  'https://lingva.garudalinux.org',
  'https://translate.plausibility.cloud',
  'https://lingva.lunar.icu',
  'https://lingva.esmailelbob.xyz',
]

const HANGUL_RE = /[가-힣]/
// 한글이 아니면서 라틴 문자가 아닌 문자 체계(키릴, 그리스, 한자, 일본어 가나, 아랍, 태국 등)
const OTHER_SCRIPT_RE = /[Ѐ-ӿͰ-Ͽ一-鿿぀-ヿ؀-ۿ฀-๿]/

function wordCount(text) {
  return text.trim().split(/\s+/).filter(Boolean).length
}

// 입력이 짧은 단어/구인데 결과가 훨씬 길면, 관련 없는 여러 문장 조각을 이어붙인 것으로 의심하고
// 신뢰하지 않는다 (예: "dugout" 하나를 검색했는데 야구장 관련 문장 여러 개가 이어붙어 나오는 경우)
function looksLikeGarbledConcat(original, translated) {
  const inputWords = wordCount(original)
  const outputWords = wordCount(translated)
  if (inputWords <= 2 && outputWords >= 6) return true
  if (outputWords > inputWords * 4 + 4) return true
  return false
}

function isReliableTranslation(original, translated, targetLang) {
  if (!translated || !translated.trim()) return false
  if (targetLang === 'ko' && !HANGUL_RE.test(translated)) return false
  if (targetLang === 'en' && (HANGUL_RE.test(translated) || OTHER_SCRIPT_RE.test(translated))) return false
  if (looksLikeGarbledConcat(original, translated)) return false
  return true
}

async function fetchWithTimeout(url, timeoutMs = 6000) {
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
    const translated = data?.translation?.trim()
    if (!isReliableTranslation(text, translated, targetLang)) throw new Error('lingva unreliable result')
    return translated
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
  if (looksLikeQuotaWarning(translated)) return null
  if (!isReliableTranslation(text, translated, targetLang)) return null
  return translated
}

// { text, engine } 을 반환합니다. engine 은 'lingva' | 'mymemory' — 결과가 이상할 때
// 화면에 작게 표시해서, 어떤 번역 엔진이 답했는지 캡처해 보내주면 원인을 빠르게 찾을 수 있어요.
export async function translateText(text, sourcelang, targetLang) {
  const trimmed = text.trim()
  if (!trimmed) return null

  const fromLingva = await translateWithLingva(trimmed, sourcelang, targetLang)
  if (fromLingva) return { text: fromLingva, engine: 'lingva' }

  const fromMyMemory = await translateWithMyMemory(trimmed, sourcelang, targetLang)
  if (fromMyMemory) return { text: fromMyMemory, engine: 'mymemory' }

  throw new Error('지금은 정확한 번역을 찾지 못했어요. 잠시 후 다시 시도해주세요.')
}
