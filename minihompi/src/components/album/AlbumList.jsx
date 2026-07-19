import { useState } from 'react'
import EmptyState from '../common/EmptyState.jsx'

export default function AlbumList({ albums, onSelect, onCreate, onDelete }) {
  const [newName, setNewName] = useState('')

  async function handleCreate() {
    if (!newName.trim()) return
    await onCreate(newName.trim())
    setNewName('')
  }

  return (
    <div className="stack">
      <div className="card row">
        <input type="text" placeholder="새 앨범 이름 (예: 여름방학)" value={newName} onChange={(e) => setNewName(e.target.value)} />
        <button className="btn" onClick={handleCreate}>➕ 만들기</button>
      </div>

      {albums.length === 0 && <EmptyState message="아직 앨범이 없어요! 앨범을 만들어보세요." />}

      <div className="stack">
        {albums.map((a) => (
          <div key={a.id} className="card row" style={{ justifyContent: 'space-between' }}>
            <button onClick={() => onSelect(a.id)} style={{ flex: 1, textAlign: 'left', background: 'none', border: 'none', fontSize: 16, fontWeight: 700, padding: 8 }}>
              📁 {a.name}
            </button>
            <button className="btn btn-ghost" style={{ minHeight: 36, padding: '6px 10px', fontSize: 12 }} onClick={() => onDelete(a.id)}>
              🗑️
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
