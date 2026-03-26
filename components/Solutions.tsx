'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionBridge from './SectionBridge'
import ScrollFloat from './animations/ScrollFloat'
import ScrambledText from './animations/ScrambledText'
import { createScrollInOut } from './animations/scrollInOut'

gsap.registerPlugin(ScrollTrigger)

const C = { bg: '#071205', accent: '#4ade80', text: '#f0fdf4' }

const SOLUTIONS = [
  {
    title: 'Kurangi sumber emisi di hulu',
    desc: 'Transportasi publik, transisi energi, efisiensi bangunan, dan pembatasan emisi industri adalah intervensi dengan dampak terbesar untuk udara bersih.',
  },
  {
    title: 'Bangun sistem sampah yang tidak bocor',
    desc: 'Pemilahan, pengurangan plastik sekali pakai, desain kemasan ulang, dan penegakan pengelolaan sampah mencegah polusi masuk ke sungai dan laut.',
  },
  {
    title: 'Pulihkan kualitas air dan tanah',
    desc: 'Pengolahan limbah cair, pemantauan logam berat, restorasi bantaran sungai, dan audit bahan kimia membantu memutus jalur pencemaran jangka panjang.',
  },
  {
    title: 'Perkuat literasi dan data publik',
    desc: 'Warga perlu akses ke data kualitas udara, air, dan limbah agar keputusan individu dan kebijakan tidak berjalan dalam gelap.',
  },
]

export default function Solutions() {
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
          fromY: 32,
          duration: 0.72,
          stagger: 0.08,
          start: 'top 93%',
          individual: isMobile,
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="solusi" ref={sectionRef} style={{ minHeight: '100vh', background: C.bg, padding: '8rem 0' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 2rem' }}>
        <SectionBridge label="Arah solusi yang bisa diterapkan" />
        <div ref={headRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 36, alignItems: 'end', marginBottom: 56 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 24, height: 1, background: C.accent }} />
              <span style={{ color: C.accent, fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase' }}>Solusi Umum</span>
            </div>
            <ScrollFloat
              animationDuration={1}
              ease="back.inOut(2)"
              scrollStart="center bottom+=50%"
              scrollEnd="bottom bottom-=40%"
              stagger={0.03}
              tag="h2"
              containerClassName="font-display"
              style={{ fontSize: 'clamp(2.3rem,4.6vw,4rem)', fontWeight: 700, lineHeight: 1.08, color: C.text }}
            >
              Bukan Sekadar Sadar, Kita Perlu Tindakan yang Terukur
            </ScrollFloat>
          </div>
          <ScrambledText
            radius={100}
            duration={1.2}
            speed={0.5}
            scrambleChars=".:"
            style={{ color: 'rgba(240,253,244,0.58)', fontSize: 15, lineHeight: 1.85 }}
          >
            Tidak ada satu solusi untuk semua jenis polusi. Namun ada pola yang selalu muncul: kurangi sumber pencemar, cegah kebocoran ke lingkungan, pulihkan ekosistem yang rusak, dan buka data ke publik.
          </ScrambledText>
        </div>

        <div ref={cardsRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
          {SOLUTIONS.map((item, index) => (
            <article key={item.title} className="hover-lift-card" style={{
              background: 'linear-gradient(180deg, rgba(13,31,9,0.74), rgba(7,17,5,0.96))',
              border: '1px solid rgba(74,222,128,0.1)',
              padding: 28,
              minHeight: 250,
            }}>
              <div className="font-display" style={{ fontSize: 34, color: 'rgba(74,222,128,0.28)', marginBottom: 18 }}>{`0${index + 1}`}</div>
              <h3 className="font-display" style={{ fontSize: 24, fontWeight: 600, color: C.text, marginBottom: 14 }}>{item.title}</h3>
              <p style={{ color: 'rgba(240,253,244,0.58)', fontSize: 14, lineHeight: 1.85 }}>{item.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
