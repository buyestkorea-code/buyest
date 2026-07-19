import { useGuestbook } from '../hooks/useGuestbook.js'
import GuestbookForm from '../components/guestbook/GuestbookForm.jsx'
import GuestbookList from '../components/guestbook/GuestbookList.jsx'
import LoadingScreen from '../components/common/LoadingScreen.jsx'

export default function GuestbookPage() {
  const { entries, loading, addEntry, deleteEntry } = useGuestbook()

  if (loading) return <LoadingScreen />

  return (
    <div className="page stack">
      <h2 className="page-title">💌 방명록</h2>
      <GuestbookForm onSubmit={addEntry} />
      <GuestbookList entries={entries} onDelete={deleteEntry} />
    </div>
  )
}
