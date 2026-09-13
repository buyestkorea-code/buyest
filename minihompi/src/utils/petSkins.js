import Mascot from '../components/common/Mascot.jsx'
import BlobPet from '../components/pet/BlobPet.jsx'
import FoxSpirit from '../components/pet/FoxSpirit.jsx'

export const SKIN_COMPONENTS = {
  mascot: Mascot,
  blob: BlobPet,
  fox: FoxSpirit,
}

export function getSkinComponent(skin) {
  return SKIN_COMPONENTS[skin] || Mascot
}
