import { itemEmoji } from '../../utils/itemEmoji.js'

export default function PetShop({ catalog, currentPoints, onBuy }) {
  return (
    <div className="card">
      <h3 style={{ marginBottom: 8, fontSize: 14 }}>🛍️ 캐릭터 상점</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        {catalog.map((item) => {
          const affordable = currentPoints >= item.price
          return (
            <div key={item.id} className="stack" style={{ alignItems: 'center', background: '#fff', borderRadius: 12, padding: 8, gap: 4 }}>
              <span style={{ fontSize: 28 }}>{itemEmoji(item)}</span>
              <span style={{ fontSize: 11, fontWeight: 700, textAlign: 'center' }}>{item.name}</span>
              <span className="pill" style={{ fontSize: 11 }}>{item.price}P</span>
              <button className="btn" style={{ fontSize: 11, padding: '6px 8px', minHeight: 34 }} disabled={!affordable} onClick={() => onBuy(item)}>
                구매
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
