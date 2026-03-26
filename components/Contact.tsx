'use client'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionBridge from './SectionBridge'
import ScrollFloat from './animations/ScrollFloat'
import { createScrollInOut } from './animations/scrollInOut'

gsap.registerPlugin(ScrollTrigger)

const C = { bg: '#060f04', accent: '#4ade80', text: '#f0fdf4' }
const MOBILE_BREAKPOINT = 900

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const headRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const infoRef = useRef<HTMLDivElement>(null)
  const [sent, setSent] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', title: '', summary: '' })

  useEffect(() => {
    const updateViewport = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT)

    updateViewport()
    window.addEventListener('resize', updateViewport)

    const ctx = gsap.context(() => {
      const isMobileViewport = window.innerWidth <= MOBILE_BREAKPOINT

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
          individual: isMobileViewport,
        })
      }

      if (formRef.current) {
        createScrollInOut({
          trigger: formRef.current,
          items: Array.from(formRef.current.children),
          fromY: 28,
          duration: 0.65,
          stagger: 0.08,
          start: 'top 93%',
          individual: isMobileViewport,
        })
      }

      if (infoRef.current) {
        createScrollInOut({
          trigger: infoRef.current,
          items: Array.from(infoRef.current.children),
          fromX: 28,
          fromY: 0,
          duration: 0.65,
          stagger: 0.1,
          start: 'top 93%',
          individual: isMobileViewport,
        })
      }
    }, sectionRef)

    return () => {
      window.removeEventListener('resize', updateViewport)
      ctx.revert()
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <section id="kontribusi" ref={sectionRef} style={{
      minHeight: '100vh', padding: '8rem 0 4rem', position: 'relative', overflow: 'hidden',
      background: C.bg,
      backgroundImage: 'linear-gradient(rgba(74,222,128,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(74,222,128,0.03) 1px, transparent 1px)',
      backgroundSize: '60px 60px',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: isMobile ? '0 1.25rem' : '0 2rem' }}>
        <SectionBridge label="Partisipasi publik dan gagasan baru" />
        <div ref={headRef} style={{ marginBottom: 64, maxWidth: 860 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 24, height: 1, background: C.accent }} />
            <span style={{ color: C.accent, fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase' }}>Kontribusi Publik</span>
          </div>
          <ScrollFloat
            animationDuration={1.2}
            ease="back.inOut(2)"
            scrollStart="top bottom-=10%"
            scrollEnd="top center"
            stagger={0.04}
            tag="h2"
            containerClassName="font-display"
            style={{ fontSize: 'clamp(2.4rem,5vw,4.4rem)', fontWeight: 700, lineHeight: 1.08, color: C.text }}
          >
            Kirim Makalah, Jurnal, atau Ide Solusi yang Layak Uji
          </ScrollFloat>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: isMobile ? 28 : 40,
            justifyItems: isMobile ? 'center' : 'stretch',
          }}
        >
          <div style={{ width: isMobile ? '100%' : undefined, maxWidth: isMobile ? 320 : undefined }}>
            {!sent ? (
              <form ref={formRef} onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
                  <div>
                    <label style={{ display: 'block', color: 'rgba(240,253,244,0.35)', fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 8 }}>Nama</label>
                    <input className="eco-input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Nama penulis / tim" required />
                  </div>
                  <div>
                    <label style={{ display: 'block', color: 'rgba(240,253,244,0.35)', fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 8 }}>Email</label>
                    <input type="email" className="eco-input" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="alamat@email.com" required />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', color: 'rgba(240,253,244,0.35)', fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 8 }}>Judul Makalah / Solusi</label>
                  <input className="eco-input" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Contoh: Model filter udara modular untuk sekolah padat" required />
                </div>
                <div>
                  <label style={{ display: 'block', color: 'rgba(240,253,244,0.35)', fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 8 }}>Ringkasan</label>
                  <textarea className="eco-input" rows={7} value={form.summary} onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))} placeholder="Jelaskan masalah yang ditangani, metode, dan kenapa solusi ini layak dipertimbangkan." required style={{ resize: 'none' }} />
                </div>
                <button type="submit" className="btn-eco" style={{ alignSelf: isMobile ? 'center' : 'flex-start' }}>Ajukan Solusi</button>
              </form>
            ) : (
              <div style={{ minHeight: 260, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ width: 54, height: 54, borderRadius: '50%', border: '1px solid rgba(74,222,128,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                  <span style={{ color: C.accent, fontSize: 24 }}>+</span>
                </div>
                <h3 className="font-display" style={{ color: C.text, fontSize: 28, marginBottom: 10 }}>Usulan diterima, {form.name}.</h3>
                <p style={{ color: 'rgba(240,253,244,0.56)', fontSize: 15, lineHeight: 1.8, maxWidth: 560 }}>
                  Ringkasan solusi kamu masuk ke tahap kurasi awal. Jika layak, pendekatan ini bisa ditampilkan sebagai rekomendasi tambahan di section solusi.
                </p>
              </div>
            )}
          </div>

          <div
            ref={infoRef}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 18,
              alignItems: isMobile ? 'center' : 'stretch',
              width: isMobile ? '100%' : undefined,
              maxWidth: isMobile ? 320 : undefined,
            }}
          >
            {[
              ['Prioritas', 'Solusi yang menurunkan emisi, limbah, atau paparan polusi secara terukur.'],
              ['Format', 'Makalah, jurnal, prototipe, policy brief, atau kerangka eksperimen lapangan.'],
              ['Kurasi', 'Tim akan menilai kelayakan ilmiah, dampak, skalabilitas, dan kemudahan implementasi.'],
            ].map(([label, value]) => (
              <div
                key={label}
                className="hover-panel"
                style={{
                  width: '100%',
                  margin: 0,
                  background: 'rgba(13,31,9,0.66)',
                  border: '1px solid rgba(74,222,128,0.1)',
                  padding: 22,
                }}
              >
                <p style={{ color: C.accent, fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 8 }}>{label}</p>
                <p style={{ color: 'rgba(240,253,244,0.58)', fontSize: 14, lineHeight: 1.82 }}>{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 96, paddingTop: 26, borderTop: '1px solid rgba(74,222,128,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 12 : 24 }}>
          <p style={{ color: 'rgba(240,253,244,0.24)', fontSize: 12 }}>GreenPulse 2026 • Tema edukasi polusi dan partisipasi publik</p>
          <p style={{ color: 'rgba(240,253,244,0.24)', fontSize: 12 }}>Bumi pulih lebih cepat saat pengetahuan dibuka untuk banyak orang</p>
        </div>
      </div>
    </section>
  )
}
