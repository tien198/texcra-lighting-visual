import { Line } from '@react-three/drei'
import { useMemo } from 'react'
import * as THREE from 'three'

function circlePoints(radius: number, x = 1.35, y = -0.16) {
  return Array.from({ length: 97 }, (_, index) => {
    const angle = (index / 96) * Math.PI * 2
    return new THREE.Vector3(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius, -1.25)
  })
}

export function TechnicalGrid() {
  const circles = useMemo(() => Array.from({ length: 12 }, (_, index) => circlePoints(0.42 + index * 0.27)), [])
  const radials = useMemo(
    () =>
      Array.from({ length: 24 }, (_, index) => {
        const angle = (index / 24) * Math.PI * 2
        return [
          new THREE.Vector3(
            1.35 + Math.cos(angle) * 0.36,
            -0.16 + Math.sin(angle) * 0.36,
            -1.2,
          ),
          new THREE.Vector3(
            1.35 + Math.cos(angle) * 3.6,
            -0.16 + Math.sin(angle) * 3.6,
            -1.2,
          ),
        ]
      }),
    [],
  )
  const constructionLines = useMemo(
    () => [
      [new THREE.Vector3(-5.7, -2.55, -1.35), new THREE.Vector3(5.9, 1.48, -1.35)],
      [new THREE.Vector3(-4.9, 0.94, -1.35), new THREE.Vector3(5.7, 0.94, -1.35)],
      [new THREE.Vector3(-2.75, -3.1, -1.35), new THREE.Vector3(-2.75, 3.4, -1.35)],
      [new THREE.Vector3(1.35, -3.1, -1.35), new THREE.Vector3(1.35, 3.4, -1.35)],
      [new THREE.Vector3(3.35, -3.1, -1.35), new THREE.Vector3(3.35, 3.4, -1.35)],
    ],
    [],
  )

  return (
    <group>
      {circles.map((points, index) => (
        <Line
          key={`circle-${index}`}
          points={points}
          color={index % 3 === 0 ? '#9ac9ec' : '#6e9aba'}
          lineWidth={index % 3 === 0 ? 0.55 : 0.3}
          transparent
          opacity={index % 3 === 0 ? 0.25 : 0.13}
          depthWrite={false}
        />
      ))}
      {radials.map((points, index) => (
        <Line
          key={`radial-${index}`}
          points={points}
          color="#7fa7c5"
          lineWidth={0.3}
          transparent
          opacity={index % 3 === 0 ? 0.19 : 0.1}
          depthWrite={false}
        />
      ))}
      {constructionLines.map((points, index) => (
        <Line
          key={`construction-${index}`}
          points={points}
          color="#aac9e0"
          lineWidth={0.35}
          dashed
          dashScale={7}
          dashSize={0.08}
          gapSize={0.12}
          transparent
          opacity={0.22}
          depthWrite={false}
        />
      ))}
    </group>
  )
}
