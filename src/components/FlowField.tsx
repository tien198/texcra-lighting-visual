import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  varying float vFacing;

  void main() {
    vUv = uv;
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vec3 worldNormal = normalize(mat3(modelMatrix) * normal);
    vec3 viewDirection = normalize(cameraPosition - worldPosition.xyz);
    vFacing = pow(1.0 - abs(dot(worldNormal, viewDirection)), 1.5);
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uSeed;
  uniform float uEnergy;
  uniform vec3 uColor;
  varying vec2 vUv;
  varying float vFacing;

  void main() {
    float carrier = sin((vUv.x * 8.0 - uTime * (0.7 + uSeed * 0.05) + uSeed) * 6.28318);
    float packet = smoothstep(0.08, 0.92, carrier * 0.5 + 0.5);
    float filament = pow(sin(vUv.y * 3.14159), 1.7);
    float endFade = smoothstep(0.0, 0.06, vUv.x) * (1.0 - smoothstep(0.92, 1.0, vUv.x));
    float shimmer = 0.7 + packet * (0.62 + uEnergy * 0.3);
    float alpha = endFade * filament * (0.26 + packet * 0.32 + vFacing * 0.14);
    vec3 color = uColor * shimmer;
    gl_FragColor = vec4(color, alpha);
  }
`

interface StrandDefinition {
  curve: THREE.CatmullRomCurve3
  color: THREE.Color
  radius: number
  seed: number
}

function makeStrands() {
  const colors = ['#83c7ff', '#cbe9ff', '#ffffff', '#6bb6f4', '#a9d7ff']

  return Array.from({ length: 58 }, (_, index): StrandDefinition => {
    const normalized = index / 57
    const offset = (normalized - 0.5) * 2
    const jitter = Math.sin(index * 12.713) * 0.11
    const depth = -0.45 + Math.sin(index * 4.19) * 0.42
    const drift = Math.cos(index * 2.77) * 0.13
    const points = [
      new THREE.Vector3(-6.5, -2.22 + offset * 0.68, depth),
      new THREE.Vector3(-4.2, -2.28 + offset * 0.76 + jitter, depth + 0.05),
      new THREE.Vector3(-2.25, -1.74 + offset * 0.62 - jitter, depth + 0.12),
      new THREE.Vector3(-0.62, -1.02 + offset * 0.42 + drift, depth + 0.16),
      new THREE.Vector3(0.45, -0.35 + offset * 0.29, depth + 0.11),
      new THREE.Vector3(0.72, 0.57 + offset * 0.27 - jitter, depth),
      new THREE.Vector3(1.72, 1.22 + offset * 0.38, depth - 0.04),
      new THREE.Vector3(3.55, 1.08 + offset * 0.56 + drift, depth - 0.08),
      new THREE.Vector3(5.9, 1.72 + offset * 0.67, depth - 0.12),
    ]

    return {
      curve: new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.38),
      color: new THREE.Color(colors[index % colors.length]),
      radius: index % 9 === 0 ? 0.016 : index % 4 === 0 ? 0.009 : 0.0065,
      seed: normalized * 4.7 + (index % 5) * 0.31,
    }
  })
}

interface FlowStrandProps extends StrandDefinition {
  index: number
  engaged: boolean
}

function FlowStrand({ curve, color, radius, seed, index, engaged }: FlowStrandProps) {
  const material = useRef<THREE.ShaderMaterial>(null)
  const animationTime = useRef(0)
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSeed: { value: seed },
      uEnergy: { value: 0 },
      uColor: { value: color },
    }),
    [color, seed],
  )

  useFrame((_, delta) => {
    if (!material.current) return
    animationTime.current += Math.min(delta, 1 / 30) * 0.18
    material.current.uniforms.uTime.value = animationTime.current
    material.current.uniforms.uEnergy.value = THREE.MathUtils.damp(
      material.current.uniforms.uEnergy.value,
      engaged ? 1 : 0,
      2.4,
      delta,
    )
  })

  return (
    <mesh renderOrder={index % 3}>
      <tubeGeometry args={[curve, 72, radius, radius > 0.01 ? 5 : 3, false]} />
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </mesh>
  )
}

interface FlowFieldProps {
  engaged: boolean
}

export function FlowField({ engaged }: FlowFieldProps) {
  const group = useRef<THREE.Group>(null)
  const animationTime = useRef(0)
  const strands = useMemo(() => makeStrands(), [])

  useFrame((_, delta) => {
    if (!group.current) return
    animationTime.current += Math.min(delta, 1 / 30)
    const motionScale = engaged ? 1 : 0.35
    group.current.position.y = THREE.MathUtils.damp(
      group.current.position.y,
      Math.sin(animationTime.current * 0.42) * 0.035 * motionScale,
      2,
      delta,
    )
  })

  return (
    <group ref={group} rotation={[0.02, -0.04, -0.025]}>
      {strands.map((strand, index) => (
        <FlowStrand key={index} {...strand} index={index} engaged={engaged} />
      ))}
    </group>
  )
}
