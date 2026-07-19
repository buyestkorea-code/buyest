import { useMemos } from '../hooks/useMemos.js'
import { usePoints } from '../contexts/PointsContext.jsx'
import MemoBoard from '../components/memo/MemoBoard.jsx'
import LoadingScreen from '../components/common/LoadingScreen.jsx'

const MEMO_COLORS = ['#ffe9b0', '#ffd6e8', '#c8f4e0', '#cfeeff', '#e6dcff']
const MEMO_POINTS = 5

export default function MemoPage() {
  const { memos, loading, createMemo, updatePosition, updateContent, deleteMemo } = useMemos()
  const { award } = usePoints()

  async function handleCreate(color) {
    const memo = await createMemo(color)
    if (memo) await award(MEMO_POINTS, '메모 작성', 'memo')
  }

  if (loading) return <LoadingScreen />

  return (
    <div className="page stack">
      <h2 className="page-title">📝 메모장</h2>
      <div className="card row-wrap">
        {MEMO_COLORS.map((c) => (
          <button key={c} className="btn" style={{ background: c, minWidth: 44 }} onClick={() => handleCreate(c)}>
            ➕
          </button>
        ))}
      </div>
      <MemoBoard memos={memos} onUpdatePosition={updatePosition} onContentChange={updateContent} onDelete={deleteMemo} />
    </div>
  )
}
