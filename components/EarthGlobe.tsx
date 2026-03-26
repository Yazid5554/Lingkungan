'use client'
import React, { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import * as THREE from 'three'

let sharedRotation = 0

const MOBILE_BREAKPOINT = 900

const EarthNormal = () => {
  const meshRef = useRef<THREE.Mesh>(null!)
  const colorMap = useLoader(THREE.TextureLoader, '/assets/earth.jpg')
  const heightMap = useLoader(THREE.TextureLoader, '/assets/earth-height.png')

  useFrame((_, delta) => {
    sharedRotation += delta * 0.08
    if (meshRef.current) meshRef.current.rotation.y = sharedRotation
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 128, 128]} />
      <meshPhongMaterial
        map={colorMap}
        displacementMap={heightMap}
        displacementScale={0.05}
        shininess={10}
        specular={new THREE.Color('#1a3312')}
      />
    </mesh>
  )
}

const EarthHolo = () => {
  const meshRef = useRef<THREE.Mesh>(null!)
  const colorMap = useLoader(THREE.TextureLoader, '/assets/earth.jpg')
  const heightMap = useLoader(THREE.TextureLoader, '/assets/earth-height.png')

  useFrame(() => {
    if (meshRef.current) meshRef.current.rotation.y = sharedRotation
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 128, 128]} />
      <meshPhongMaterial
        map={colorMap}
        displacementMap={heightMap}
        displacementScale={0.05}
        color={new THREE.Color('#00ccee')}
        emissive={new THREE.Color('#003355')}
        emissiveIntensity={0.8}
        shininess={120}
        specular={new THREE.Color('#00ffff')}
        transparent
        opacity={0.9}
      />
    </mesh>
  )
}

const NormalScene = () => (
  <>
    <ambientLight intensity={0.4} />
    <directionalLight position={[5, 3, 5]} intensity={1.2} color="#ffffff" />
    <directionalLight position={[-5, -3, -5]} intensity={0.2} color="#4ade80" />
    <Stars radius={120} depth={60} count={2000} factor={4} fade speed={0.5} />
    <EarthNormal />
  </>
)

const HoloScene = () => (
  <>
    <ambientLight intensity={0.1} />
    <directionalLight position={[5, 3, 5]} intensity={0.3} color="#00ddff" />
    <pointLight position={[0, 0, 3]} intensity={3} color="#00ffee" />
    <pointLight position={[-3, 2, 2]} intensity={1.5} color="#0088ff" />
    <pointLight position={[3, -2, 2]} intensity={1} color="#00ffaa" />
    <Stars radius={120} depth={60} count={2000} factor={4} fade speed={0.5} />
    <EarthHolo />
  </>
)

export default function EarthGlobe() {
  const [hovered, setHovered] = useState(false)
  const [clipX, setClipX] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const animRef = useRef<number>(0)
  const clipXRef = useRef(0)

  useEffect(() => {
    const updateViewport = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT)

    updateViewport()
    window.addEventListener('resize', updateViewport)
    return () => window.removeEventListener('resize', updateViewport)
  }, [])

  useEffect(() => {
    const target = hovered ? 100 : 0

    const animate = () => {
      const diff = target - clipXRef.current
      if (Math.abs(diff) < 0.3) {
        clipXRef.current = target
        setClipX(target)
        return
      }

      clipXRef.current += diff * 0.045
      setClipX(clipXRef.current)
      animRef.current = requestAnimationFrame(animate)
    }

    cancelAnimationFrame(animRef.current)
    animRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animRef.current)
  }, [hovered])

  const dividerX = clipX
  const containerStyle: React.CSSProperties = isMobile
    ? {
        position: 'absolute',
        top: '14rem',
        right: '-18vw',
        width: '72vw',
        height: '72vw',
        minWidth: '250px',
        minHeight: '250px',
        maxWidth: '360px',
        maxHeight: '360px',
        zIndex: 1,
        cursor: 'default',
        opacity: 0.96,
      }
    : {
        position: 'absolute',
        top: '30%',
        right: '2%',
        transform: 'translateY(-30%)',
        width: '42vw',
        height: '42vw',
        maxWidth: '520px',
        maxHeight: '520px',
        zIndex: 1,
        cursor: 'none',
      }

  return (
    <div
      onMouseEnter={() => !isMobile && setHovered(true)}
      onMouseLeave={() => !isMobile && setHovered(false)}
      style={containerStyle}
    >
      {[
        { inset: -14, dur: '20s', color: hovered ? 'rgba(0,220,255,0.4)' : 'rgba(74,222,128,0.15)' },
        { inset: -28, dur: '28s', color: hovered ? 'rgba(0,180,255,0.25)' : 'rgba(34,211,238,0.08)', dash: true },
        { inset: -46, dur: '40s', color: hovered ? 'rgba(0,255,200,0.15)' : 'rgba(74,222,128,0.04)', dash: true, rev: true },
      ].map((r, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            inset: r.inset,
            borderRadius: '50%',
            border: `1px ${(r as { dash?: boolean }).dash ? 'dashed' : 'solid'} ${r.color}`,
            animation: `spinring ${r.dur} linear infinite ${(r as { rev?: boolean }).rev ? 'reverse' : ''}`,
            transition: 'border-color 0.6s',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
      ))}

      <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <Canvas
            camera={{ position: [0, 0, 2.8], fov: 45 }}
            style={{ width: '100%', height: '100%', background: 'transparent' }}
            gl={{ alpha: true, antialias: true }}
          >
            <Suspense fallback={null}>
              <NormalScene />
            </Suspense>
          </Canvas>
        </div>

        <div
          style={{
            position: 'absolute',
            inset: 0,
            clipPath: `inset(0 ${100 - dividerX}% 0 0)`,
          }}
        >
          <Canvas
            camera={{ position: [0, 0, 2.8], fov: 45 }}
            style={{ width: '100%', height: '100%', background: 'transparent' }}
            gl={{ alpha: true, antialias: true }}
          >
            <Suspense fallback={null}>
              <HoloScene />
            </Suspense>
          </Canvas>

          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at 40% 40%, rgba(0,180,255,0.2) 0%, rgba(0,80,180,0.35) 50%, rgba(0,10,60,0.5) 100%)',
              mixBlendMode: 'screen',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage:
                'linear-gradient(rgba(0,210,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,210,255,0.1) 1px, transparent 1px)',
              backgroundSize: '30px 30px',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle, transparent 48%, rgba(0,200,255,0.5) 62%, rgba(0,100,255,0.2) 75%, transparent 85%)',
              pointerEvents: 'none',
            }}
          />
        </div>

        {dividerX > 0.5 && dividerX < 99.5 && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: `calc(${dividerX}% - 1px)`,
              width: 2,
              background: 'linear-gradient(to bottom, transparent, rgba(0,220,255,0.9), white, rgba(0,220,255,0.9), transparent)',
              boxShadow: '0 0 12px 3px rgba(0,220,255,0.8), 0 0 30px 6px rgba(0,180,255,0.4)',
              pointerEvents: 'none',
              zIndex: 10,
            }}
          />
        )}

        {clipX > 5 && (
          <div
            style={{
              position: 'absolute',
              height: 2,
              zIndex: 11,
              left: 0,
              right: `${100 - dividerX}%`,
              background: 'linear-gradient(90deg, transparent, rgba(0,220,255,0.8), white, rgba(0,220,255,0.8), transparent)',
              boxShadow: '0 0 16px rgba(0,220,255,0.9)',
              animation: 'scanline 2.5s linear infinite',
              pointerEvents: 'none',
            }}
          />
        )}

        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            boxShadow: hovered
              ? '0 0 0 1.5px rgba(0,200,255,0.5), inset 0 0 40px rgba(0,100,200,0.2)'
              : '0 0 0 1px rgba(74,222,128,0.2)',
            transition: 'box-shadow 0.7s',
            pointerEvents: 'none',
            zIndex: 12,
          }}
        />

        {!isMobile && !hovered && (
          <>
            <div
              style={{
                position: 'absolute',
                right: '6%',
                bottom: '18%',
                width: 66,
                height: 66,
                borderRadius: '50%',
                border: '1px solid rgba(74,222,128,0.4)',
                boxShadow: '0 0 18px rgba(74,222,128,0.18)',
                zIndex: 13,
                pointerEvents: 'none',
                animation: 'hintPulse 1.9s ease-in-out infinite',
              }}
            />
            <div
              style={{
                position: 'absolute',
                right: '13%',
                bottom: '20%',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                zIndex: 14,
                pointerEvents: 'none',
                color: '#86efac',
                fontSize: 10,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                textShadow: '0 0 10px rgba(74,222,128,0.28)',
                background: 'linear-gradient(90deg, rgba(6,15,4,0.88), rgba(6,15,4,0.35), transparent)',
                padding: '6px 10px 6px 0',
                whiteSpace: 'nowrap',
                animation: 'hintFloat 2.2s ease-in-out infinite',
              }}
            >
              <span
                style={{
                  width: 28,
                  height: 1,
                  background: 'linear-gradient(90deg, rgba(74,222,128,0.85), transparent)',
                }}
              />
              <span>Hover me</span>
            </div>
          </>
        )}
      </div>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 20,
          opacity: isMobile ? 0 : clipX > 20 ? Math.min(1, (clipX - 20) / 30) : 0,
          transition: 'opacity 0.3s',
        }}
      >
        {[
          { top: '5%', left: '50%', transform: 'translateX(-50%)', text: 'ECO SCAN ACTIVE' },
          { top: '13%', left: '6%', text: 'LAT 6.2°S' },
          { top: '13%', right: '5%', text: 'LNG 106.8°E' },
          { bottom: '12%', left: '6%', text: 'ALT 400km' },
          { bottom: '12%', right: '5%', text: '● LIVE' },
        ].map((l, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              ...l,
              color: '#00ddff',
              fontSize: 9,
              fontFamily: 'monospace',
              letterSpacing: '0.15em',
              whiteSpace: 'nowrap',
              textShadow: '0 0 8px #00ddff, 0 0 20px #0088ff',
            }}
          >
            {l.text}
          </div>
        ))}

        {[
          { top: '10%', left: '10%', bt: true, bl: true },
          { top: '10%', right: '10%', bt: true, br: true },
          { bottom: '10%', left: '10%', bb: true, bl: true },
          { bottom: '10%', right: '10%', bb: true, br: true },
        ].map((c, i) => (
          <div
            key={`br${i}`}
            style={{
              position: 'absolute',
              top: c.top,
              bottom: c.bottom,
              left: c.left,
              right: c.right,
              width: 16,
              height: 16,
              borderTop: c.bt ? '2px solid rgba(0,220,255,0.9)' : 'none',
              borderBottom: c.bb ? '2px solid rgba(0,220,255,0.9)' : 'none',
              borderLeft: c.bl ? '2px solid rgba(0,220,255,0.9)' : 'none',
              borderRight: c.br ? '2px solid rgba(0,220,255,0.9)' : 'none',
              filter: 'drop-shadow(0 0 4px #00ddff)',
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes scanline { 0% { top: 0 } 100% { top: 100% } }
        @keyframes spinring { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        @keyframes hintPulse {
          0%, 100% { transform: scale(0.92); opacity: 0.45; }
          50% { transform: scale(1.08); opacity: 0.95; }
        }
        @keyframes hintFloat {
          0%, 100% { transform: translate3d(0, 0, 0); opacity: 0.72; }
          50% { transform: translate3d(-6px, -4px, 0); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
