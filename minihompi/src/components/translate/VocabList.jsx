import EmptyState from '../common/EmptyState.jsx'

export default function VocabList({ words }) {
  if (words.length === 0) {
    return <EmptyState message="아직 저장한 단어가 없어요! 번역하고 단어장에 저장해보세요." />
  }

  return (
    <div className="card">
      <h3 style={{ fontSize: 14, marginBottom: 8 }}>📔 내 단어장 ({words.length}개)</h3>
      <div className="row-wrap">
        {words.slice(0, 20).map((w) => (
          <span key={w.id} className="pill" style={{ fontSize: 12 }}>
            {w.word_en} · {w.word_ko}
          </span>
        ))}
      </div>
    </div>
  )
}
