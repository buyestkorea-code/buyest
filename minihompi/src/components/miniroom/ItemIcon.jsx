import { itemEmoji } from '../../utils/itemEmoji.js'
import Mascot from '../common/Mascot.jsx'
import BlobPet from '../pet/BlobPet.jsx'
import FoxSpirit from '../pet/FoxSpirit.jsx'

const DOLL_COMPONENTS = {
  '병아리 인형': Mascot,
  '블롭 인형': BlobPet,
  '여우 인형': FoxSpirit,
}

export default function ItemIcon({ item, size = 30 }) {
  const DollComponent = DOLL_COMPONENTS[item?.name]
  if (DollComponent) return <DollComponent size={size} mood="happy" />
  return <span style={{ fontSize: size }}>{itemEmoji(item)}</span>
}
