'use client'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

const links = [
  { label: 'Beranda', id: 'home' },
  { label: 'Data', id: 'data' },
  { label: 'Dasar', id: 'dasar' },
  { label: 'Polusi', id: 'polusi' },
  { label: 'Kasus', id: 'kasus' },
  { label: 'Solusi', id: 'solusi' },
  { label: 'Kontribusi', id: 'kontribusi' },
]

const C = {
  bg: '#060f04',
  accent: '#4ade80',
  text: '#f0fdf4',
  moss: '#2d4a22',
}

export default function Navbar() {
  const logoRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const mobileMenuInnerRef = useRef<HTMLDivElement>(null)
  const mobileMenuTimelineRef = useRef<gsap.core.Timeline | null>(null)
  const [active, setActive] = useState('home')
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(logoRef.current, { opacity: 0, x: -20, duration: 0.6, ease: 'power3.out' })
      gsap.from('.nav-link', { opacity: 0, y: -16, duration: 0.5, ease: 'power3.out', stagger: 0.08, delay: 0.05 })
    })
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0)
      for (const { id } of links) {
        const el = document.getElementById(id)
        if (el) {
          const r = el.getBoundingClientRect()
          if (r.top <= 120 && r.bottom >= 120) setActive(id)
        }
      }
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => {
      ctx.revert()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    const menu = mobileMenuRef.current
    const inner = mobileMenuInnerRef.current
    if (!menu || !inner) return

    const links = inner.querySelectorAll('.mob-link')

    if (!mobileMenuTimelineRef.current) {
      gsap.set(menu, {
        display: 'none',
        opacity: 0,
        clipPath: 'circle(0% at calc(100% - 38px) 38px)',
      })
      gsap.set(links, { opacity: 0, y: 28, filter: 'blur(10px)' })

      mobileMenuTimelineRef.current = gsap.timeline({
        paused: true,
        defaults: { ease: 'power3.out' },
        onStart: () => {
          menu.style.display = 'flex'
        },
        onReverseComplete: () => {
          menu.style.display = 'none'
        },
      })

      mobileMenuTimelineRef.current
        .to(menu, {
          opacity: 1,
          clipPath: 'circle(160% at calc(100% - 38px) 38px)',
          duration: 0.5,
          ease: 'power2.out',
        })
        .fromTo(
          inner,
          { opacity: 0, y: 18, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 0.28 },
          '-=0.28'
        )
        .to(
          links,
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.38,
            stagger: 0.06,
          },
          '-=0.18'
        )
    }

    const tl = mobileMenuTimelineRef.current

    if (menuOpen) {
      tl.play()
    } else {
      tl.reverse()
    }
  }, [menuOpen])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          transition: 'all 0.5s',
          padding: scrolled ? '12px 0' : '20px 0',
          background: scrolled ? 'rgba(6,15,4,0.95)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(74,222,128,0.1)' : 'none',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: 'rgba(74,222,128,0.08)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${scrollProgress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #4ade80, #86efac)',
              boxShadow: '0 0 12px rgba(74,222,128,0.45)',
              transition: 'width 0.12s linear',
            }}
          />
        </div>
        <div
          style={{
            maxWidth: 1280,
            margin: '0 auto',
            padding: '0 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div
            ref={logoRef}
            onClick={() => scrollTo('home')}
            className="soft-link"
            style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'none' }}
          >
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <path d="M16 2C16 2 6 8 6 18C6 23.523 10.477 28 16 28C21.523 28 26 23.523 26 18C26 8 16 2 16 2Z" fill="#2d4a22" stroke="#4ade80" strokeWidth="1" />
              <path d="M16 28V16M16 16C16 16 10 12 8 8M16 16C16 16 22 12 24 8" stroke="#4ade80" strokeWidth="1" strokeLinecap="round" />
            </svg>
            <span className="font-display" style={{ fontSize: 16, fontWeight: 600, letterSpacing: 2, color: C.text }}>
              Green<span style={{ color: C.accent }}>Pulse</span>
            </span>
          </div>

          <div style={{ display: 'flex', gap: 32 }} className="desktop-nav">
            {links.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="nav-link nav-link-fx"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'none',
                  fontSize: 11,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: active === link.id ? C.accent : 'rgba(240,253,244,0.5)',
                  transition: 'color 0.3s',
                  borderBottom: active === link.id ? `1px solid ${C.accent}` : '1px solid transparent',
                  paddingBottom: 4,
                }}
              >
                {link.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: 'none', border: 'none', cursor: 'none', display: 'none', flexDirection: 'column', gap: 6, padding: 8 }}
            className="hamburger-btn soft-link"
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  display: 'block',
                  height: 1,
                  background: menuOpen ? C.accent : 'rgba(240,253,244,0.6)',
                  width: i === 1 ? (menuOpen ? 0 : 16) : 24,
                  transition: 'all 0.3s',
                  transform: menuOpen
                    ? i === 0
                      ? 'rotate(45deg) translate(4px, 4px)'
                      : i === 2
                        ? 'rotate(-45deg) translate(4px,-4px)'
                        : 'none'
                    : 'none',
                }}
              />
            ))}
          </button>
        </div>
      </nav>

      <div
        ref={mobileMenuRef}
        style={{
          display: 'none',
          position: 'fixed',
          inset: 0,
          zIndex: 40,
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 32,
          background: 'rgba(6,15,4,0.97)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div
          ref={mobileMenuInnerRef}
          style={{
            width: '100%',
            maxWidth: 420,
            padding: '2rem 2rem 2.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 8,
          }}
        >
          <div style={{ marginBottom: 18 }}>
            <div style={{ color: 'rgba(74,222,128,0.75)', fontSize: 11, letterSpacing: '0.32em', textTransform: 'uppercase', marginBottom: 10 }}>
              Navigasi
            </div>
            <div style={{ width: 72, height: 1, background: 'linear-gradient(90deg, rgba(74,222,128,0.8), transparent)' }} />
          </div>

          {links.map((link, i) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className="mob-link font-display soft-link"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'none',
                fontSize: 34,
                fontWeight: 700,
                lineHeight: 1.1,
                letterSpacing: 1.5,
                color: active === link.id ? C.accent : 'rgba(240,253,244,0.78)',
                padding: '0.45rem 0',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                width: 'auto',
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 400, color: 'rgba(74,222,128,0.35)', minWidth: 26 }}>
                0{i + 1}
              </span>
              {link.label}
            </button>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger-btn { display: flex !important; }
        }
      `}</style>
    </>
  )
}
