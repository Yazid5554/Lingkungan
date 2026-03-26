'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionBridge from './SectionBridge'
import ScrollFloat from './animations/ScrollFloat'
import { createScrollInOut } from './animations/scrollInOut'

gsap.registerPlugin(ScrollTrigger)

const C = { bg: '#060f04', accent: '#4ade80', text: '#f0fdf4' }

const CASES = [
  {
    region: 'Asia Selatan',
    place: 'Delhi, India',
    year: '2025',
    title: 'Kabut asap ekstrem kembali menekan kota padat penduduk',
    desc: 'Campuran emisi kendaraan, industri, pembakaran residu, dan kondisi meteorologi membuat kualitas udara masuk kategori berbahaya dan memukul kesehatan publik.',
  },
  {
    region: 'Afrika Barat',
    place: 'Lagos, Nigeria',
    year: '2024',
    title: 'Sampah plastik dan drainase memperparah banjir perkotaan',
    desc: 'Ketika aliran air tersumbat, hujan ekstrem berubah menjadi krisis sanitasi dan ekonomi. Ini menunjukkan polusi padat tidak berdiri sendiri, tapi memperkuat bencana lain.',
  },
  {
    region: 'Amerika Latin',
    place: 'Sungai-sungai Amazon',
    year: '2024',
    title: 'Tekanan gabungan limbah, kebakaran, dan panas memperburuk kualitas ekosistem',
    desc: 'Polusi dan perubahan iklim bekerja bersama: suhu naik, kualitas air terganggu, dan habitat rentan terhadap kehilangan spesies serta gangguan mata pencaharian.',
  },
  {
    region: 'Eropa',
    place: 'Berbagai kota besar',
    year: '2025',
    title: 'Debat kebijakan udara bersih makin keras karena beban kesehatan tetap tinggi',
    desc: 'Meski regulasi membaik, isu NO2, partikel halus, dan emisi transportasi masih memaksa kota-kota menimbang ulang desain mobilitas dan kawasan rendah emisi.',
  },
]

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null)
  const headRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

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
          fromY: 36,
          duration: 0.75,
          stagger: 0.1,
          start: 'top 92%',
          individual: isMobile,
        })
      }

      if (cardsRef.current) {
        createScrollInOut({
          trigger: cardsRef.current,
          items: Array.from(cardsRef.current.children),
          fromY: 36,
          duration: 0.75,
          stagger: 0.08,
          start: 'top 93%',
          individual: isMobile,
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="kasus" ref={sectionRef} style={{
      padding: '8rem 0', position: 'relative',
      background: 'linear-gradient(180deg, #060f04 0%, #091606 50%, #060f04 100%)',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 2rem' }}>
        <SectionBridge label="Dampak yang sudah terjadi" />
        <div ref={headRef} style={{ marginBottom: 60, maxWidth: 860 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 24, height: 1, background: C.accent }} />
            <span style={{ color: C.accent, fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase' }}>Kasus Dunia</span>
          </div>
          <ScrollFloat
            animationDuration={1.2}
            ease="back.inOut(2)"
            scrollStart="top bottom-=10%"
            scrollEnd="top center"
            stagger={0.04}
            tag="h2"
            containerClassName="font-display"
            style={{ fontSize: 'clamp(2.3rem,4.6vw,4rem)', fontWeight: 700, lineHeight: 1.08, color: C.text }}
          >
            Polusi Bukan Teori. Ia Sudah Jadi Krisis Nyata
          </ScrollFloat>
        </div>

        <div ref={cardsRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
          {CASES.map((item) => (
            <article key={item.place} className="hover-lift-card" style={{
              padding: 28,
              background: 'rgba(13,31,9,0.62)',
              border: '1px solid rgba(74,222,128,0.1)',
              minHeight: 320,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 18, gap: 16 }}>
                <span style={{ color: C.accent, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase' }}>{item.region}</span>
                <span style={{ color: 'rgba(240,253,244,0.25)', fontSize: 12 }}>{item.year}</span>
              </div>
              <h3 className="font-display" style={{ fontSize: 26, lineHeight: 1.15, fontWeight: 600, color: C.text, marginBottom: 10 }}>{item.place}</h3>
              <p style={{ color: 'rgba(240,253,244,0.74)', fontSize: 15, lineHeight: 1.7, marginBottom: 14 }}>{item.title}</p>
              <p style={{ color: 'rgba(240,253,244,0.5)', fontSize: 14, lineHeight: 1.82 }}>{item.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
