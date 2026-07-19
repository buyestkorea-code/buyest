import { useRef, useState } from 'react'
import DraggableItem from './DraggableItem.jsx'
import EmptyState from '../common/EmptyState.jsx'

export default function RoomCanvas({ placedItems, onUpdatePosition, onRemove }) {
  const canvasRef = useRef(null)
  const [selectedId, setSelectedId] = useState(null)

  return (
    <div className="stack">
      <div
        ref={canvasRef}
        style={{
          position: 'relative', width: '100%', aspectRatio: '4 / 5', borderRadius: 18,
          background: 'linear-gradient(to bottom, #fff3e0 0%, #fff3e0 65%, #e8d4b8 65%, #e8d4b8 100%)',
          border: '3px solid var(--color-peach)', overflow: 'hidden',
        }}
        onClick={() => setSelectedId(null)}
      >
        {placedItems.map((p) => (
          <DraggableItem
            key={p.inventory_id}
            placed={p}
            canvasRef={canvasRef}
            selected={selectedId === p.inventory_id}
            onTap={(id) => setSelectedId((prev) => (prev === id ? null : id))}
            onDragEnd={onUpdatePosition}
          />
        ))}
        {placedItems.length === 0 && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.5, fontSize: 13 }}>
            방이 비어있어요. 상점에서 아이템을 사서 꾸며보세요!
          </div>
        )}
      </div>
      {selectedId && (
        <button className="btn btn-block btn-ghost" onClick={() => { onRemove(selectedId); setSelectedId(null) }}>
          📦 선택한 아이템 보관함으로 넣기
        </button>
      )}
    </div>
  )
}
