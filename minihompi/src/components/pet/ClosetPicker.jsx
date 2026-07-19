import { itemEmoji } from '../../utils/itemEmoji.js'

export default function ClosetPicker({ inventory, equippedOutfitId, onEquip }) {
  const outfits = inventory.filter((inv) => inv.item?.type === 'outfit')

  if (outfits.length === 0) return null

  return (
    <div className="card">
      <h3 style={{ fontSize: 14, marginBottom: 8 }}>👕 옷장</h3>
      <div className="row-wrap">
        <button className="btn" style={{ fontSize: 12, background: !equippedOutfitId ? 'var(--color-pink)' : '#f8f4ea' }} onClick={() => onEquip(null)}>
          맨몸
        </button>
        {outfits.map((inv) => (
          <button
            key={inv.id}
            className="btn"
            style={{ fontSize: 12, background: equippedOutfitId === inv.item_id ? 'var(--color-pink)' : '#f8f4ea' }}
            onClick={() => onEquip(inv)}
          >
            {itemEmoji(inv.item)} {inv.item?.name}
          </button>
        ))}
      </div>
    </div>
  )
}
