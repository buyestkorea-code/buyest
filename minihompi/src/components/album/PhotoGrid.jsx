import { publicUrl } from '../../lib/storage.js'
import EmptyState from '../common/EmptyState.jsx'

export default function PhotoGrid({ photos, onOpen }) {
  if (photos.length === 0) {
    return <EmptyState message="아직 사진이 없어요! 사진을 올려보세요." />
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
      {photos.map((p) => (
        <button
          key={p.id}
          onClick={() => onOpen(p)}
          style={{ padding: 0, border: 'none', borderRadius: 10, overflow: 'hidden', aspectRatio: '1', background: '#eee' }}
        >
          <img src={publicUrl('photos', p.thumb_path)} alt={p.caption || '사진'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </button>
      ))}
    </div>
  )
}
