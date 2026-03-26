'use client'
import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const EarthGlobe = dynamic(() => import('./EarthGlobe'), { ssr: false })
const VariableProximity = dynamic(() => import('./animations/VariableProximity'), { ssr: false })

import ScrambledText from './animations/ScrambledText'
import BlurText from './animations/BlurText'

gsap.registerPlugin(ScrollTrigger)

const LEAVES = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  left: `${(i * 10) + 2}%`,
  delay: `${i * 0.8}s`,
  duration: `${7 + (i % 4)}s`,
  size: 8 + (i % 3) * 5,
}))

const C = { bg: '#060f04', accent: '#4ade80', text: '#f0fdf4', moss: '#2d4a22' }
const MOBILE_BREAKPOINT = 900

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const bgCircleRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const updateViewport = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT)

    updateViewport()
    window.addEventListener('resize', updateViewport)

    const ctx = gsap.context(() => {
      const tl = gsap.timeline()

      gsap.to(bgCircleRef.current, {
        scale: 1.15, opacity: 0.15,
        duration: 4, yoyo: true, repeat: -1, ease: 'sine.inOut'
      })

      gsap.to('.hero-content', {
        yPercent: -15, ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: 'bottom top', scrub: true }
      })

      const words = titleRef.current ? Array.from(titleRef.current.querySelectorAll('.word')) : []
      tl.from(words as Element[], { opacity: 0, y: 60, rotateX: -30, duration: 0.75, ease: 'power4.out', stagger: 0.08 })
        .from(lineRef.current!, { scaleX: 0, duration: 0.7, ease: 'power3.out' }, '-=0.3')
        .from(subRef.current!, { opacity: 0, y: 24, duration: 0.6, ease: 'power3.out' }, '-=0.45')
        .from(ctaRef.current ? Array.from(ctaRef.current.children) : [], { opacity: 0, y: 18, duration: 0.5, stagger: 0.1 }, '-=0.3')
        .from(statsRef.current ? Array.from(statsRef.current.children) : [], { opacity: 0, y: 24, duration: 0.5, stagger: 0.08 }, '-=0.2')
    }, sectionRef)
    return () => {
      window.removeEventListener('resize', updateViewport)
      ctx.revert()
    }
  }, [])

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section id="home" ref={sectionRef} style={{
      minHeight: '100vh', position: 'relative', overflow: 'hidden',
      background: C.bg, display: 'flex', flexDirection: 'column', justifyContent: 'center',
      backgroundImage: 'linear-gradient(rgba(74,222,128,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(74,222,128,0.03) 1px, transparent 1px)',
      backgroundSize: '60px 60px',
    }}>
      {/* Glow bg */}
      <div ref={bgCircleRef} style={{
        position: 'absolute', left: '50%', top: '50%',
        transform: 'translate(-50%,-50%)',
        width: 700, height: 700, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(74,222,128,0.12) 0%, transparent 70%)',
        filter: 'blur(60px)', opacity: 0.08, pointerEvents: 'none',
      }} />

      {/* Earth 3D Globe */}
      <EarthGlobe />

      {/* Vertical line deco */}
      <div style={{
        position: 'absolute', left: 32, top: '25%', bottom: '25%', width: 1,
        background: 'linear-gradient(to bottom, transparent, rgba(74,222,128,0.3), transparent)',
      }} />

      {/* Leaf particles */}
      {LEAVES.map(leaf => (
        <div key={leaf.id} className="leaf-particle" style={{
          position: 'absolute', left: leaf.left, bottom: -20,
          animationDelay: leaf.delay, animationDuration: leaf.duration, opacity: 0,
          pointerEvents: 'none',
        }}>
          <svg width={leaf.size} height={leaf.size} viewBox="0 0 20 20" fill="none">
            <path d="M10 2C10 2 3 6 3 13C3 16.866 6.134 20 10 20C13.866 20 17 16.866 17 13C17 6 10 2 10 2Z" fill="rgba(74,222,128,0.5)"/>
          </svg>
        </div>
      ))}

      {/* Content */}
      <div className="hero-content" style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: isMobile ? '7rem 1.25rem 4rem' : '8rem 2rem 5rem',
        position: 'relative',
        zIndex: 10,
      }}>
        <div style={{ maxWidth: isMobile ? '100%' : 'min(100%, 42rem)', paddingRight: isMobile ? '34vw' : 0 }}>
        {/* Eyebrow */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: isMobile ? 24 : 32 }}>
          <div style={{ width: 24, height: 1, background: C.accent }} />
          <span style={{ color: C.accent, fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase' }}>Krisis Polusi Global 2026</span>
        </div>

        {/* Title — VariableProximity hover + animasi masuk */}
        <div ref={containerRef} style={{ position: 'relative', marginBottom: 24 }}>
          <h1 ref={titleRef} className="font-display" style={{
            fontSize: isMobile ? 'clamp(2.7rem, 11vw, 4.5rem)' : 'clamp(3rem, 8vw, 7rem)', fontWeight: 900, lineHeight: 0.95,
          }}>
            <VariableProximity
              label="Bumi Tidak Butuh Janji"
              containerRef={containerRef}
              fromFontVariationSettings="'wght' 700, 'opsz' 9"
              toFontVariationSettings="'wght' 1000, 'opsz' 40"
              radius={120}
              falloff="linear"
              style={{ color: C.text }}
              highlightedWords={['Butuh']}
              highlightStyle={{
                color: '#7dff9b',
                textShadow: '0 0 12px rgba(74,222,128,0.28), 0 0 28px rgba(74,222,128,0.22), 0 0 52px rgba(34,197,94,0.14)',
              }}
            />
          </h1>
        </div>

        {/* Line */}
        <div ref={lineRef} style={{
          width: 96, height: 2, marginBottom: 32,
          background: 'linear-gradient(to right, #4ade80, transparent)',
          transformOrigin: 'left',
        }} />

        {/* Sub — BlurText scroll reveal + ScrambledText hover */}
        <div style={{ maxWidth: isMobile ? '100%' : 500, marginBottom: isMobile ? 40 : 48 }}>
          <ScrambledText
            radius={100}
            duration={1.2}
            speed={0.5}
            scrambleChars=".:"
            style={{ color: 'rgba(240,253,244,0.6)', fontSize: isMobile ? 16 : 18, lineHeight: isMobile ? 1.65 : 1.8 }}
          >
            Polusi udara, plastik, limbah kimia, dan pencemaran air sedang menekan sistem bumi secara bersamaan. Halaman ini merangkum data, dasar ilmiah, kasus dunia, dan solusi yang bisa kita dorong bersama.
          </ScrambledText>
        </div>

        {/* CTA */}
        <div ref={ctaRef} style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 16 : 24, marginBottom: isMobile ? 56 : 80, flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
          <button className="btn-eco" onClick={() => scrollTo('data')}>Lihat Data</button>
          <button onClick={() => scrollTo('kontribusi')} style={{
            background: 'none', border: 'none', cursor: 'none',
            display: 'flex', alignItems: 'center', gap: 8,
            color: 'rgba(240,253,244,0.5)', fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase',
            transition: 'color 0.3s',
          }}
            onMouseEnter={e => (e.currentTarget.style.color = C.accent)}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(240,253,244,0.5)')}
          >
            <span>Kirim Gagasan</span>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </button>
        </div>

        {/* Stats */}
        <div ref={statsRef} style={{
          display: 'flex', gap: isMobile ? 24 : 64, paddingTop: 40,
          flexWrap: isMobile ? 'wrap' : 'nowrap',
          borderTop: '1px solid rgba(74,222,128,0.1)',
        }}>
          {[['99%', 'Udara Melebihi Batas WHO'], ['7 Juta', 'Kematian Terkait Polusi Udara'], ['19-23 Jt Ton', 'Plastik Bocor ke Ekosistem Air']].map(([num, label]) => (
            <div key={num} style={{ minWidth: isMobile ? 'calc(50% - 12px)' : undefined }}>
              <div className="font-display" style={{ fontSize: isMobile ? 28 : 36, fontWeight: 700, color: C.accent }}>{num}</div>
              <div style={{ color: 'rgba(240,253,244,0.4)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

        </div>{/* end left half */}

      {/* Scroll hint */}
      <div style={{
        position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        animation: 'bounce 2s infinite',
      }}>
        <span style={{ color: 'rgba(240,253,244,0.3)', fontSize: 10, letterSpacing: '0.3em' }}>SCROLL</span>
        <div style={{ width: 1, height: 32, background: 'linear-gradient(to bottom, rgba(74,222,128,0.5), transparent)' }} />
      </div>

      <style>{`@keyframes bounce { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(-8px)} }`}</style>
    </section>
  )
}
