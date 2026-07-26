// MyMemory 무료 번역 API (키 발급 불필요, CORS 지원)
export async function translateText(text, sourcelang, targetLang) {
  const trimmed = text.trim()
  if (!trimmed) return null
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(trimmed)}&langpair=${sourcelang}|${targetLang}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('번역 요청에 실패했어요')
  const data = await res.json()
  const translated = data?.responseData?.translatedText
  if (!translated) throw new Error('번역 결과를 받지 못했어요')
  return translated
}
