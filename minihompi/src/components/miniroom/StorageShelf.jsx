import { itemEmoji } from '../../utils/itemEmoji.js'

export default function StorageShelf({ storageItems, onPlace }) {
  if (storageItems.length === 0) return null

  return (
    <div className="card">
      <h3 style={{ marginBottom: 8, fontSize: 14 }}>📦 보관함 (탭해서 방에 놓기)</h3>
      <div className="row-wrap">
        {storageItems.map((inv) => (
          <button key={inv.id} className="btn" style={{ fontSize: 26, minHeight: 56, minWidth: 56 }} onClick={() => onPlace(inv.id)}>
            {itemEmoji(inv.item)}
          </button>
        ))}
      </div>
    </div>
  )
}
