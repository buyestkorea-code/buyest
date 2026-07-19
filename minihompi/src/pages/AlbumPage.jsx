import { useRef, useState } from 'react'
import { useAlbums } from '../hooks/useAlbums.js'
import { usePhotos } from '../hooks/usePhotos.js'
import AlbumList from '../components/album/AlbumList.jsx'
import PhotoGrid from '../components/album/PhotoGrid.jsx'
import PhotoViewerModal from '../components/album/PhotoViewerModal.jsx'
import LoadingScreen from '../components/common/LoadingScreen.jsx'

export default function AlbumPage() {
  const { albums, loading, createAlbum, deleteAlbum } = useAlbums()
  const [selectedAlbumId, setSelectedAlbumId] = useState(null)
  const { photos, uploadPhoto, updateCaption, deletePhoto } = usePhotos(selectedAlbumId)
  const [openPhoto, setOpenPhoto] = useState(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  const selectedAlbum = albums.find((a) => a.id === selectedAlbumId)

  async function handleUpload(file) {
    if (!file) return
    setUploading(true)
    try {
      await uploadPhoto(file)
    } finally {
      setUploading(false)
    }
  }

  if (loading) return <LoadingScreen />

  return (
    <div className="page stack">
      <h2 className="page-title">📷 사진첩</h2>

      {!selectedAlbumId ? (
        <AlbumList albums={albums} onSelect={setSelectedAlbumId} onCreate={createAlbum} onDelete={deleteAlbum} />
      ) : (
        <div className="stack">
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <button className="btn btn-ghost" onClick={() => setSelectedAlbumId(null)}>◀ 목록으로</button>
            <strong>{selectedAlbum?.name}</strong>
          </div>
          <button className="btn btn-block" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
            {uploading ? '업로드 중...' : '📤 사진 올리기'}
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={(e) => handleUpload(e.target.files[0])} />
          <PhotoGrid photos={photos} onOpen={setOpenPhoto} />
        </div>
      )}

      {openPhoto && (
        <PhotoViewerModal
          photo={openPhoto}
          onClose={() => setOpenPhoto(null)}
          onUpdateCaption={updateCaption}
          onDelete={deletePhoto}
        />
      )}
    </div>
  )
}
