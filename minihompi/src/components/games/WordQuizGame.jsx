import { useMemo, useRef, useState } from 'react'
import { useVocabWords } from '../../hooks/useVocabWords.js'
import { usePoints } from '../../contexts/PointsContext.jsx'
import LoadingScreen from '../common/LoadingScreen.jsx'

const FALLBACK_WORDS = [
  { word_en: 'apple', word_ko: '사과' },
  { word_en: 'banana', word_ko: '바나나' },
  { word_en: 'dog', word_ko: '강아지' },
  { word_en: 'cat', word_ko: '고양이' },
  { word_en: 'book', word_ko: '책' },
  { word_en: 'water', word_ko: '물' },
  { word_en: 'school', word_ko: '학교' },
  { word_en: 'friend', word_ko: '친구' },
  { word_en: 'happy', word_ko: '행복한' },
  { word_en: 'family', word_ko: '가족' },
  { word_en: 'sun', word_ko: '해' },
  { word_en: 'moon', word_ko: '달' },
  { word_en: 'star', word_ko: '별' },
  { word_en: 'tree', word_ko: '나무' },
  { word_en: 'flower', word_ko: '꽃' },
  { word_en: 'house', word_ko: '집' },
  { word_en: 'love', word_ko: '사랑' },
  { word_en: 'run', word_ko: '달리다' },
  { word_en: 'jump', word_ko: '점프하다' },
  { word_en: 'red', word_ko: '빨간색' },
  { word_en: 'blue', word_ko: '파란색' },
]

const ROUND_LENGTH = 8

function shuffle(arr) {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function buildQuestions(pool) {
  const questions = []
  for (let i = 0; i < ROUND_LENGTH; i++) {
    const correct = pool[Math.floor(Math.random() * pool.length)]
    const direction = Math.random() < 0.5 ? 'en-ko' : 'ko-en'
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

  function start() {
    setQuestions(buildQuestions(pool))
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
          award(rewardForScore(score + (correct ? 1 : 0)), '영어 단어 퀴즈', 'game_wordquiz')
        }
      } else {
        setIndex((i) => i + 1)
        setSelected(null)
      }
    }, 700)
  }

  if (loading) return <LoadingScreen />

  return (
    <div className="page stack">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <button className="btn btn-ghost" onClick={onBack}>◀ 목록으로</button>
        {questions && !finished && <span className="pill">{index + 1} / {ROUND_LENGTH}</span>}
      </div>
      <h2 className="page-title">📚 영어 단어 퀴즈</h2>

      {!questions && (
        <div className="card stack" style={{ alignItems: 'center' }}>
          <p style={{ opacity: 0.7 }}>단어장에 저장한 단어 + 기본 단어로 퀴즈를 풀어요</p>
          <button className="btn" onClick={start}>시작하기</button>
        </div>
      )}

      {questions && !finished && (
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
      )}

      {finished && (
        <div className="card stack" style={{ alignItems: 'center' }}>
          <p style={{ fontWeight: 800, fontSize: 18 }}>🎉 {ROUND_LENGTH}문제 중 {score}개 맞췄어요!</p>
          <button className="btn" onClick={start}>다시하기</button>
        </div>
      )}
    </div>
  )
}
