import { AnimatePresence, motion } from 'framer-motion'
import { usePoints } from '../../contexts/PointsContext.jsx'
import Mascot from './Mascot.jsx'

export default function LevelUpEffect() {
  const { levelUpFlash, clearLevelUpFlash } = usePoints()

  return (
    <AnimatePresence>
      {levelUpFlash && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={clearLevelUpFlash}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(255, 214, 232, 0.85)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', gap: 12, zIndex: 200,
          }}
        >
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', bounce: 0.6 }}
          >
            <Mascot size={140} mood="sparkle" />
          </motion.div>
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{ fontSize: 28, fontWeight: 900, color: '#a86b4a' }}
          >
            레벨 업! Lv.{levelUpFlash} 🎉
          </motion.h2>
          <p style={{ opacity: 0.7 }}>화면을 톡 누르면 닫혀요</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
