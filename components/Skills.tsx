'use client'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionBridge from './SectionBridge'
import SplitText from './animations/SplitText'
import { createScrollInOut } from './animations/scrollInOut'

gsap.registerPlugin(ScrollTrigger)

const C = { bg: '#071205', accent: '#4ade80', text: '#f0fdf4' }

const POLLUTION_TYPES = [
  {
    num: '01',
    name: 'Polusi Udara',
    tag: 'PM2.5, Ozon, NOx, SO2',
    desc: 'Mempengaruhi pernapasan, jantung, kehamilan, dan produktivitas. Sumber utamanya datang dari transportasi, pembangkit, industri, kebakaran, dan bahan bakar rumah tangga.',
    severity: '96%',
    color: '#4ade80',
    focus: 'Paparan tinggi',
  },
  {
    num: '02',
    name: 'Polusi Air',
    tag: 'Limbah domestik, logam berat',
    desc: 'Menurunkan kualitas air minum, merusak perairan, dan memindahkan kontaminan ke ikan, tanaman, serta tubuh manusia melalui rantai makanan.',
    severity: '89%',
    color: '#22d3ee',
    focus: 'Rantai makanan',
  },
  {
    num: '03',
    name: 'Polusi Tanah',
    tag: 'Pestisida, residu industri',
    desc: 'Membuat tanah kehilangan fungsi ekologis dan bisa membawa cemaran ke hasil panen, air tanah, dan biodiversitas mikro yang penting untuk kesuburan.',
    severity: '82%',
    color: '#a3e635',
    focus: 'Kesuburan turun',
  },
  {
    num: '04',
    name: 'Polusi Plastik',
    tag: 'Makroplastik dan mikroplastik',
    desc: 'Tidak berhenti di sungai atau laut. Pecahannya masuk ke makanan, air, udara, dan tubuh, sekaligus memerangkap satwa dan merusak habitat pesisir.',
    severity: '91%',
    color: '#facc15',
    focus: 'Ekosistem air',
  },
  {
    num: '05',
    name: 'Polusi Suara',
    tag: 'Kota padat, bandara, industri',
    desc: 'Sering diremehkan, padahal paparan kebisingan kronis berkaitan dengan stres, gangguan tidur, masalah kardiovaskular, dan penurunan kualitas hidup.',
    severity: '68%',
    color: '#86efac',
    focus: 'Stres kronis',
  },
  {
    num: '06',
    name: 'Polusi Cahaya',
    tag: 'Langit malam, migrasi, ritme',
    desc: 'Mengganggu serangga penyerbuk, burung migran, hingga pola tidur manusia. Ini contoh polusi modern yang jarang terasa berbahaya namun dampaknya meluas.',
    severity: '59%',
    color: '#bbf7d0',
    focus: 'Ritme biologis',
  },
]

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null)
  const shellRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const headRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headRef.current ? Array.from(headRef.current.children) : [], {
        scrollTrigger: { trigger: headRef.current, start: 'top 80%' },
        opacity: 0,
        y: 32,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.12,
      })

      if (isMobile) {
        if (trackRef.current) {
          createScrollInOut({
            trigger: trackRef.current,
            items: Array.from(trackRef.current.children),
            fromY: 30,
            duration: 0.72,
            stagger: 0.08,
            start: 'top 86%',
            individual: true,
          })
        }
        return
      }

      let secondFrame = 0
      const firstFrame = requestAnimationFrame(() => {
        secondFrame = requestAnimationFrame(() => {
          const track = trackRef.current
          const shell = shellRef.current
          const section = sectionRef.current
          if (!track || !shell || !section) return

          const getTotalWidth = () => Math.max(0, track.scrollWidth - shell.clientWidth)

          const tween = gsap.to(track, {
            x: () => -getTotalWidth(),
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top top+=12',
              end: () => `+=${getTotalWidth()}`,
              pin: true,
              scrub: 0.9,
              anticipatePin: 0,
              invalidateOnRefresh: true,
            },
          })

          ScrollTrigger.refresh()

          return () => {
            tween.scrollTrigger?.kill()
            tween.kill()
            gsap.set(track, { clearProps: 'transform' })
          }
        })
      })

      return () => {
        cancelAnimationFrame(firstFrame)
        if (secondFrame) cancelAnimationFrame(secondFrame)
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [isMobile])

  return (
    <section
      id="polusi"
      ref={sectionRef}
      style={{
        minHeight: isMobile ? 'auto' : '100vh',
        height: isMobile ? 'auto' : '100vh',
        position: 'relative',
        overflow: isMobile ? 'visible' : 'hidden',
        background: C.bg,
        padding: isMobile ? '8rem 0' : 0,
      }}
    >
      <div
        style={{
          height: isMobile ? 'auto' : '100%',
          display: 'flex',
          flexDirection: 'column',
          paddingTop: isMobile ? 0 : 112,
        }}
      >
        {isMobile && (
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 2rem', width: '100%' }}>
            <SectionBridge label="Bentuk-bentuk polusi" />
          </div>
        )}

        <div
          ref={headRef}
          style={{
            maxWidth: 1280,
            margin: '0 auto',
            padding: '0 2rem',
            marginBottom: 40,
            flexShrink: 0,
            width: '100%',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 24, height: 1, background: C.accent }} />
                <span style={{ color: C.accent, fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase' }}>
                  Macam-Macam Polusi
                </span>
              </div>
              <SplitText
                text="Telusuri Polusi Satu Per Satu"
                className="font-display"
                tag="h2"
                delay={40}
                duration={1.25}
                ease="elastic.out(1, 0.3)"
                splitType="chars"
                from={{ opacity: 0, y: 40 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.1}
                rootMargin="-80px"
                textAlign="left"
              />
            </div>
            {!isMobile && (
              <p style={{ color: 'rgba(240,253,244,0.3)', fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                ← Scroll →
              </p>
            )}
          </div>
        </div>

        <div ref={shellRef} style={{ flex: isMobile ? 'none' : 1, overflow: 'hidden' }}>
          <div
            ref={trackRef}
            style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              gap: 24,
              padding: isMobile ? '0 2rem' : '0 32px',
              height: isMobile ? 'auto' : '100%',
              alignItems: isMobile ? 'stretch' : 'center',
              width: isMobile ? '100%' : 'max-content',
              willChange: 'transform',
            }}
          >
            {POLLUTION_TYPES.map((item) => (
              <article
                key={item.num}
                className="hover-lift-card"
                style={{
                  flexShrink: 0,
                  width: isMobile ? '100%' : 360,
                  height: isMobile ? 'auto' : 440,
                  border: '1px solid rgba(74,222,128,0.1)',
                  borderRadius: 2,
                  background: 'linear-gradient(160deg, rgba(13,31,9,0.95) 0%, rgba(6,15,4,1) 100%)',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'none',
                }}
              >
                <div style={{ height: 2, background: `linear-gradient(90deg, ${item.color}, transparent)` }} />
                <div style={{ padding: 32, display: 'flex', flexDirection: 'column', height: isMobile ? 'auto' : 'calc(100% - 2px)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                    <span className="font-display" style={{ fontSize: 56, fontWeight: 900, lineHeight: 1, color: item.color, opacity: 0.15 }}>
                      {item.num}
                    </span>
                    <span className="font-display" style={{ color: 'rgba(240,253,244,0.2)', fontSize: 22 }}>
                      {item.severity}
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '4px 12px',
                      borderRadius: 99,
                      marginBottom: 16,
                      width: 'fit-content',
                      background: `${item.color}15`,
                      border: `1px solid ${item.color}30`,
                    }}
                  >
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: item.color }} />
                    <span style={{ fontSize: 11, letterSpacing: '0.1em', color: item.color }}>{item.tag}</span>
                  </div>

                  <h3 className="font-display" style={{ fontSize: 22, fontWeight: 700, marginBottom: 12, lineHeight: 1.3, color: C.text }}>
                    {item.name}
                  </h3>
                  <p style={{ color: 'rgba(240,253,244,0.5)', fontSize: 14, lineHeight: 1.7, flex: 1 }}>{item.desc}</p>

                  <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid rgba(74,222,128,0.1)' }}>
                    <div className="font-display" style={{ fontSize: 20, fontWeight: 700, color: item.color }}>
                      {item.focus}
                    </div>
                    <div style={{ color: 'rgba(240,253,244,0.3)', fontSize: 11, marginTop: 2 }}>Fokus Dampak</div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
