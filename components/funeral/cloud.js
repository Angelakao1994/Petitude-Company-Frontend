import React from 'react'
import { useSpring, animated } from 'react-spring'

// 設定動畫位置
const generatePositions = (start, end, step, amplitude) => {
  const positions = []
  for (let x = start; x <= end; x += step) {
    positions.push({ x, y: amplitude })
    positions.push({ x, y: -amplitude })
  }
  return positions
}

// 設定動畫路徑
const positions = [
  ...generatePositions(950, 1650, 50, 10),
  ...generatePositions(1650, 950, -50, -10),
]

const Cloud = ({ style }) => {
  const props = useSpring({
    loop: true,
    to: positions.map((pos) => ({ ...pos, config: { duration: 1000 } })),
    from: { x: 950, y: 0 },
    config: { duration: 1000 },
  })

  return (
    <animated.div className="cloud" style={{ ...props, ...style }}>
      <img src="/funeral/cloud.png" style={{ width: '10%' }} alt="Cloud" />
    </animated.div>
  )
}

const MemorialPage = () => {
  return (
    <div
      className="sky"
      style={{
        position: 'absolute',
        width: '100%',
        height: '40%',
        backgroundColor: 'transparent',
        overflow: 'hidden',
        zIndex: '1',
      }}
    >
      <div style={{ marginTop: '2%', marginLeft: '0%', width: '70%' }}>
        <Cloud />
      </div>
    </div>
  )
}

export default MemorialPage
