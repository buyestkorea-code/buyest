import { useMemo, useRef, useState } from 'react'
import { useVocabWords } from '../../hooks/useVocabWords.js'
import { usePoints } from '../../contexts/PointsContext.jsx'
import { FALLBACK_WORDS } from '../../data/vocabWords.js'
import LoadingScreen from '../common/LoadingScreen.jsx'

const ROUND_LENGTH = 8

const MODES = [
  { key: 'mixed', emoji: '🔀', label: '랜덤 섞어서', desc: '영어와 한글 뜻이 랜덤으로 섞여서 나와요' },
  { key: 'en-ko', emoji: '🇰🇷', label: '한글 뜻 퀴즈', desc: '영어 단어를 보고 한글 뜻을 맞혀요' },
  { key: 'ko-en', emoji: '🇺🇸', label: '영어 단어 퀴즈', desc: '한글 뜻을 보고 영어 단어를 맞혀요' },
]

function shuffle(arr) {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function buildQuestions(pool, mode) {
  const questions = []
  for (let i = 0; i < ROUND_LENGTH; i++) {
    const correct = pool[Math.floor(Math.random() * pool.length)]
    const direction = mode === 'mixed' ? (Math.random() < 0.5 ? 'en-ko' : 'ko-en') : mode
    const prompt = direction === 'en-ko' ? correct.word_en : correct.word_ko
    const answerField = direction === 'en-ko' ? 'word_ko' : 'word_en'
    const distractors = shuffle(pool.filter((w) => w.word_en !== correct.word_en)).slice(0, 3)
    const choices = shuffle([correct, ...distractors].map((w) => w[answerField]))
    questions.push({ prompt, direction, correctAnswer: correct[answerField], choices })
  }
  return questions
}

function rewardForScore(score) {
  return Math.max(3, Math.round((score / ROUND_LENGTH) * 20))
}

export default function WordQuizGame({ onBack }) {
  const { words, loading } = useVocabWords()
  const { award } = usePoints()
  const [mode, setMode] = useState(null)
  const [questions, setQuestions] = useState(null)
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState(null)
  const [finished, setFinished] = useState(false)
  const awardedRef = useRef(false)

  const pool = useMemo(() => {
    const seen = new Set(FALLBACK_WORDS.map((w) => w.word_en))
    const merged = [...FALLBACK_WORDS]
    for (const w of words) {
      if (!seen.has(w.word_en)) {
        seen.add(w.word_en)
        merged.push(w)
      }
    }
    return merged
  }, [words])

  function start(selectedMode) {
    setMode(selectedMode)
    setQuestions(buildQuestions(pool, selectedMode))
    setIndex(0)
    setScore(0)
    setSelected(null)
    setFinished(false)
    awardedRef.current = false
  }

  function handleChoice(choice) {
    if (selected) return
    setSelected(choice)
    const correct = choice === questions[index].correctAnswer
    if (correct) setScore((s) => s + 1)

    setTimeout(() => {
      if (index + 1 >= ROUND_LENGTH) {
        setFinished(true)
        if (!awardedRef.current) {
          awardedRef.current = true
          const modeLabel = MODES.find((m) => m.key === mode)?.label || '영어 단어 퀴즈'
          award(rewardForScore(score + (correct ? 1 : 0)), `영어 단어 퀴즈 (${modeLabel})`, 'game_wordquiz')
        }
      } else {
        setIndex((i) => i + 1)
        setSelected(null)
      }
    }, 700)
  }

  if (loading) return <LoadingScreen />

  if (!mode) {
    return (
      <div className="page stack">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <button className="btn btn-ghost" onClick={onBack}>◀ 목록으로</button>
        </div>
        <h2 className="page-title">📚 영어 단어 퀴즈</h2>
        <p style={{ fontSize: 12, opacity: 0.6 }}>단어장에 저장한 단어 + 기본 단어 {pool.length}개로 퀴즈를 풀어요</p>
        <div className="stack">
          {MODES.map((m) => (
            <button key={m.key} className="card row" style={{ width: '100%', border: 'none', cursor: 'pointer', textAlign: 'left' }} onClick={() => start(m.key)}>
              <span style={{ fontSize: 30 }}>{m.emoji}</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: 16 }}>{m.label}</div>
                <div style={{ fontSize: 12, opacity: 0.6 }}>{m.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="page stack">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <button className="btn btn-ghost" onClick={() => setMode(null)}>◀ 모드 선택</button>
        {!finished && <span className="pill">{index + 1} / {ROUND_LENGTH}</span>}
      </div>
      <h2 className="page-title">📚 {MODES.find((m) => m.key === mode)?.label}</h2>

      {!finished ? (
        <div className="card stack" style={{ alignItems: 'center' }}>
          <p style={{ fontSize: 12, opacity: 0.6 }}>{questions[index].direction === 'en-ko' ? '이 단어의 뜻은?' : '이 뜻의 영어 단어는?'}</p>
          <p style={{ fontSize: 28, fontWeight: 800 }}>{questions[index].prompt}</p>
          <div className="stack" style={{ width: '100%' }}>
            {questions[index].choices.map((choice) => {
              const isCorrect = choice === questions[index].correctAnswer
              const isSelected = choice === selected
              let background = '#f8f4ea'
              if (selected) {
                if (isCorrect) background = '#c8f4e0'
                else if (isSelected) background = '#ffd6d6'
              }
              return (
                <button key={choice} className="btn btn-block" style={{ background }} onClick={() => handleChoice(choice)} disabled={Boolean(selected)}>
                  {choice}
                </button>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="card stack" style={{ alignItems: 'center' }}>
          <p style={{ fontWeight: 800, fontSize: 18 }}>🎉 {ROUND_LENGTH}문제 중 {score}개 맞췄어요!</p>
          <div className="row">
            <button className="btn btn-ghost" onClick={() => setMode(null)}>다른 모드</button>
            <button className="btn" onClick={() => start(mode)}>다시하기</button>
          </div>
        </div>
      )}
    </div>
  )
}
