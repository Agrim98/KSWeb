import { useEffect, useRef } from 'react'
import * as THREE from 'three'

function buildPortal() {
  const group = new THREE.Group()

  const ringColors = [0x6ee7ff, 0xff5fd6, 0x9b7bff]
  ringColors.forEach((color, i) => {
    const geometry = new THREE.TorusGeometry(2.5 - i * 0.18, 0.012, 8, 128)
    const material = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.5 - i * 0.1,
    })
    const ring = new THREE.Mesh(geometry, material)
    ring.rotation.x = Math.PI / 2 + i * 0.08
    group.add(ring)
  })

  const coreGeometry = new THREE.IcosahedronGeometry(1.5, 2)
  const coreMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true,
    transparent: true,
    opacity: 0.3,
  })
  const core = new THREE.Mesh(coreGeometry, coreMaterial)
  group.add(core)

  return { group, core }
}

function buildParticles(count: number) {
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const palette = [
    new THREE.Color(0x7cffb2),
    new THREE.Color(0xffd36e),
    new THREE.Color(0x6ee7ff),
  ]

  for (let i = 0; i < count; i++) {
    const radius = 2 + Math.random() * 6.5
    const angle = Math.random() * Math.PI * 2
    const drop = Math.random() * 7

    positions[i * 3] = Math.cos(angle) * radius
    positions[i * 3 + 1] = -drop - radius * 0.4
    positions[i * 3 + 2] = Math.sin(angle) * radius

    const color = palette[Math.floor(Math.random() * palette.length)]
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const material = new THREE.PointsMaterial({
    size: 0.05,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
  })

  return new THREE.Points(geometry, material)
}

export default function PortalScene() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      0.1,
      100,
    )
    camera.position.set(0, 0, 11)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(container.clientWidth, container.clientHeight)
    container.appendChild(renderer.domElement)

    const { group: portal, core } = buildPortal()
    portal.position.y = -2.6
    scene.add(portal)

    const particles = buildParticles(900)
    scene.add(particles)

    const clock = new THREE.Clock()
    let frameId = 0

    const animate = () => {
      const elapsed = clock.getElapsedTime()
      portal.rotation.z = elapsed * 0.07
      portal.rotation.y = Math.sin(elapsed * 0.15) * 0.18
      core.rotation.y = elapsed * 0.16
      core.rotation.x = elapsed * 0.1
      particles.rotation.y = elapsed * 0.025
      renderer.render(scene, camera)
      frameId = requestAnimationFrame(animate)
    }
    animate()

    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(frameId)
      renderer.dispose()
      particles.geometry.dispose()
      particles.material.dispose()
      portal.children.forEach(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (mesh: any) => {
          mesh.geometry.dispose()
          mesh.material.dispose()
        },
      )
      container.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={containerRef} className="portal-scene" aria-hidden="true" />
}
