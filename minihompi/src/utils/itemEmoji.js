const NAME_EMOJI = {
  '분홍 침대': '🛏️',
  '책상 세트': '🗄️',
  '곰인형': '🧸',
  '작은 어항': '🐠',
  '러그': '🟪',
  '사과': '🍎',
  '간식바': '🍫',
  '비누방울': '🫧',
  '공놀이': '🎾',
  '노란 리본': '🎀',
  '별무늬 모자': '👒',
}

const CATEGORY_EMOJI = {
  furniture: '🪑',
  deco: '🎁',
  floor: '🟫',
  food: '🍽️',
  toy: '🧸',
  outfit: '👕',
}

export function itemEmoji(item) {
  return NAME_EMOJI[item?.name] || CATEGORY_EMOJI[item?.category || item?.type] || '✨'
}
