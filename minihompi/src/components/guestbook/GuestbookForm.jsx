import { useState } from 'react'

export default function GuestbookForm({ onSubmit }) {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')

  async function handleSubmit() {
    if (!name.trim() || !message.trim()) return
    await onSubmit(name.trim(), message.trim())
    setMessage('')
  }

  return (
    <div className="card stack">
      <input type="text" placeholder="이름 (예: 엄마)" value={name} onChange={(e) => setName(e.target.value)} />
      <textarea placeholder="한마디 남겨주세요!" value={message} onChange={(e) => setMessage(e.target.value)} />
      <button className="btn btn-block" onClick={handleSubmit}>💌 남기기</button>
    </div>
  )
}
