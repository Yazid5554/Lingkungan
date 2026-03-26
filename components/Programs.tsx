'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionBridge from './SectionBridge'
import ScrollFloat from './animations/ScrollFloat'
import { createScrollInOut } from './animations/scrollInOut'

gsap.registerPlugin(ScrollTrigger)

const C = { bg: '#060f04', accent: '#4ade80', text: '#f0fdf4' }

const FOUNDATIONS = [
  {
    title: 'Apa Itu Lingkungan',
    desc: 'Lingkungan adalah jaringan yang menyatukan udara, air, tanah, energi, iklim, tumbuhan, hewan, dan aktivitas manusia. Saat satu bagian rusak, efeknya menyebar ke bagian lain dengan cepat.',
  },
  {
    title: 'Apa Itu Polusi',
    desc: 'Polusi terjadi ketika zat, energi, atau material masuk ke sistem alam dalam jumlah yang melebihi kemampuan alam untuk menetralkan, mengurai, atau memulihkannya.',
  },
  {
    title: 'Mengapa Universal',
    desc: 'Polusi tidak berhenti di batas kota atau negara. Asap, mikroplastik, dan limpasan kimia bisa bergerak lewat angin, sungai, rantai makanan, bahkan produk yang kita konsumsi tiap hari.',
  },
]

const RARE_FACTS = [
  'Polusi rumah tangga dari bahan bakar memasak masih memengaruhi miliaran orang dan sering luput dari pembahasan karena tidak selalu terlihat dari jalanan kota.',
  'Nitrogen reaktif dari pupuk dan pembakaran dapat memicu hujan asam, ledakan alga, dan kematian zona pesisir tanpa banyak disadari publik.',
  'Polusi cahaya mengganggu migrasi burung, serangga penyerbuk, dan ritme biologis manusia, padahal sering dianggap masalah sepele.',
  'Partikel halus dapat membawa campuran logam berat dan senyawa beracun, jadi ancaman polusi udara bukan hanya soal asap yang tampak oleh mata.',
]

export default function Programs() {
  const sectionRef = useRef<HTMLElement>(null)
  const headRef = useRef<HTMLDivElement>(null)
  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth <= 900

      if (headRef.current) {
        createScrollInOut({
          trigger: headRef.current,
          items: Array.from(headRef.current.children),
          fromY: 28,
          duration: 0.7,
          stagger: 0.1,
          start: 'top 82%',
          individual: isMobile,
        })
      }

      if (leftRef.current) {
        createScrollInOut({
          trigger: leftRef.current,
          items: Array.from(leftRef.current.children),
          fromX: -20,
          fromY: 0,
          duration: 0.65,
          stagger: 0.08,
          start: 'top 82%',
          individual: isMobile,
        })
      }

      if (rightRef.current) {
        createScrollInOut({
          trigger: rightRef.current,
          items: [rightRef.current],
          fromX: 20,
          fromY: 0,
          duration: 0.65,
          stagger: 0,
          start: 'top 82%',
          individual: isMobile,
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="dasar" ref={sectionRef} style={{ minHeight: '100vh', background: C.bg, padding: '8rem 0', position: 'relative' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 2rem' }}>
        <SectionBridge label="Dari data ke pemahaman dasar" />
        <div ref={headRef} style={{ marginBottom: 60, maxWidth: 820 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 24, height: 1, background: C.accent }} />
            <span style={{ color: C.accent, fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase' }}>Dasar Pemahaman</span>
          </div>
          <ScrollFloat
            animationDuration={1.2}
            ease="back.inOut(2)"
            scrollStart="top bottom-=10%"
            scrollEnd="top center"
            stagger={0.04}
            tag="h2"
            containerClassName="font-display"
            style={{ fontSize: 'clamp(2.3rem,4.8vw,4.2rem)', fontWeight: 700, lineHeight: 1.08, color: C.text }}
          >
            Memahami Lingkungan, Sebelum Membahas Solusi
          </ScrollFloat>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32 }}>
          <div ref={leftRef} style={{ display: 'grid', gap: 18 }}>
            {FOUNDATIONS.map((item, index) => (
              <article key={item.title} className="hover-lift-card" style={{ background: 'rgba(13,31,9,0.68)', border: '1px solid rgba(74,222,128,0.1)', padding: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                  <span className="font-display" style={{ color: 'rgba(74,222,128,0.45)', fontSize: 28 }}>{`0${index + 1}`}</span>
                  <h3 className="font-display" style={{ fontSize: 24, color: C.text, fontWeight: 600 }}>{item.title}</h3>
                </div>
                <p style={{ color: 'rgba(240,253,244,0.6)', fontSize: 15, lineHeight: 1.9 }}>{item.desc}</p>
              </article>
            ))}
          </div>

          <div ref={rightRef} className="hover-panel" style={{ background: 'linear-gradient(180deg, rgba(10,24,7,0.98) 0%, rgba(8,18,6,0.92) 100%)', border: '1px solid rgba(74,222,128,0.1)', padding: 28 }}>
            <p style={{ color: 'rgba(240,253,244,0.35)', fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 22 }}>Fakta Penting Yang Jarang Dibahas</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {RARE_FACTS.map((fact) => (
                <div key={fact} style={{ display: 'grid', gridTemplateColumns: '18px 1fr', gap: 14, alignItems: 'start' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.accent, boxShadow: '0 0 12px rgba(74,222,128,0.45)', marginTop: 8 }} />
                  <p style={{ color: 'rgba(240,253,244,0.62)', fontSize: 14, lineHeight: 1.85 }}>{fact}</p>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 26, paddingTop: 22, borderTop: '1px solid rgba(74,222,128,0.08)' }}>
              <p style={{ color: 'rgba(240,253,244,0.45)', fontSize: 13, lineHeight: 1.8 }}>
                Intinya: polusi bukan cuma sampah yang menumpuk. Ia bisa hadir sebagai partikel, bahan kimia, suara, panas, cahaya, hingga senyawa yang
                tidak tampak namun tetap mengubah ekosistem dan kesehatan manusia.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
