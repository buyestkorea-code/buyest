import { motion } from 'framer-motion'
import { itemEmoji } from '../../utils/itemEmoji.js'

export default function DraggableItem({ placed, canvasRef, onDragEnd, onTap, selected }) {
  const item = placed.inventory?.item

  return (
    <motion.div
      drag
      dragConstraints={canvasRef}
      dragMomentum={false}
      dragElastic={0}
      initial={false}
      style={{
        position: 'absolute',
        left: `${placed.x}%`,
        top: `${placed.y}%`,
        translateX: '-50%',
        translateY: '-50%',
        touchAction: 'none',
        cursor: 'grab',
        userSelect: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
      onTap={() => onTap(placed.inventory_id)}
      onDragEnd={(e, info) => {
        const canvas = canvasRef.current
        if (!canvas) return
        const rect = canvas.getBoundingClientRect()
        const point = info.point
        const x = Math.min(96, Math.max(4, ((point.x - rect.left) / rect.width) * 100))
        const y = Math.min(96, Math.max(4, ((point.y - rect.top) / rect.height) * 100))
        onDragEnd(placed.inventory_id, x, y)
      }}
    >
      <span style={{ fontSize: 44, filter: selected ? 'drop-shadow(0 0 6px #ff9fc7)' : 'drop-shadow(0 2px 2px rgba(0,0,0,0.2))' }}>
        {itemEmoji(item)}
      </span>
      <span style={{ width: 26, height: 8, borderRadius: '50%', background: 'rgba(0,0,0,0.18)', marginTop: -4, filter: 'blur(1px)' }} />
    </motion.div>
  )
}
