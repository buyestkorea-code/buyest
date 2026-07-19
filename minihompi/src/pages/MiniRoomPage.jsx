import { useState } from 'react'
import { useMiniRoom } from '../hooks/useMiniRoom.js'
import { usePetState } from '../hooks/usePetState.js'
import { usePoints } from '../contexts/PointsContext.jsx'
import { moodFromGauges } from '../utils/petMood.js'
import RoomCanvas from '../components/miniroom/RoomCanvas.jsx'
import StorageShelf from '../components/miniroom/StorageShelf.jsx'
import ItemShop from '../components/miniroom/ItemShop.jsx'
import LoadingScreen from '../components/common/LoadingScreen.jsx'

export default function MiniRoomPage() {
  const { catalog, loading, buyItem, placeItem, updatePosition, removeFromRoom, storageItems, placedItems } = useMiniRoom()
  const { state: petState, inventory: petInventory } = usePetState()
  const { stats, spend } = usePoints()
  const [tab, setTab] = useState('room')

  const equippedOutfit = petInventory.find((inv) => inv.item_id === petState.equipped_outfit_id)
  const roomCharacter = petState.stage === 'egg'
    ? null
    : { skin: petState.skin, mood: moodFromGauges(petState), outfitName: equippedOutfit?.item?.name }

  async function handleBuy(item) {
    const ok = await spend(item.price, `미니룸 아이템: ${item.name}`, 'miniroom')
    if (ok) await buyItem(item.id)
  }

  if (loading) return <LoadingScreen />

  return (
    <div className="page stack">
      <h2 className="page-title">🛋️ 미니룸</h2>

      <div className="row">
        <button className="btn" style={{ flex: 1, background: tab === 'room' ? 'var(--color-pink)' : '#f8f4ea' }} onClick={() => setTab('room')}>
          내 방
        </button>
        <button className="btn" style={{ flex: 1, background: tab === 'shop' ? 'var(--color-pink)' : '#f8f4ea' }} onClick={() => setTab('shop')}>
          상점
        </button>
      </div>

      {tab === 'room' ? (
        <div className="stack">
          <RoomCanvas placedItems={placedItems} onUpdatePosition={updatePosition} onRemove={removeFromRoom} character={roomCharacter} />
          <StorageShelf storageItems={storageItems} onPlace={placeItem} />
        </div>
      ) : (
        <ItemShop catalog={catalog} currentPoints={stats.current_points} onBuy={handleBuy} />
      )}
    </div>
  )
}
