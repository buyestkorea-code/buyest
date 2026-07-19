import { useRef } from 'react'
import MemoNote from './MemoNote.jsx'
import EmptyState from '../common/EmptyState.jsx'

export default function MemoBoard({ memos, onUpdatePosition, onContentChange, onDelete }) {
  const boardRef = useRef(null)

  return (
    <div
      ref={boardRef}
      style={{
        position: 'relative', width: '100%', minHeight: '55vh', borderRadius: 18,
        background: 'repeating-linear-gradient(45deg, #fdf6e9, #fdf6e9 10px, #f9efd8 10px, #f9efd8 20px)',
        border: '3px solid var(--color-yellow)', overflow: 'hidden',
      }}
    >
      {memos.length === 0 && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <EmptyState message="아래 버튼으로 메모지를 붙여보세요!" />
        </div>
      )}
      {memos.map((memo) => (
        <MemoNote key={memo.id} memo={memo} boardRef={boardRef} onDragEnd={onUpdatePosition} onContentChange={onContentChange} onDelete={onDelete} />
      ))}
    </div>
  )
}
