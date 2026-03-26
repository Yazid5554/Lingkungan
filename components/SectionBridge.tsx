'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function SectionBridge({
  label,
  align = 'left',
}: {
  label: string
  align?: 'left' | 'center'
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(lineRef.current, { scaleY: 0, transformOrigin: 'top' })
      gsap.set(dotRef.current, { opacity: 0, scale: 0.4 })
      gsap.set(textRef.current, { opacity: 0, y: 10 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapRef.current,
          start: 'top 88%',
        },
      })

      tl.to(lineRef.current, { scaleY: 1, duration: 0.7, ease: 'power2.out' })
        .to(dotRef.current, { opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(2)' }, '-=0.15')
        .to(textRef.current, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }, '-=0.15')
    }, wrapRef)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={wrapRef}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: align === 'center' ? 'center' : 'flex-start',
        marginBottom: 36,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <div
          ref={lineRef}
          style={{
            width: 1,
            height: 56,
            background: 'linear-gradient(to bottom, rgba(74,222,128,0.6), rgba(74,222,128,0.05))',
          }}
        />
        <div
          ref={dotRef}
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: '#4ade80',
            boxShadow: '0 0 18px rgba(74,222,128,0.55)',
          }}
        />
      </div>
      <span
        ref={textRef}
        style={{
          marginTop: 14,
          color: 'rgba(240,253,244,0.28)',
          fontSize: 10,
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          textAlign: align,
        }}
      >
        {label}
      </span>
    </div>
  )
}