import { useState } from 'react'
import { usePetState } from '../hooks/usePetState.js'
import { usePoints } from '../contexts/PointsContext.jsx'
import PetStage from '../components/pet/PetStage.jsx'
import GaugeBar from '../components/pet/GaugeBar.jsx'
import PetActionRow from '../components/pet/PetActionRow.jsx'
import ClosetPicker from '../components/pet/ClosetPicker.jsx'
import PetShop from '../components/pet/PetShop.jsx'
import PetSkinPicker from '../components/pet/PetSkinPicker.jsx'
import LoadingScreen from '../components/common/LoadingScreen.jsx'

export default function PetPage() {
  const { state, loading, catalog, inventory, buyItem, useItem, equipOutfit, setSkin } = usePetState()
  const { stats, spend } = usePoints()
  const [tab, setTab] = useState('care')

  const equippedOutfit = inventory.find((inv) => inv.item_id === state.equipped_outfit_id)

  async function handleBuy(item) {
    const ok = await spend(item.price, `캐릭터 아이템: ${item.name}`, 'pet')
    if (ok) await buyItem(item)
  }

  if (loading) return <LoadingScreen />

  return (
    <div className="page stack">
      <h2 className="page-title">🐣 캐릭터 키우기</h2>

      <div className="row">
        <button className="btn" style={{ flex: 1, background: tab === 'care' ? 'var(--color-pink)' : '#f8f4ea' }} onClick={() => setTab('care')}>
          돌보기
        </button>
        <button className="btn" style={{ flex: 1, background: tab === 'shop' ? 'var(--color-pink)' : '#f8f4ea' }} onClick={() => setTab('shop')}>
          상점
        </button>
      </div>

      {tab === 'care' ? (
        <div className="stack">
          <PetStage state={state} outfitName={equippedOutfit?.item?.name} />
          <div className="card stack">
            <GaugeBar type="hunger" value={state.hunger} />
            <GaugeBar type="cleanliness" value={state.cleanliness} />
            <GaugeBar type="happiness" value={state.happiness} />
          </div>
          <PetActionRow label="밥 주기" emoji="🍚" effectKey="hunger" inventory={inventory} onUse={useItem} />
          <PetActionRow label="씻기기" emoji="🛁" effectKey="cleanliness" inventory={inventory} onUse={useItem} />
          <PetActionRow label="놀아주기" emoji="🎾" effectKey="happiness" inventory={inventory} onUse={useItem} />
          <ClosetPicker inventory={inventory} equippedOutfitId={state.equipped_outfit_id} onEquip={equipOutfit} />
          <PetSkinPicker skin={state.skin} onSelect={setSkin} />
        </div>
      ) : (
        <PetShop catalog={catalog} currentPoints={stats.current_points} onBuy={handleBuy} />
      )}
    </div>
  )
}
