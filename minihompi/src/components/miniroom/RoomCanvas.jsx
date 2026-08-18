import { useRef, useState } from 'react'
import DraggableItem from './DraggableItem.jsx'
import RoomBackdrop from './RoomBackdrop.jsx'
import RoomCharacter from './RoomCharacter.jsx'

export default function RoomCanvas({ placedItems, onUpdatePosition, onRotate, onBringToFront, onSendToBack, onRemove, character, wallpaper, floor }) {
  const canvasRef = useRef(null)
  const [selectedId, setSelectedId] = useState(null)

  return (
    <div className="stack">
      <div
        ref={canvasRef}
        style={{
          position: 'relative', width: '100%', aspectRatio: '4 / 5', borderRadius: 18,
          overflow: 'hidden', boxShadow: '0 6px 18px rgba(91,70,54,0.18)',
          border: '3px solid #c9a877',
        }}
        onClick={() => setSelectedId(null)}
      >
        <RoomBackdrop wallpaper={wallpaper} floor={floor} />
        {character && <RoomCharacter {...character} />}
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
        <div className="stack">
          <div className="row">
            <button className="btn" style={{ flex: 1 }} onClick={() => onRotate(selectedId)}>🔄 회전</button>
            <button className="btn" style={{ flex: 1 }} onClick={() => onBringToFront(selectedId)}>⬆️ 앞으로</button>
            <button className="btn" style={{ flex: 1 }} onClick={() => onSendToBack(selectedId)}>⬇️ 뒤로</button>
          </div>
          <button className="btn btn-block btn-ghost" onClick={() => { onRemove(selectedId); setSelectedId(null) }}>
            📦 선택한 아이템 보관함으로 넣기
          </button>
        </div>
      )}
    </div>
  )
}
