import { useState } from 'react'
import { motion } from 'framer-motion'

export default function MemoNote({ memo, boardRef, onDragEnd, onContentChange, onDelete }) {
  const [content, setContent] = useState(memo.content)

  return (
    <motion.div
      drag
      dragConstraints={boardRef}
      dragMomentum={false}
      initial={false}
      style={{
        position: 'absolute', left: `${memo.x}%`, top: `${memo.y}%`,
        width: 130, minHeight: 130, background: memo.color, borderRadius: 6,
        boxShadow: '0 6px 14px rgba(0,0,0,0.15)', padding: 8, touchAction: 'none',
      }}
      onDragEnd={(e, info) => {
        const board = boardRef.current
        if (!board) return
        const rect = board.getBoundingClientRect()
        const x = Math.min(80, Math.max(0, ((info.point.x - rect.left) / rect.width) * 100))
        const y = Math.min(80, Math.max(0, ((info.point.y - rect.top) / rect.height) * 100))
        onDragEnd(memo.id, x, y)
      }}
    >
      <button
        onClick={() => onDelete(memo.id)}
        style={{ position: 'absolute', top: 2, right: 4, border: 'none', background: 'none', fontSize: 14, cursor: 'pointer' }}
        aria-label="메모 삭제"
      >
        ✕
      </button>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onBlur={() => onContentChange(memo.id, content)}
        placeholder="메모를 적어보세요"
        style={{
          width: '100%', height: 100, border: 'none', background: 'transparent', resize: 'none',
          fontSize: 13, fontFamily: 'inherit', minHeight: 100,
        }}
      />
    </motion.div>
  )
}
