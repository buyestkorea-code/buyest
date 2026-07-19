import EmptyState from '../common/EmptyState.jsx'

export default function GuestbookList({ entries, onDelete }) {
  if (entries.length === 0) {
    return <EmptyState message="아직 방명록이 없어요! 첫 메시지를 남겨보세요." />
  }

  return (
    <div className="stack">
      {entries.map((e) => (
        <div key={e.id} className="card">
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <strong>{e.author_name}</strong>
            <button className="btn btn-ghost" style={{ minHeight: 28, padding: '4px 8px', fontSize: 11 }} onClick={() => onDelete(e.id)}>
              🗑️
            </button>
          </div>
          <p style={{ margin: '6px 0 0', fontSize: 14 }}>{e.message}</p>
          <p style={{ margin: '4px 0 0', fontSize: 10, opacity: 0.5 }}>{new Date(e.created_at).toLocaleString('ko-KR')}</p>
        </div>
      ))}
    </div>
  )
}
