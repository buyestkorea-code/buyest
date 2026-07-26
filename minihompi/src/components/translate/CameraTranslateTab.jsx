import { useRef, useState } from 'react'
import { recognizeEnglishText } from '../../lib/ocr.js'
import { translateText } from '../../lib/translate.js'
import { usePoints } from '../../contexts/PointsContext.jsx'

const WORD_POINTS = 3

export default function CameraTranslateTab({ onSaveWord }) {
  const fileInputRef = useRef(null)
  const [photoUrl, setPhotoUrl] = useState(null)
  const [status, setStatus] = useState('idle') // idle | recognizing | translating | done
  const [recognized, setRecognized] = useState('')
  const [translated, setTranslated] = useState('')
  const [error, setError] = useState(null)
  const [saved, setSaved] = useState(false)
  const { award } = usePoints()

  async function handleFile(file) {
    if (!file) return
    setError(null)
    setSaved(false)
    setRecognized('')
    setTranslated('')
    setPhotoUrl(URL.createObjectURL(file))

    try {
      setStatus('recognizing')
      const text = await recognizeEnglishText(file)
      const firstWord = text.split(/\s+/).filter(Boolean)[0] || ''
      if (!firstWord) {
        setError('글자를 못 찾았어요. 더 또렷하게 찍어보세요!')
        setStatus('idle')
        return
      }
      setRecognized(firstWord)

      setStatus('translating')
      const result = await translateText(firstWord, 'en', 'ko')
      setTranslated(result)
      setStatus('done')
    } catch (e) {
      setError('인식이나 번역에 실패했어요. 다시 시도해보세요.')
      setStatus('idle')
    }
  }

  async function handleSave() {
    if (!recognized || !translated) return
    const { isNew } = await onSaveWord(recognized, translated, 'camera')
    setSaved(true)
    if (isNew) await award(WORD_POINTS, '새 단어 저장 (카메라)', 'vocab')
  }

  return (
    <div className="stack">
      <p style={{ fontSize: 12, opacity: 0.6 }}>영어 단어를 또렷하게 찍으면 인식해서 번역해줘요</p>

      <button className="btn btn-block" onClick={() => fileInputRef.current?.click()}>
        📷 사진 찍기
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        hidden
        onChange={(e) => handleFile(e.target.files[0])}
      />

      {photoUrl && (
        <img src={photoUrl} alt="촬영한 사진" style={{ width: '100%', borderRadius: 12, maxHeight: 240, objectFit: 'contain', background: '#000' }} />
      )}

      {status === 'recognizing' && <p className="pill">🔍 글자 인식 중...</p>}
      {status === 'translating' && <p className="pill">🌐 번역 중...</p>}
      {error && <p style={{ color: '#e64545', fontSize: 13 }}>{error}</p>}

      {status === 'done' && (
        <div className="card stack">
          <p style={{ fontSize: 12, opacity: 0.6, margin: 0 }}>인식한 단어</p>
          <p style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>{recognized}</p>
          <p style={{ fontSize: 12, opacity: 0.6, margin: 0 }}>번역 결과</p>
          <p style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>{translated}</p>
          <button className="btn btn-secondary" onClick={handleSave} disabled={saved}>
            {saved ? '단어장에 저장됨 ✅' : '📔 단어장에 저장하고 포인트 받기'}
          </button>
        </div>
      )}
    </div>
  )
}
