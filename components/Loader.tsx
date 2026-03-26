'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const loaderRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const countRef = useRef<HTMLSpanElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const hasRun = useRef(false)  // guard: cuma jalan sekali

  useEffect(() => {
    if (hasRun.current) return
    hasRun.current = true

    const tl = gsap.timeline()
    tl.from(logoRef.current, { opacity: 0, y: 20, duration: 0.45, ease: 'power3.out' })
      .to({ val: 0 }, {
        val: 100, duration: 1.2, ease: 'power2.out',
        onUpdate: function () {
          const v = Math.round(this.targets()[0].val)
          if (countRef.current) countRef.current.textContent = String(v).padStart(3, '0')
          if (barRef.current) barRef.current.style.width = v + '%'
        }
      }, '-=0.2')
      .to(logoRef.current, { opacity: 0, y: -20, duration: 0.25, ease: 'power2.in' })
      .to(loaderRef.current, { yPercent: -100, duration: 0.6, ease: 'power4.inOut', onComplete }, '-=0.05')

    // tidak pakai ctx.revert() supaya animasi tidak di-reset
  }, [])

  return (
    <div ref={loaderRef} style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: '#060f04', overflow: 'hidden',
    }}>
      {[20,35,50,65,80].map(y => (
        <div key={y} style={{ position: 'absolute', left: 0, right: 0, top: `${y}%`, height: 1, background: 'rgba(74,222,128,0.04)' }} />
      ))}

      <div ref={logoRef} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>
        <svg width="64" height="64" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="38" stroke="rgba(74,222,128,0.2)" strokeWidth="1"/>
          <path d="M40 10C40 10 20 22 20 40C20 51.046 29.002 60 40 60C50.998 60 60 51.046 60 40C60 22 40 10 40 10Z" fill="rgba(45,74,34,0.6)" stroke="#4ade80" strokeWidth="1.5"/>
          <path d="M40 60V35M40 35C40 35 28 27 24 18M40 35C40 35 52 27 56 18" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>

        <div style={{ textAlign: 'center' }}>
          <div className="font-display" style={{ fontSize: 22, fontWeight: 700, letterSpacing: 2, color: '#f0fdf4' }}>
            Green<span style={{ color: '#4ade80' }}>Pulse</span>
          </div>
          <div style={{ color: 'rgba(240,253,244,0.3)', fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', marginTop: 4 }}>
            Memuat Pengalaman
          </div>
        </div>

        <div style={{ width: 192, height: 1, background: 'rgba(74,222,128,0.1)', position: 'relative' }}>
          <div ref={barRef} style={{ position: 'absolute', top: 0, left: 0, height: '100%', background: '#4ade80', width: '0%', boxShadow: '0 0 10px #4ade80', transition: 'none' }} />
        </div>

        <span ref={countRef} className="font-display counter-num" style={{ fontSize: 48, fontWeight: 900, color: 'rgba(74,222,128,0.2)', letterSpacing: '-2px' }}>000</span>
      </div>

      <div style={{ position: 'absolute', bottom: 32, right: 32, color: 'rgba(74,222,128,0.2)', fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase' }}>Indonesia</div>
      <div style={{ position: 'absolute', top: 32, left: 32, color: 'rgba(74,222,128,0.2)', fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase' }}>Est. 2019</div>
    </div>
  )
}
