import { useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient.js'

const FIELDS = [
  { key: 'nickname', label: '별명' },
  { key: 'school', label: '학교' },
  { key: 'grade', label: '학년' },
  { key: 'class_no', label: '반' },
  { key: 'student_no', label: '번호' },
]

export default function ProfileForm({ profile, onProfileChange }) {
  const [draft, setDraft] = useState(profile)

  useEffect(() => setDraft(profile), [profile])

  async function saveField(key, value) {
    onProfileChange({ ...profile, [key]: value })
    if (isSupabaseConfigured) {
      await supabase.from('profile').update({ [key]: value }).eq('id', 1)
    }
  }

  async function saveFavorite(index, value) {
    const nextFavorites = [...(profile.favorites || ['', '', ''])]
    nextFavorites[index] = value
    onProfileChange({ ...profile, favorites: nextFavorites })
    if (isSupabaseConfigured) {
      await supabase.from('profile').update({ favorites: nextFavorites }).eq('id', 1)
    }
  }

  return (
    <div className="card stack">
      <h3 style={{ fontSize: 14 }}>🪪 내 정보</h3>
      {FIELDS.map(({ key, label }) => (
        <label key={key} className="stack" style={{ gap: 4 }}>
          <span style={{ fontSize: 12, opacity: 0.6 }}>{label}</span>
          <input
            type="text"
            value={draft?.[key] || ''}
            onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
            onBlur={(e) => saveField(key, e.target.value)}
          />
        </label>
      ))}

      <div>
        <span style={{ fontSize: 12, opacity: 0.6 }}>좋아하는 것 Best 3</span>
        <div className="stack" style={{ marginTop: 4 }}>
          {[0, 1, 2].map((i) => (
            <input
              key={i}
              type="text"
              placeholder={`${i + 1}순위`}
              value={draft?.favorites?.[i] || ''}
              onChange={(e) => {
                const next = [...(draft.favorites || ['', '', ''])]
                next[i] = e.target.value
                setDraft({ ...draft, favorites: next })
              }}
              onBlur={(e) => saveFavorite(i, e.target.value)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
