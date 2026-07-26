import { useState } from 'react'
import { useVocabWords } from '../hooks/useVocabWords.js'
import TextTranslateTab from '../components/translate/TextTranslateTab.jsx'
import CameraTranslateTab from '../components/translate/CameraTranslateTab.jsx'
import VocabList from '../components/translate/VocabList.jsx'
import LoadingScreen from '../components/common/LoadingScreen.jsx'

export default function TranslatePage() {
  const { words, loading, saveWord } = useVocabWords()
  const [tab, setTab] = useState('text')

  if (loading) return <LoadingScreen />

  return (
    <div className="page stack">
      <h2 className="page-title">🌐 번역기</h2>

      <div className="row">
        <button className="btn" style={{ flex: 1, background: tab === 'text' ? 'var(--color-pink)' : '#f8f4ea' }} onClick={() => setTab('text')}>
          텍스트 번역
        </button>
        <button className="btn" style={{ flex: 1, background: tab === 'camera' ? 'var(--color-pink)' : '#f8f4ea' }} onClick={() => setTab('camera')}>
          카메라 번역
        </button>
      </div>

      {tab === 'text' ? <TextTranslateTab onSaveWord={saveWord} /> : <CameraTranslateTab onSaveWord={saveWord} />}

      <VocabList words={words} />
    </div>
  )
}
