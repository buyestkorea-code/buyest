// 캐릭터 진화 단계는 "돌보기 횟수"와 "태어난 뒤 지난 시간" 중 더 높은 쪽을 따른다.
// 다마고치처럼 시간이 지나기만 해도 자연스럽게 변신하고, 열심히 돌보면 더 빨리 변신한다.
export const STAGE_ORDER = ['egg', 'hatchling', 'grown', 'sparkle']

const CARE_THRESHOLDS = { hatchling: 5, grown: 20, sparkle: 50 }
const TIME_THRESHOLDS_HOURS = { hatchling: 18, grown: 96, sparkle: 240 }

function stageIndexForCareCount(count) {
  if (count >= CARE_THRESHOLDS.sparkle) return 3
  if (count >= CARE_THRESHOLDS.grown) return 2
  if (count >= CARE_THRESHOLDS.hatchling) return 1
  return 0
}

function stageIndexForElapsedHours(hours) {
  if (hours >= TIME_THRESHOLDS_HOURS.sparkle) return 3
  if (hours >= TIME_THRESHOLDS_HOURS.grown) return 2
  if (hours >= TIME_THRESHOLDS_HOURS.hatchling) return 1
  return 0
}

export function elapsedHoursSince(timestamp) {
  if (!timestamp) return 0
  return Math.max(0, (Date.now() - new Date(timestamp).getTime()) / 3_600_000)
}

export function resolvedStage(careCount, bornAt) {
  const idx = Math.max(stageIndexForCareCount(careCount), stageIndexForElapsedHours(elapsedHoursSince(bornAt)))
  return STAGE_ORDER[idx]
}

export function nextEvolutionHint(state) {
  const idx = STAGE_ORDER.indexOf(state.stage)
  if (idx < 0 || idx >= STAGE_ORDER.length - 1) return null
  const nextStage = STAGE_ORDER[idx + 1]
  const careLeft = Math.max(0, CARE_THRESHOLDS[nextStage] - state.care_count)
  const hoursLeft = Math.max(0, TIME_THRESHOLDS_HOURS[nextStage] - elapsedHoursSince(state.born_at))
  if (careLeft === 0 || hoursLeft === 0) return '곧 변신할 거예요! ✨'
  const daysLeft = Math.max(1, Math.ceil(hoursLeft / 24))
  return `다음 변신까지 돌보기 ${careLeft}번을 더 하거나, 약 ${daysLeft}일만 기다리면 돼요!`
}
