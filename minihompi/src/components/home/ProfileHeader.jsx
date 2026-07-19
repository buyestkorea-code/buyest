import { useRef, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient.js'
import { uploadToBucket } from '../../lib/storage.js'
import { resizePhoto } from '../../utils/imageResize.js'
import Mascot from '../common/Mascot.jsx'

export default function ProfileHeader({ profile, onProfileChange }) {
  const [editingTitle, setEditingTitle] = useState(false)
  const [titleDraft, setTitleDraft] = useState(profile?.title_text || '')
  const [uploading, setUploading] = useState(false)
  const coverInputRef = useRef(null)
  const avatarInputRef = useRef(null)

  async function handlePhotoUpload(file, field) {
    if (!file || !isSupabaseConfigured) return
    setUploading(true)
    try {
      const { full } = await resizePhoto(file)
      const path = `${field}-${Date.now()}.jpg`
      const url = await uploadToBucket('avatars', path, full)
      await supabase.from('profile').update({ [field]: url }).eq('id', 1)
      onProfileChange({ ...profile, [field]: url })
    } finally {
      setUploading(false)
    }
  }

  async function saveTitle() {
    setEditingTitle(false)
    if (titleDraft === profile?.title_text) return
    if (isSupabaseConfigured) {
      await supabase.from('profile').update({ title_text: titleDraft }).eq('id', 1)
    }
    onProfileChange({ ...profile, title_text: titleDraft })
  }

  return (
    <div
      className="card"
      style={{
        padding: 0, overflow: 'hidden', position: 'relative',
        backgroundImage: profile?.cover_url ? `url(${profile.cover_url})` : undefined,
        backgroundSize: 'cover', backgroundPosition: 'center',
      }}
    >
      <div style={{ background: profile?.cover_url ? 'rgba(255,255,255,0.55)' : 'transparent', padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <div style={{ position: 'relative' }}>
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt="프로필" style={{ width: 88, height: 88, borderRadius: '50%', objectFit: 'cover', border: '4px solid #fff' }} />
          ) : (
            <Mascot size={88} mood="happy" style={{ background: '#fff', borderRadius: '50%', border: '4px solid #fff' }} />
          )}
          <button
            className="btn"
            style={{ position: 'absolute', bottom: -6, right: -6, minHeight: 32, minWidth: 32, padding: 0, fontSize: 14 }}
            onClick={() => avatarInputRef.current?.click()}
            aria-label="프로필 사진 변경"
          >
            📷
          </button>
          <input ref={avatarInputRef} type="file" accept="image/*" hidden onChange={(e) => handlePhotoUpload(e.target.files[0], 'avatar_url')} />
        </div>

        {editingTitle ? (
          <input
            type="text"
            value={titleDraft}
            onChange={(e) => setTitleDraft(e.target.value)}
            onBlur={saveTitle}
            onKeyDown={(e) => e.key === 'Enter' && saveTitle()}
            autoFocus
            style={{ textAlign: 'center', fontWeight: 800, fontSize: 18 }}
          />
        ) : (
          <h1 onClick={() => setEditingTitle(true)} style={{ fontSize: 20, cursor: 'pointer' }}>
            {profile?.title_text || '승목이의 비밀기지'} ✏️
          </h1>
        )}

        <button className="btn btn-secondary" onClick={() => coverInputRef.current?.click()} disabled={uploading}>
          {uploading ? '업로드 중...' : '🖼️ 배경 사진 바꾸기'}
        </button>
        <input ref={coverInputRef} type="file" accept="image/*" hidden onChange={(e) => handlePhotoUpload(e.target.files[0], 'cover_url')} />
      </div>
    </div>
  )
}
