import { useRef, useState } from 'react'
import { useEncyclopedia } from '../hooks/useEncyclopedia.js'
import { usePoints } from '../contexts/PointsContext.jsx'
import { isSupabaseConfigured } from '../lib/supabaseClient.js'
import { uploadToBucket, publicUrl } from '../lib/storage.js'
import DoodlePad from '../components/diary/DoodlePad.jsx'
import LoadingScreen from '../components/common/LoadingScreen.jsx'

const ENCYCLOPEDIA_POINTS = 10

const DEFAULT_CATEGORIES = [
  { key: '과일', emoji: '🍎' },
  { key: '동물', emoji: '🐾' },
  { key: '곤충', emoji: '🐛' },
  { key: '식물', emoji: '🌿' },
  { key: '우주', emoji: '🪐' },
  { key: '기타', emoji: '📘' },
]

function categoryEmoji(category, knownCategories) {
  const known = knownCategories.find((c) => c.key === category)
  return known?.emoji || '📘'
}

export default function EncyclopediaPage() {
  const { entries, loading, addEntry, deleteEntry } = useEncyclopedia()
  const { award } = usePoints()
  const [adding, setAdding] = useState(false)
  const [category, setCategory] = useState('과일')
  const [customCategory, setCustomCategory] = useState('')
  const [name, setName] = useState('')
  const [details, setDetails] = useState('')
  const [saving, setSaving] = useState(false)
  const doodleRef = useRef(null)

  const usedCategories = [...new Set(entries.map((e) => e.category))]
  const allCategories = [
    ...DEFAULT_CATEGORIES,
    ...usedCategories.filter((c) => !DEFAULT_CATEGORIES.some((d) => d.key === c)).map((c) => ({ key: c, emoji: '📘' })),
  ]

  async function handleSave() {
    const finalCategory = (customCategory.trim() || category).trim()
    if (!name.trim() || !finalCategory) return
    setSaving(true)
    try {
      let doodlePath = null
      if (doodleRef.current && isSupabaseConfigured) {
        const blob = await doodleRef.current.toBlob()
        if (blob) {
          const path = `encyclopedia-${Date.now()}.png`
          await uploadToBucket('doodles', path, blob, 'image/png')
          doodlePath = path
        }
      }
      const entry = await addEntry(finalCategory, name.trim(), details.trim(), doodlePath)
      if (entry) await award(ENCYCLOPEDIA_POINTS, `도감 등록: ${entry.name}`, 'encyclopedia')
      setName('')
      setDetails('')
      setCustomCategory('')
      doodleRef.current?.clear()
      setAdding(false)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingScreen />

  const grouped = allCategories
    .map((c) => ({ ...c, items: entries.filter((e) => e.category === c.key) }))
    .filter((c) => c.items.length > 0 || DEFAULT_CATEGORIES.some((d) => d.key === c.key))

  return (
    <div className="page stack">
      <h2 className="page-title">📖 도감</h2>
      <p style={{ fontSize: 12, opacity: 0.6, marginTop: -8 }}>직접 관찰하고 그린 걸 번호를 매겨서 모아보세요!</p>

      {!adding ? (
        <button className="btn btn-block" onClick={() => setAdding(true)}>➕ 새 항목 등록하기</button>
      ) : (
        <div className="card stack">
          <p style={{ fontSize: 12, opacity: 0.6 }}>카테고리</p>
          <div className="row-wrap">
            {DEFAULT_CATEGORIES.map((c) => (
              <button
                key={c.key}
                className="btn"
                style={{ fontSize: 13, background: category === c.key && !customCategory ? 'var(--color-pink)' : '#f8f4ea' }}
                onClick={() => { setCategory(c.key); setCustomCategory('') }}
              >
                {c.emoji} {c.key}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="또는 새 카테고리 직접 입력 (예: 공룡)"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
          />

          <input type="text" placeholder="이름 (예: 사과)" value={name} onChange={(e) => setName(e.target.value)} />
          <textarea
            placeholder={'특징을 자유롭게 적어보세요\n예) 제철: 9~11월\n색깔: 빨강\n느낌: 딱딱\n맛: 달콤'}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />

          <p style={{ fontSize: 12, opacity: 0.6 }}>🎨 직접 그려보세요</p>
          <DoodlePad ref={doodleRef} />

          <div className="row">
            <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setAdding(false)}>취소</button>
            <button className="btn" style={{ flex: 1 }} onClick={handleSave} disabled={saving || !name.trim()}>
              {saving ? '저장 중...' : '등록하고 포인트 받기'}
            </button>
          </div>
        </div>
      )}

      {grouped.map((g) => (
        <div key={g.key} className="stack">
          <h3 style={{ fontSize: 14 }}>{g.emoji} {g.key} ({g.items.length})</h3>
          {g.items.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', opacity: 0.5, fontSize: 12 }}>아직 등록한 항목이 없어요</div>
          ) : (
            <div className="stack">
              {g.items.map((entry) => (
                <EncyclopediaCard key={entry.id} entry={entry} onDelete={deleteEntry} />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function EncyclopediaCard({ entry, onDelete }) {
  const imageUrl = entry.doodle_path ? publicUrl('doodles', entry.doodle_path) : null
  return (
    <div className="card row" style={{ alignItems: 'flex-start' }}>
      {imageUrl ? (
        <img src={imageUrl} alt={entry.name} style={{ width: 72, height: 54, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }} />
      ) : (
        <div style={{ width: 72, height: 54, borderRadius: 10, background: '#f2ede3', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>📘</div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <strong style={{ fontSize: 14 }}>No.{entry.entry_no} {entry.name}</strong>
          <button className="btn btn-ghost" style={{ minHeight: 28, minWidth: 28, padding: 0, fontSize: 12 }} onClick={() => onDelete(entry.id)} aria-label="삭제">✕</button>
        </div>
        {entry.details && <p style={{ fontSize: 12, opacity: 0.7, whiteSpace: 'pre-wrap', marginTop: 4 }}>{entry.details}</p>}
      </div>
    </div>
  )
}
