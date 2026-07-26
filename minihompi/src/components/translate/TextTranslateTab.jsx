import { useState } from 'react'
import { translateText } from '../../lib/translate.js'
import { usePoints } from '../../contexts/PointsContext.jsx'

const WORD_POINTS = 3

export default function TextTranslateTab({ onSaveWord }) {
  const [direction, setDirection] = useState('ko-en') // ko-en | en-ko
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [saved, setSaved] = useState(false)
  const { award } = usePoints()

  async function handleTranslate() {
    if (!input.trim()) return
    setLoading(true)
    setError(null)
    setSaved(false)
    try {
      const [source, target] = direction === 'ko-en' ? ['ko', 'en'] : ['en', 'ko']
      const translated = await translateText(input, source, target)
      setResult(translated)
    } catch (e) {
      setError('번역에 실패했어요. 인터넷 연결을 확인해주세요.')
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    if (!result) return
    const wordEn = direction === 'ko-en' ? result : input
    const wordKo = direction === 'ko-en' ? input : result
    const { isNew } = await onSaveWord(wordEn, wordKo, 'text')
    setSaved(true)
    if (isNew) await award(WORD_POINTS, '새 단어 저장', 'vocab')
  }

  return (
    <div className="stack">
      <div className="row">
        <button
          className="btn"
          style={{ flex: 1, background: direction === 'ko-en' ? 'var(--color-pink)' : '#f8f4ea' }}
          onClick={() => { setDirection('ko-en'); setResult(null) }}
        >
          한국어 → 영어
        </button>
        <button
          className="btn"
          style={{ flex: 1, background: direction === 'en-ko' ? 'var(--color-pink)' : '#f8f4ea' }}
          onClick={() => { setDirection('en-ko'); setResult(null) }}
        >
          영어 → 한국어
        </button>
      </div>

      <textarea
        placeholder={direction === 'ko-en' ? '번역할 한국어를 입력하세요' : 'Type English to translate'}
        value={input}
        onChange={(e) => { setInput(e.target.value); setResult(null) }}
      />

      <button className="btn btn-block" onClick={handleTranslate} disabled={loading || !input.trim()}>
        {loading ? '번역 중...' : '번역하기'}
      </button>

      {error && <p style={{ color: '#e64545', fontSize: 13 }}>{error}</p>}

      {result && (
        <div className="card stack">
          <p style={{ fontSize: 12, opacity: 0.6, margin: 0 }}>번역 결과</p>
          <p style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>{result}</p>
          <button className="btn btn-secondary" onClick={handleSave} disabled={saved}>
            {saved ? '단어장에 저장됨 ✅' : '📔 단어장에 저장하고 포인트 받기'}
          </button>
        </div>
      )}
    </div>
  )
}
