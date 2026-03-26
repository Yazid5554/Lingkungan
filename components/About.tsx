'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionBridge from './SectionBridge'
import Masonry from './Masonry'
import ScrollFloat from './animations/ScrollFloat'
import ScrambledText from './animations/ScrambledText'
import { createScrollInOut } from './animations/scrollInOut'

gsap.registerPlugin(ScrollTrigger)

const C = { bg: '#071205', accent: '#4ade80', text: '#f0fdf4' }

const INDICATORS = [
  {
    id: 'urgensi',
    type: 'indicator',
    value: '99%',
    label: 'Populasi dunia hidup di area dengan kualitas udara di atas ambang panduan WHO.',
    tone: 'Urgensi',
    height: 260,
  },
  {
    id: 'kesehatan',
    type: 'indicator',
    value: '7 Juta',
    label: 'Kematian dini per tahun dikaitkan dengan paparan polusi udara ambien dan rumah tangga.',
    tone: 'Kesehatan',
    height: 300,
  },
  {
    id: 'iklim',
    type: 'indicator',
    value: '1.55°C',
    label: 'Anomali suhu rata-rata global tahun 2024 di atas level pra-industri.',
    tone: 'Iklim',
    height: 260,
  },
  {
    id: 'sampah',
    type: 'indicator',
    value: '19-23 Jt',
    label: 'Ton sampah plastik diperkirakan masuk ke ekosistem perairan setiap tahun.',
    tone: 'Sampah',
    height: 280,
  },
]

const PRESSURES = [
  ['Udara kotor', 99],
  ['Polusi plastik', 78],
  ['Beban panas laut', 91],
  ['Risiko kesehatan kota', 84],
] as const

const DATA_ITEMS = [
  ...INDICATORS,
  { id: 'tekanan-sistem', type: 'pressure', height: 340 },
  { id: 'mengapa-penting', type: 'insight', height: 560 },
] as const

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const headRef = useRef<HTMLDivElement>(null)
  const infoGridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth <= 900

      gsap.from(sectionRef.current, {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' },
        opacity: 0.35,
        y: 40,
        duration: 0.9,
        ease: 'power2.out',
      })

      if (headRef.current) {
        createScrollInOut({
          trigger: headRef.current,
          items: Array.from(headRef.current.children),
          fromY: 40,
          duration: 0.8,
          stagger: 0.1,
          start: 'top 82%',
          individual: isMobile,
        })
      }

      if (infoGridRef.current) {
        const items = Array.from(infoGridRef.current.querySelectorAll('[data-scroll-card]'))
        createScrollInOut({
          trigger: infoGridRef.current,
          items,
          fromY: 34,
          duration: 0.7,
          stagger: 0.08,
          start: 'top 84%',
          individual: isMobile,
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="data" ref={sectionRef} style={{ minHeight: '100vh', background: C.bg, padding: '8rem 0', position: 'relative' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 2rem' }}>
        <SectionBridge label="Transisi ke data global" />

        <div
          ref={headRef}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 48,
            alignItems: 'end',
            marginBottom: 56,
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 24, height: 1, background: C.accent }} />
              <span style={{ color: C.accent, fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase' }}>Kondisi Bumi Saat Ini</span>
            </div>
            <ScrollFloat
              animationDuration={1}
              ease="back.inOut(2)"
              scrollStart="center bottom+=50%"
              scrollEnd="bottom bottom-=40%"
              stagger={0.03}
              containerClassName="font-display"
              tag="h2"
            >
              Data yang Membuat Krisis Ini Sulit Diabaikan
            </ScrollFloat>
          </div>
          <ScrambledText
            radius={100}
            duration={1.2}
            speed={0.5}
            scrambleChars=".:"
            style={{ color: 'rgba(240,253,244,0.55)', fontSize: 16, lineHeight: 1.8 }}
          >
            Section ini merangkum indikator global yang paling sering dipakai untuk membaca tekanan polusi dan perubahan sistem bumi. Angkanya bukan sekadar statistik, tetapi sinyal bahwa kesehatan manusia, air, udara, dan ekosistem saling terhubung.
          </ScrambledText>
        </div>

        <div ref={infoGridRef} style={{ paddingTop: 8 }}>
          <Masonry
          items={DATA_ITEMS}
          ease="power2.out"
          duration={1}
          stagger={0.1}
          animateFrom="bottom"
          scaleOnHover
          hoverScale={0.98}
          blurToFocus={false}
          colorShiftOnHover={false}
          renderItem={(item: typeof DATA_ITEMS[number]) => {
            if (item.type === 'indicator') {
              return (
                <article
                  data-scroll-card
                  className="hover-lift-card"
                  style={{
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(180deg, rgba(13,31,9,0.9) 0%, rgba(8,19,6,0.95) 100%)',
                    border: '1px solid rgba(74,222,128,0.12)',
                    padding: 28,
                    overflow: 'hidden',
                  }}
                >
                  <p style={{ color: 'rgba(74,222,128,0.7)', fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 18 }}>{item.tone}</p>
                  <div className="font-display" style={{ color: C.text, fontSize: 48, fontWeight: 700, lineHeight: 1, marginBottom: 18 }}>{item.value}</div>
                  <p style={{ color: 'rgba(240,253,244,0.58)', fontSize: 14, lineHeight: 1.8 }}>{item.label}</p>
                </article>
              )
            }

            if (item.type === 'pressure') {
              return (
                <div
                  data-scroll-card
                  className="hover-panel"
                  style={{
                    width: '100%',
                    height: '100%',
                    background: 'rgba(13,31,9,0.55)',
                    border: '1px solid rgba(74,222,128,0.1)',
                    padding: 28,
                    overflow: 'hidden',
                  }}
                >
                  <p style={{ color: 'rgba(240,253,244,0.35)', fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 28 }}>Tekanan Sistem</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
                    {PRESSURES.map(([label, value]) => (
                      <div key={label}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                          <span style={{ color: 'rgba(240,253,244,0.78)', fontSize: 14 }}>{label}</span>
                          <span className="font-display" style={{ color: C.accent, fontSize: 16 }}>{value}%</span>
                        </div>
                        <div style={{ height: 2, background: 'rgba(74,222,128,0.08)' }}>
                          <div style={{ width: `${value}%`, height: '100%', background: 'linear-gradient(90deg, #4ade80, rgba(74,222,128,0.35))' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            }

            return (
              <div
                data-scroll-card
                className="hover-panel"
                style={{
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(135deg, rgba(74,222,128,0.06), rgba(13,31,9,0.8))',
                  border: '1px solid rgba(74,222,128,0.12)',
                  padding: 28,
                  overflow: 'hidden',
                }}
              >
                <p style={{ color: 'rgba(240,253,244,0.35)', fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 20 }}>Mengapa Data Ini Penting</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  {[
                    'Udara kotor bukan cuma isu kota besar. Paparannya berkaitan langsung dengan penyakit jantung, stroke, paru, dan gangguan perkembangan.',
                    'Polusi plastik bukan hanya soal pantai kotor. Materialnya pecah menjadi mikroplastik yang bisa masuk ke rantai makanan dan sumber air.',
                    'Kenaikan suhu dan panas laut memperkuat dampak polusi karena memperburuk kekeringan, kebakaran, ledakan alga, dan tekanan pada sistem pangan.',
                  ].map((text) => (
                    <p key={text} style={{ color: 'rgba(240,253,244,0.6)', fontSize: 14, lineHeight: 1.8 }}>{text}</p>
                  ))}
                </div>
              </div>
            )
          }}
          />
        </div>
      </div>
    </section>
  )
}
