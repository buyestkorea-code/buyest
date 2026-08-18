import { useState } from 'react'
import Game2048 from '../components/games/Game2048.jsx'
import MemoryGame from '../components/games/MemoryGame.jsx'
import DodgeGame from '../components/games/DodgeGame.jsx'
import WordQuizGame from '../components/games/WordQuizGame.jsx'
import KnowledgeQuizGame from '../components/games/KnowledgeQuizGame.jsx'
import WhackAMoleGame from '../components/games/WhackAMoleGame.jsx'
import FruitCatchGame from '../components/games/FruitCatchGame.jsx'

const GAMES = [
  { key: '2048', emoji: '🔢', label: '2048', desc: '같은 숫자를 합쳐서 2048을 만들어보세요' },
  { key: 'memory', emoji: '🃏', label: '카드 짝맞추기', desc: '카드를 뒤집어서 같은 그림을 찾아보세요' },
  { key: 'dodge', emoji: '🏃', label: '장애물 피하기', desc: '탭해서 점프! 장애물을 피해 오래 버텨보세요' },
  { key: 'mole', emoji: '🔨', label: '두더지 잡기', desc: '30초 동안 튀어나오는 두더지를 잡아보세요' },
  { key: 'fruit', emoji: '🧺', label: '과일 받기', desc: '바구니를 움직여 떨어지는 과일을 받아보세요' },
  { key: 'wordquiz', emoji: '📚', label: '영어 단어 퀴즈', desc: '번역기에서 배운 단어로 퀴즈를 풀어보세요' },
  { key: 'knowledge', emoji: '🧠', label: '역사·경제·넌센스 퀴즈', desc: '초등학생 수준 상식 퀴즈를 풀어보세요' },
]

export default function GamesPage() {
  const [activeGame, setActiveGame] = useState(null)

  if (activeGame === '2048') return <Game2048 onBack={() => setActiveGame(null)} />
  if (activeGame === 'memory') return <MemoryGame onBack={() => setActiveGame(null)} />
  if (activeGame === 'dodge') return <DodgeGame onBack={() => setActiveGame(null)} />
  if (activeGame === 'mole') return <WhackAMoleGame onBack={() => setActiveGame(null)} />
  if (activeGame === 'fruit') return <FruitCatchGame onBack={() => setActiveGame(null)} />
  if (activeGame === 'wordquiz') return <WordQuizGame onBack={() => setActiveGame(null)} />
  if (activeGame === 'knowledge') return <KnowledgeQuizGame onBack={() => setActiveGame(null)} />

  return (
    <div className="page stack">
      <h2 className="page-title">🎮 미니게임</h2>
      <div className="stack">
        {GAMES.map((g) => (
          <button
            key={g.key}
            className="card row"
            style={{ textAlign: 'left', border: 'none', width: '100%', cursor: 'pointer' }}
            onClick={() => setActiveGame(g.key)}
          >
            <span style={{ fontSize: 36 }}>{g.emoji}</span>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16 }}>{g.label}</div>
              <div style={{ fontSize: 12, opacity: 0.6 }}>{g.desc}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
