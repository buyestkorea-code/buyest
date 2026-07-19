import { itemEmoji } from '../../utils/itemEmoji.js'

export default function PetActionRow({ label, emoji, effectKey, inventory, onUse }) {
  const usable = inventory.filter((inv) => inv.item?.effect?.[effectKey])

  return (
    <div className="card">
      <h3 style={{ fontSize: 14, marginBottom: 8 }}>{emoji} {label}</h3>
      {usable.length === 0 ? (
        <p style={{ fontSize: 12, opacity: 0.6, margin: 0 }}>보유한 아이템이 없어요. 상점에서 구매해보세요!</p>
      ) : (
        <div className="row-wrap">
          {usable.map((inv) => (
            <button key={inv.id} className="btn" style={{ fontSize: 12, padding: '8px 10px' }} onClick={() => onUse(inv)}>
              {itemEmoji(inv.item)} {inv.item?.name} ×{inv.quantity}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
