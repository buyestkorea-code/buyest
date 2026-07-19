import { useState } from 'react'
import { publicUrl } from '../../lib/storage.js'

export default function PhotoViewerModal({ photo, onClose, onUpdateCaption, onDelete }) {
  const [caption, setCaption] = useState(photo.caption || '')

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 150, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 16 }}
    >
      <div onClick={(e) => e.stopPropagation()} className="stack" style={{ width: '100%', maxWidth: 420 }}>
        <img src={publicUrl('photos', photo.storage_path)} alt={photo.caption || '사진'} style={{ width: '100%', borderRadius: 12, maxHeight: '65vh', objectFit: 'contain', background: '#000' }} />
        <div className="card row">
          <input
            type="text"
            placeholder="한 줄 설명을 남겨보세요"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            onBlur={() => onUpdateCaption(photo.id, caption)}
          />
        </div>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <button className="btn btn-secondary" onClick={onClose}>닫기</button>
          <button className="btn btn-ghost" onClick={() => { onDelete(photo.id); onClose() }}>🗑️ 삭제</button>
        </div>
      </div>
    </div>
  )
}
