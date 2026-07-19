import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient.js'

const MOODS = ['😆', '😊', '😐', '😢', '😡', '😴', '🤒', '🥳']

export default function MoodPicker({ profile, onProfileChange }) {
  async function pick(mood) {
    onProfileChange({ ...profile, mood_emoji: mood })
    if (isSupabaseConfigured) {
      await supabase.from('profile').update({ mood_emoji: mood }).eq('id', 1)
    }
  }

  return (
    <div className="card">
      <h3 style={{ marginBottom: 8, fontSize: 14 }}>오늘 기분은?</h3>
      <div className="row-wrap">
        {MOODS.map((m) => (
          <button
            key={m}
            className="btn"
            style={{
              fontSize: 22, padding: 8, minWidth: 48,
              background: profile?.mood_emoji === m ? 'var(--color-pink)' : '#f8f4ea',
            }}
            onClick={() => pick(m)}
          >
            {m}
          </button>
        ))}
      </div>
    </div>
  )
}
