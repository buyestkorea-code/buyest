// MyMemory 무료 번역 API (키 발급 불필요, CORS 지원)
// 주의: MyMemory 는 짧은 단어에 대해 요청한 언어쌍과 다른 언어의 번역 기억(TM) 데이터를
// 잘못 매칭해서 돌려주는 경우가 있어(예: 한국어→영어 요청인데 스페인어 결과가 오는 경우).
// 그래서 matches 배열에서 실제로 요청한 언어쌍과 정확히 일치하는 항목만 신뢰하고,
// 없을 때만 최상단 결과로 대체한다.
function pickReliableMatch(data, sourcelang, targetLang) {
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

export async function translateText(text, sourcelang, targetLang) {
  const trimmed = text.trim()
  if (!trimmed) return null
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(trimmed)}&langpair=${sourcelang}|${targetLang}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('번역 요청에 실패했어요')
  const data = await res.json()
  const translated = pickReliableMatch(data, sourcelang, targetLang) || data?.responseData?.translatedText
  if (!translated) throw new Error('번역 결과를 받지 못했어요')
  return translated
}
