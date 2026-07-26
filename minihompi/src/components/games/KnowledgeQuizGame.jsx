import { useRef, useState } from 'react'
import { usePoints } from '../../contexts/PointsContext.jsx'
import { QUIZ_CATEGORIES } from '../../data/knowledgeQuiz.js'

function shuffle(arr) {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function buildRound(bank) {
  const roundLength = Math.min(8, bank.length)
  const picked = shuffle(bank).slice(0, roundLength)
  return picked.map((item) => ({ q: item.q, correctAnswer: item.options[0], choices: shuffle(item.options) }))
}

function rewardForScore(score, total) {
  return Math.max(3, Math.round((score / total) * 20))
}

export default function KnowledgeQuizGame({ onBack }) {
  const { award } = usePoints()
  const [category, setCategory] = useState(null)
  const [questions, setQuestions] = useState(null)
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState(null)
  const [finished, setFinished] = useState(false)
  const awardedRef = useRef(false)

  function startCategory(cat) {
    setCategory(cat)
    setQuestions(buildRound(cat.questions))
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
      if (index + 1 >= questions.length) {
        setFinished(true)
        if (!awardedRef.current) {
          awardedRef.current = true
          award(rewardForScore(score + (correct ? 1 : 0), questions.length), `상식 퀴즈 (${category.label})`, 'game_knowledge')
        }
      } else {
        setIndex((i) => i + 1)
        setSelected(null)
      }
    }, 700)
  }

  if (!category) {
    return (
      <div className="page stack">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <button className="btn btn-ghost" onClick={onBack}>◀ 목록으로</button>
        </div>
        <h2 className="page-title">🧠 상식 퀴즈</h2>
        <div className="stack">
          {QUIZ_CATEGORIES.map((cat) => (
            <button key={cat.key} className="card row" style={{ width: '100%', border: 'none', cursor: 'pointer', textAlign: 'left' }} onClick={() => startCategory(cat)}>
              <span style={{ fontSize: 32 }}>{cat.emoji}</span>
              <div style={{ fontWeight: 800, fontSize: 16 }}>{cat.label} 퀴즈</div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="page stack">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <button className="btn btn-ghost" onClick={() => setCategory(null)}>◀ 카테고리</button>
        {!finished && <span className="pill">{index + 1} / {questions.length}</span>}
      </div>
      <h2 className="page-title">{category.emoji} {category.label} 퀴즈</h2>

      {!finished ? (
        <div className="card stack" style={{ alignItems: 'center' }}>
          <p style={{ fontSize: 18, fontWeight: 800, textAlign: 'center' }}>{questions[index].q}</p>
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
          <p style={{ fontWeight: 800, fontSize: 18 }}>🎉 {questions.length}문제 중 {score}개 맞췄어요!</p>
          <div className="row">
            <button className="btn btn-ghost" onClick={() => setCategory(null)}>다른 카테고리</button>
            <button className="btn" onClick={() => startCategory(category)}>다시하기</button>
          </div>
        </div>
      )}
    </div>
  )
}
